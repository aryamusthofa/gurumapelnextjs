-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 01, 2026 at 03:51 AM
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
-- Database: `minggu7`
--

-- --------------------------------------------------------

--
-- Table structure for table `jurusan`
--

CREATE TABLE `jurusan` (
  `id` int(11) NOT NULL,
  `nama_jurusan` varchar(100) NOT NULL,
  `kode_jurusan` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jurusan`
--

INSERT INTO `jurusan` (`id`, `nama_jurusan`, `kode_jurusan`, `created_at`, `updated_at`) VALUES
(2, 'Rekayasa Perangkat Lunak', 'rpl', '2025-12-21 23:37:20', '2025-12-21 23:37:20'),
(4, 'Teknik Komputer dan Jaringan', 'tkj', '2025-12-28 18:56:42', '2025-12-28 18:56:42');

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id` int(11) NOT NULL,
  `nama_kelas` varchar(50) DEFAULT NULL,
  `jurusan_id` int(11) DEFAULT NULL,
  `tingkat_id` int(11) DEFAULT NULL,
  `wali_kelas_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id`, `nama_kelas`, `jurusan_id`, `tingkat_id`, `wali_kelas_id`, `created_at`, `updated_at`) VALUES
(2, 'TKJ', 4, NULL, NULL, '2025-12-28 18:56:53', '2025-12-28 18:56:53'),
(3, 'XI RPL 3', 2, 1, 2, NULL, NULL),
(4, '11 TKJ 2', 4, 1, 7, NULL, NULL),
(5, '10 RPL 3', 2, 1, 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mapel`
--

CREATE TABLE `mapel` (
  `id` int(11) NOT NULL,
  `nama_mapel` varchar(100) DEFAULT NULL,
  `kode_mapel` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mapel`
--

INSERT INTO `mapel` (`id`, `nama_mapel`, `kode_mapel`, `created_at`, `updated_at`) VALUES
(1, 'Bahasa Indonesia', 'BI', '2025-12-29 08:44:23', '2025-12-29 08:44:23'),
(2, 'Ilmu Pengetahuan Alam', 'IPA', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tingkat`
--

CREATE TABLE `tingkat` (
  `id` int(11) NOT NULL,
  `nama_tingkat` varchar(50) DEFAULT NULL,
  `angka_tingkat` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tingkat`
--

INSERT INTO `tingkat` (`id`, `nama_tingkat`, `angka_tingkat`, `created_at`, `updated_at`) VALUES
(1, 'Sepuluh', 10, '2025-12-29 08:35:27', '2025-12-29 08:35:27'),
(2, 'Sebelas', 11, '2025-12-29 08:35:41', '2025-12-29 08:35:41');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `nis_nip` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','guru','siswa') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `angkatan` varchar(10) DEFAULT NULL,
  `kelas_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `nis_nip`, `email`, `password`, `role`, `created_at`, `updated_at`, `angkatan`, `kelas_id`) VALUES
(1, 'hilmy', NULL, 'admin@gmail.com', '$2b$10$fFO.0eQiAc/VSDCKJvPWIOz3sdADde.p6JHNpA3WPlCNusCcOAJam', 'admin', '2025-12-08 09:01:13', '2025-12-28 18:35:33', NULL, NULL),
(2, 'rachel', NULL, 'rachel@gmail.com', '$2b$10$I/ZK4/1dM1soel6YHaQNNeX6N5aVcPB.eyKUYI7zBe3G.ropvmCRm', 'guru', '2025-12-08 09:02:22', '2025-12-08 09:02:22', NULL, NULL),
(3, 'salwa', '123123', 'salwa@gmail.com', '$2b$10$/0/Jh7i3cBjTp8VcYqLCQOdORPkeeCz2bFQcUrV1AbSjvAvQbqWX2', 'siswa', '2025-12-08 09:02:45', '2025-12-08 09:02:45', '2021', 4),
(7, 'Romi', '12341234', 'romi@gmail.com', '$2b$10$Jil1JPi/9eeigNV8Wk9yV.fQ7TKPAFDGFlANB3dMAmDjCBTrHaGaG', 'guru', NULL, NULL, NULL, NULL),
(8, 'Sindida', '1122', 'sindida@gmail.com', '$2b$10$YPv2aZGJNRG1yJ1kArOjv.UBu9oOFjtihtg3JUEbniDzDyIxikpca', 'siswa', NULL, NULL, '2021', 4),
(11, 'Rachel', '131234', 'rachel2@gmail.com', '$2b$10$P1j24V8nwT3ygTFulxwYEeq23yDONN8zd8Kff47LlByQGBLvjMFqy', 'siswa', NULL, NULL, '2021', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jurusan`
--
ALTER TABLE `jurusan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jurusan_id` (`jurusan_id`),
  ADD KEY `fk_kelas_tingkat` (`tingkat_id`),
  ADD KEY `fk_kelas_wali` (`wali_kelas_id`);

--
-- Indexes for table `mapel`
--
ALTER TABLE `mapel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tingkat`
--
ALTER TABLE `tingkat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `unique_nis_nip` (`nis_nip`),
  ADD KEY `fk_users_kelas` (`kelas_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jurusan`
--
ALTER TABLE `jurusan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mapel`
--
ALTER TABLE `mapel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tingkat`
--
ALTER TABLE `tingkat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kelas`
--
ALTER TABLE `kelas`
  ADD CONSTRAINT `fk_kelas_tingkat` FOREIGN KEY (`tingkat_id`) REFERENCES `tingkat` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kelas_wali` FOREIGN KEY (`wali_kelas_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `kelas_ibfk_1` FOREIGN KEY (`jurusan_id`) REFERENCES `jurusan` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_kelas` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
