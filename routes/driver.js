// routes/driver.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorizeRole } = require('../middleware/auth');

// All driver routes require an authenticated DRIVER
router.use(authenticate, authorizeRole('DRIVER'));

/**
 * GET /api/drivers/me/vehicles
 * Returns all vehicles owned by the logged-in driver
 */
router.get('/me/vehicles', async (req, res) => {
  const userId = req.user.userId;

  try {
    const [rows] = await pool.execute(
      'SELECT vehicleId, plateNumber, vehicleType, createdAt FROM Vehicle WHERE userId = ?',
      [userId]
    );

    res.json({
      userId,
      vehicles: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/drivers/me/parking
 * Returns all parking records for vehicles owned by the logged-in driver
 */
router.get('/me/parking', async (req, res) => {
  const userId = req.user.userId;

  try {
    const [rows] = await pool.execute(
      `SELECT pr.recordId,
              pr.entryTime,
              pr.exitTime,
              pr.totalHours,
              pr.totalAmount,
              v.vehicleId,
              v.plateNumber,
              v.vehicleType
       FROM ParkingRecord pr
       JOIN Vehicle v ON pr.vehicleId = v.vehicleId
       WHERE v.userId = ?
       ORDER BY pr.entryTime DESC`,
      [userId]
    );

    res.json({
      userId,
      parkingRecords: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
