-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 18, 2025 at 10:34 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ncps`
--

-- --------------------------------------------------------

--
-- Table structure for table `ParkingRecord`
--

CREATE TABLE `ParkingRecord` (
  `recordId` int(11) NOT NULL,
  `entryTime` datetime NOT NULL,
  `exitTime` datetime DEFAULT NULL,
  `totalHours` int(11) DEFAULT NULL,
  `totalAmount` int(11) DEFAULT NULL,
  `vehicleId` int(11) NOT NULL,
  `recordedBy` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ParkingRecord`
--

INSERT INTO `ParkingRecord` (`recordId`, `entryTime`, `exitTime`, `totalHours`, `totalAmount`, `vehicleId`, `recordedBy`, `createdAt`) VALUES
(1, '2025-12-17 20:34:52', '2025-12-17 20:38:10', 1, 1500, 1, 1, '2025-12-17 18:34:52'),
(2, '2025-12-17 21:03:56', '2025-12-17 21:19:40', 1, 1500, 2, 1, '2025-12-17 19:03:56'),
(3, '2025-12-17 21:04:10', NULL, NULL, NULL, 3, 1, '2025-12-17 19:04:10'),
(4, '2025-12-17 21:16:52', NULL, NULL, NULL, 1, 1, '2025-12-17 19:16:52');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `userId` int(11) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `role` enum('MANAGER','DRIVER') NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`userId`, `fullName`, `phone`, `username`, `passwordHash`, `role`, `createdAt`) VALUES
(1, 'Admin Manager', '0788000001', 'admin1', '$2b$10$pd0Pou46qJsFrmD.IvJTlOfxdvY0zprjLwBpWpAmd6dJ1uv2EfwE2', 'MANAGER', '2025-12-17 18:18:26'),
(2, 'John Driver', '0788000002', 'driver1', '$2b$10$fIGa94nQzdhzhXtzllRQeOiOl1Lpt.LR9qkzFHfoPKl8P9e14Ld3.', 'DRIVER', '2025-12-17 18:24:01');

-- --------------------------------------------------------

--
-- Table structure for table `Vehicle`
--

CREATE TABLE `Vehicle` (
  `vehicleId` int(11) NOT NULL,
  `plateNumber` varchar(20) NOT NULL,
  `vehicleType` varchar(50) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Vehicle`
--

INSERT INTO `Vehicle` (`vehicleId`, `plateNumber`, `vehicleType`, `userId`, `createdAt`) VALUES
(1, 'RAB123C', 'Car', 2, '2025-12-17 18:34:52'),
(2, 'RAB12d3C', 'Car', 2, '2025-12-17 19:03:56'),
(3, 'RAB12d3Cf', 'Car', 2, '2025-12-17 19:04:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ParkingRecord`
--
ALTER TABLE `ParkingRecord`
  ADD PRIMARY KEY (`recordId`),
  ADD KEY `fk_parking_vehicle` (`vehicleId`),
  ADD KEY `fk_parking_manager` (`recordedBy`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `Vehicle`
--
ALTER TABLE `Vehicle`
  ADD PRIMARY KEY (`vehicleId`),
  ADD UNIQUE KEY `plateNumber` (`plateNumber`),
  ADD KEY `fk_vehicle_user` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ParkingRecord`
--
ALTER TABLE `ParkingRecord`
  MODIFY `recordId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Vehicle`
--
ALTER TABLE `Vehicle`
  MODIFY `vehicleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ParkingRecord`
--
ALTER TABLE `ParkingRecord`
  ADD CONSTRAINT `fk_parking_manager` FOREIGN KEY (`recordedBy`) REFERENCES `User` (`userId`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_parking_vehicle` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle` (`vehicleId`) ON UPDATE CASCADE;

--
-- Constraints for table `Vehicle`
--
ALTER TABLE `Vehicle`
  ADD CONSTRAINT `fk_vehicle_user` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
