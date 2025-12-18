// routes/parking.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { calculateParkingFee } = require('../utils/fees');
const { authenticate, authorizeRole } = require('../middleware/auth');

// All parking routes require an authenticated MANAGER
router.use(authenticate, authorizeRole('MANAGER'));

/**
 * POST /api/parking/entry
 * body: { plateNumber, vehicleType, userId (owner driver) }
 */
router.post('/entry', async (req, res) => {
  const { plateNumber, vehicleType, userId } = req.body;

  if (!plateNumber || !vehicleType || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const recordedBy = req.user.userId;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1) Find or create vehicle
    const [vehicleRows] = await connection.execute(
      'SELECT vehicleId FROM Vehicle WHERE plateNumber = ?',
      [plateNumber]
    );

    let vehicleId;
    if (vehicleRows.length > 0) {
      vehicleId = vehicleRows[0].vehicleId;
    } else {
      const [result] = await connection.execute(
        'INSERT INTO Vehicle (plateNumber, vehicleType, userId) VALUES (?, ?, ?)',
        [plateNumber, vehicleType, userId]
      );
      vehicleId = result.insertId;
    }

    // 2) Create ParkingRecord with entryTime = NOW()
    const [insertResult] = await connection.execute(
      'INSERT INTO ParkingRecord (entryTime, vehicleId, recordedBy) VALUES (NOW(), ?, ?)',
      [vehicleId, recordedBy]
    );

    await connection.commit();

    res.status(201).json({
      message: 'Vehicle entry recorded',
      recordId: insertResult.insertId,
      vehicleId,
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    connection.release();
  }
});

/**
 * PUT /api/parking/exit/:recordId
 * body: { exitTime? }  // optional, default NOW()
 */
router.put('/exit/:recordId', async (req, res) => {
  const { recordId } = req.params;
  const { exitTime } = req.body;

  const connection = await pool.getConnection();
  try {
    // 1) Get record with entryTime
    const [rows] = await connection.execute(
      'SELECT entryTime, exitTime FROM ParkingRecord WHERE recordId = ?',
      [recordId]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Parking record not found' });
    }

    const record = rows[0];
    if (record.exitTime) {
      connection.release();
      return res.status(400).json({ message: 'Exit already recorded' });
    }

    // 2) Determine exit time
    const effectiveExitTime = exitTime || new Date();

    const { totalHours, totalAmount } = calculateParkingFee(
      record.entryTime,
      effectiveExitTime
    );

    // 3) Update record
    await connection.execute(
      'UPDATE ParkingRecord SET exitTime = ?, totalHours = ?, totalAmount = ? WHERE recordId = ?',
      [effectiveExitTime, totalHours, totalAmount, recordId]
    );

    res.json({
      message: 'Vehicle exit recorded',
      recordId,
      totalHours,
      totalAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    connection.release();
  }
});

/**
 * GET /api/parking/current
 * List all vehicles currently parked (exitTime IS NULL)
 */
router.get('/current', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT pr.recordId, pr.entryTime, v.plateNumber, v.vehicleType
       FROM ParkingRecord pr
       JOIN Vehicle v ON pr.vehicleId = v.vehicleId
       WHERE pr.exitTime IS NULL
       ORDER BY pr.entryTime ASC`
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;