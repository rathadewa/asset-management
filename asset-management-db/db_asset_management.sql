-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 18, 2025 at 08:22 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_asset_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_assets`
--

CREATE TABLE `tb_assets` (
  `asset_id` varchar(15) NOT NULL,
  `asset_name` varchar(255) NOT NULL,
  `category` text DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_assets`
--

INSERT INTO `tb_assets` (`asset_id`, `asset_name`, `category`, `status`, `location`, `created_date`, `updated_at`, `created_by`, `updated_by`) VALUES
('A06190001', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 01:06:56', '2025-06-19 01:06:56', 'admin02', 'admin02'),
('A06190002', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 01:06:59', '2025-06-19 01:06:59', 'admin02', 'admin02'),
('A06190003', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 01:07:00', '2025-06-19 01:07:00', 'admin02', 'admin02'),
('A06190004', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 01:07:00', '2025-06-19 01:07:00', 'admin02', 'admin02'),
('A06190005', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 01:07:01', '2025-06-19 01:07:01', 'admin02', 'admin02'),
('A06253', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 00:00:29', '2025-06-19 00:00:29', NULL, NULL),
('A06254', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 00:00:32', '2025-06-19 00:00:32', NULL, NULL),
('A06255', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 00:45:04', '2025-06-19 00:45:04', NULL, NULL),
('A06256', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 00:53:03', '2025-06-19 00:53:03', NULL, NULL),
('A1906250002', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 01:17:51', '2025-06-19 01:17:51', 'admin02', 'admin02'),
('A1906250003', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 01:17:37', '2025-06-19 01:17:37', 'admin02', 'admin02'),
('A1906250007', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 01:19:05', '2025-06-19 01:19:05', 'admin02', 'admin02'),
('A1906250008', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 01:19:38', '2025-06-19 01:19:38', 'admin02', 'admin02'),
('A1906250009', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 01:19:40', '2025-06-19 01:19:40', 'admin02', 'admin02'),
('A1906250010', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-19 01:19:40', '2025-06-19 01:19:40', 'admin02', 'admin02'),
('A1906250011', 'Laptop Lenovo ThinkPad', 'Elektronik', 'Deployed', 'Gudang Bdddddd', '2025-06-19 01:20:27', '2025-06-19 01:20:45', 'admin02', 'admin02');

-- --------------------------------------------------------

--
-- Table structure for table `tb_request`
--

CREATE TABLE `tb_request` (
  `request_id` varchar(15) NOT NULL,
  `asset_id` varchar(15) DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `created_date` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_request`
--

INSERT INTO `tb_request` (`request_id`, `asset_id`, `request_date`, `created_date`, `updated_at`, `created_by`, `updated_by`) VALUES
('REQ0NaN', 'A06253', '2025-06-17', '2025-06-19 01:14:28', '2025-06-19 01:14:28', 'admin02', 'admin02'),
('REQ1001', 'A06255', '2025-06-17', '2025-06-19 00:56:50', '2025-06-19 00:57:49', NULL, NULL),
('REQ1002', 'A06253', '2025-06-17', '2025-06-19 01:16:03', '2025-06-19 01:16:03', 'admin02', 'admin02'),
('REQ1003', 'A06253', '2025-06-17', '2025-06-19 01:16:05', '2025-06-19 01:16:05', 'admin02', 'admin02'),
('REQ1004', 'A06253', '2025-06-17', '2025-06-19 01:16:06', '2025-06-19 01:16:06', 'admin02', 'admin02'),
('REQ1005', 'A06253', '2025-06-17', '2025-06-19 01:16:07', '2025-06-19 01:16:07', 'admin02', 'admin02'),
('REQ1006', 'A06253', '2025-06-17', '2025-06-19 01:16:08', '2025-06-19 01:16:08', 'admin02', 'admin02'),
('REQ1007', 'A06253', '2025-06-17', '2025-06-19 01:16:09', '2025-06-19 01:16:09', 'admin02', 'admin02'),
('REQ1008', 'A06253', '2025-06-17', '2025-06-19 01:16:09', '2025-06-19 01:16:09', 'admin02', 'admin02'),
('REQ1010', 'A06253', '2025-06-17', '2025-06-19 01:17:01', '2025-06-19 01:17:01', 'admin02', 'admin02'),
('REQ1011', 'A06253', '2025-06-17', '2025-06-19 01:17:15', '2025-06-19 01:17:15', 'admin02', 'admin02');

-- --------------------------------------------------------

--
-- Table structure for table `tb_user`
--

CREATE TABLE `tb_user` (
  `user_id` varchar(50) NOT NULL,
  `user_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_user`
--

INSERT INTO `tb_user` (`user_id`, `user_password`) VALUES
('admin01', '$'),
('admin02', '$2b$10$J4HowVZpm.DKJ/vK12p52OCDbntNfcqFAVg1Nqp4THuRZpsROz6j.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_assets`
--
ALTER TABLE `tb_assets`
  ADD PRIMARY KEY (`asset_id`),
  ADD KEY `fk_assets_created_by` (`created_by`),
  ADD KEY `fk_assets_updated_by` (`updated_by`);

--
-- Indexes for table `tb_request`
--
ALTER TABLE `tb_request`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `fk_request_created_by` (`created_by`),
  ADD KEY `fk_request_updated_by` (`updated_by`),
  ADD KEY `fk_asset_id` (`asset_id`);

--
-- Indexes for table `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`user_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_assets`
--
ALTER TABLE `tb_assets`
  ADD CONSTRAINT `fk_assets_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assets_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `tb_request`
--
ALTER TABLE `tb_request`
  ADD CONSTRAINT `fk_asset_id` FOREIGN KEY (`asset_id`) REFERENCES `tb_assets` (`asset_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_request_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_request_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
