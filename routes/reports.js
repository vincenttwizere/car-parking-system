// routes/reports.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorizeRole } = require('../middleware/auth');

// All report routes require an authenticated MANAGER
router.use(authenticate, authorizeRole('MANAGER'));

/**
 * GET /api/reports/daily?date=YYYY-MM-DD
 * Returns total revenue and count of completed parking records for that day
 */
router.get('/daily', async (req, res) => {
  const { date } = req.query; // expected format: YYYY-MM-DD

  if (!date) {
    return res.status(400).json({ message: 'date query parameter is required (YYYY-MM-DD)' });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT IFNULL(SUM(totalAmount), 0) AS totalRevenue,
              COUNT(*) AS totalRecords
       FROM ParkingRecord
       WHERE DATE(exitTime) = ?`,
      [date]
    );

    res.json({
      date,
      totalRevenue: rows[0].totalRevenue,
      totalRecords: rows[0].totalRecords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/reports/monthly?year=YYYY&month=MM
 * Returns total revenue and count of completed parking records for that month
 */
router.get('/monthly', async (req, res) => {
  const { year, month } = req.query; // month: 1-12 or 01-12

  if (!year || !month) {
    return res
      .status(400)
      .json({ message: 'year and month query parameters are required (e.g., year=2025&month=12)' });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT IFNULL(SUM(totalAmount), 0) AS totalRevenue,
              COUNT(*) AS totalRecords
       FROM ParkingRecord
       WHERE YEAR(exitTime) = ?
         AND MONTH(exitTime) = ?`,
      [year, month]
    );

    res.json({
      year: Number(year),
      month: Number(month),
      totalRevenue: rows[0].totalRevenue,
      totalRecords: rows[0].totalRecords,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
