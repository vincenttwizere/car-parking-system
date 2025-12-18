// utils/fees.js
function calculateParkingFee(entryTime, exitTime) {
  const start = new Date(entryTime);
  const end = new Date(exitTime);

  const diffMs = end - start;
  const hours = Math.ceil(diffMs / (1000 * 60 * 60)); // partial hour as full

  if (hours <= 0) {
    return { totalHours: 0, totalAmount: 0 };
  }

  let totalAmount;
  if (hours <= 2) {
    totalAmount = 1500;
  } else {
    totalAmount = 1500 + (hours - 2) * 1000;
  }

  return { totalHours: hours, totalAmount };
}

module.exports = { calculateParkingFee };