// app.js
const express = require('express');
require('dotenv').config();

const parkingRoutes = require('./routes/parking');
const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/driver');
const reportRoutes = require('./routes/reports');

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'NCPS API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});