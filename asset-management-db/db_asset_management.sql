-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 17 Jun 2025 pada 19.20
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

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
-- Struktur dari tabel `tb_assets`
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
-- Dumping data untuk tabel `tb_assets`
--

INSERT INTO `tb_assets` (`asset_id`, `asset_name`, `category`, `status`, `location`, `created_date`, `updated_at`, `created_by`, `updated_by`) VALUES
('A06251', 'Laptop Lenovo', 'Elektronik', 'Ready to Deploy', 'Gudang A', '2025-06-17 23:42:36', '2025-06-17 23:42:36', 'firmanakbarm', 'firmanakbarm');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_request`
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
-- Dumping data untuk tabel `tb_request`
--

INSERT INTO `tb_request` (`request_id`, `asset_id`, `request_date`, `created_date`, `updated_at`, `created_by`, `updated_by`) VALUES
('REQ1001', 'A06251', '2025-06-17', '2025-06-18 00:11:54', '2025-06-18 00:11:54', 'firmanakbarm', 'firmanakbarm');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tb_user`
--

CREATE TABLE `tb_user` (
  `user_id` varchar(50) NOT NULL,
  `user_password` char(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tb_user`
--

INSERT INTO `tb_user` (`user_id`, `user_password`) VALUES
('firmanakbarm', 'P@ssw0rd'),
('reyhan', 'P@ssw0rd123');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `tb_assets`
--
ALTER TABLE `tb_assets`
  ADD PRIMARY KEY (`asset_id`),
  ADD KEY `fk_assets_created_by` (`created_by`),
  ADD KEY `fk_assets_updated_by` (`updated_by`);

--
-- Indeks untuk tabel `tb_request`
--
ALTER TABLE `tb_request`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `fk_request_created_by` (`created_by`),
  ADD KEY `fk_request_updated_by` (`updated_by`),
  ADD KEY `fk_asset_id` (`asset_id`);

--
-- Indeks untuk tabel `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`user_id`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `tb_assets`
--
ALTER TABLE `tb_assets`
  ADD CONSTRAINT `fk_assets_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assets_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tb_request`
--
ALTER TABLE `tb_request`
  ADD CONSTRAINT `fk_asset_id` FOREIGN KEY (`asset_id`) REFERENCES `tb_assets` (`asset_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_request_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_request_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
