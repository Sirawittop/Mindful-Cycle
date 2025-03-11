-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Mar 11, 2025 at 04:13 AM
-- Server version: 8.0.40
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Mindful_Cycle`
--

-- --------------------------------------------------------

--
-- Table structure for table `dass21`
--

CREATE TABLE `dass21` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `period` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `responses` json NOT NULL,
  `stress` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `depression` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `anxiety` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dass21`
--

INSERT INTO `dass21` (`id`, `user_id`, `period`, `responses`, `stress`, `depression`, `anxiety`, `created_at`, `updated_at`) VALUES
(5, 7, 'ช่วงก่อนมีรอบเดือน', '{\"V\": \"1\", \"W\": \"1\", \"X\": \"1\", \"Y\": \"1\", \"Z\": \"1\", \"AA\": \"1\", \"AB\": \"1\", \"AC\": \"1\", \"AD\": \"1\", \"AE\": \"1\", \"AF\": \"1\", \"AG\": \"1\", \"AH\": \"1\", \"AI\": \"1\", \"AJ\": \"1\", \"AK\": \"1\", \"AL\": \"1\", \"AM\": \"1\", \"AN\": \"1\", \"AO\": \"1\", \"AP\": \"1\"}', 'ปกติ', 'ปานกลาง', 'ปานกลาง', '2025-03-08 06:41:03', '2025-03-10 17:45:05'),
(6, 7, 'ช่วงหมดประจำเดือน', '{\"V\": \"2\", \"W\": \"2\", \"X\": \"2\", \"Y\": \"2\", \"Z\": \"3\", \"AA\": \"3\", \"AB\": \"3\", \"AC\": \"2\", \"AD\": \"1\", \"AE\": \"2\", \"AF\": \"1\", \"AG\": \"2\", \"AH\": \"2\", \"AI\": \"3\", \"AJ\": \"2\", \"AK\": \"1\", \"AL\": \"2\", \"AM\": \"2\", \"AN\": \"1\", \"AO\": \"3\", \"AP\": \"2\"}', 'รุนแรง', 'รุนแรงมาก', 'รุนแรงมาก', '2025-03-09 06:51:31', '2025-03-10 17:45:10'),
(7, 2, 'ช่วงมีรอบเดือน', '{\"V\": \"1\", \"W\": \"2\", \"X\": \"1\", \"Y\": \"2\", \"Z\": \"0\", \"AA\": \"0\", \"AB\": \"1\", \"AC\": \"3\", \"AD\": \"1\", \"AE\": \"2\", \"AF\": \"1\", \"AG\": \"1\", \"AH\": \"0\", \"AI\": \"0\", \"AJ\": \"2\", \"AK\": \"1\", \"AL\": \"1\", \"AM\": \"3\", \"AN\": \"2\", \"AO\": \"0\", \"AP\": \"1\"}', 'เล็กน้อย', 'เล็กน้อย', 'รุนแรง', '2025-03-10 07:38:06', '2025-03-10 07:38:06'),
(8, 7, 'ช่วงมีรอบเดือน', '{\"V\": \"0\", \"W\": \"0\", \"X\": \"1\", \"Y\": \"2\", \"Z\": \"2\", \"AA\": \"2\", \"AB\": \"1\", \"AC\": \"3\", \"AD\": \"1\", \"AE\": \"3\", \"AF\": \"2\", \"AG\": \"1\", \"AH\": \"2\", \"AI\": \"1\", \"AJ\": \"1\", \"AK\": \"2\", \"AL\": \"1\", \"AM\": \"2\", \"AN\": \"3\", \"AO\": \"1\", \"AP\": \"2\"}', 'ปานกลาง', 'รุนแรงมาก', 'รุนแรง', '2025-03-10 17:35:57', '2025-03-10 17:35:57'),
(9, 8, 'ช่วงก่อนมีรอบเดือน', '{\"V\": \"1\", \"W\": \"1\", \"X\": \"2\", \"Y\": \"2\", \"Z\": \"1\", \"AA\": \"3\", \"AB\": \"1\", \"AC\": \"0\", \"AD\": \"2\", \"AE\": \"3\", \"AF\": \"1\", \"AG\": \"0\", \"AH\": \"1\", \"AI\": \"2\", \"AJ\": \"1\", \"AK\": \"1\", \"AL\": \"2\", \"AM\": \"1\", \"AN\": \"3\", \"AO\": \"3\", \"AP\": \"3\"}', 'ปกติ', 'รุนแรงมาก', 'รุนแรงมาก', '2025-03-10 17:48:35', '2025-03-10 17:48:35');

-- --------------------------------------------------------

--
-- Table structure for table `date_ranges`
--

CREATE TABLE `date_ranges` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `date_ranges`
--

INSERT INTO `date_ranges` (`id`, `user_id`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
(11, 8, '2025-03-03', '2025-03-07', '2025-03-10 17:47:18', '2025-03-10 17:47:18');

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `note` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id`, `date`, `note`, `created_at`, `updated_at`, `user_id`) VALUES
(8, '2025-03-08', '', '2025-03-09 05:46:17', '2025-03-09 07:15:18', 2),
(9, '2025-03-09', '', '2025-03-09 05:47:25', '2025-03-09 14:19:42', 2),
(15, '2025-03-04', '', '2025-03-09 08:04:46', '2025-03-09 08:04:54', 2),
(20, '2025-02-28', 'test', '2025-03-09 16:57:53', '2025-03-10 18:25:55', 6),
(21, '2025-03-02', 'ประจำเดือนมามาก', '2025-03-09 16:57:57', '2025-03-10 17:47:52', 6),
(22, '2025-03-03', 'aotnehuaoeheu4444', '2025-03-09 16:58:00', '2025-03-09 16:58:00', 6);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_settings`
--

CREATE TABLE `notification_settings` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `beforePeriod` tinyint(1) DEFAULT '0',
  `duringPeriod` tinyint(1) DEFAULT '0',
  `beforeDASS21` tinyint(1) DEFAULT '0',
  `duringDASS21` tinyint(1) DEFAULT '0',
  `afterDASS21` tinyint(1) DEFAULT '0',
  `beforePSST` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_settings`
--

INSERT INTO `notification_settings` (`id`, `user_id`, `beforePeriod`, `duringPeriod`, `beforeDASS21`, `duringDASS21`, `afterDASS21`, `beforePSST`, `created_at`, `updated_at`) VALUES
(11, 2, 0, 0, 0, 0, 0, 0, '2025-03-10 09:52:21', '2025-03-10 10:05:44'),
(12, 2, 0, 0, 0, 0, 0, 0, '2025-03-10 09:52:39', '2025-03-10 10:05:44'),
(13, 7, 0, 0, 0, 0, 0, 0, '2025-03-10 15:04:09', '2025-03-10 15:04:31'),
(14, 8, 1, 1, 0, 1, 0, 1, '2025-03-10 17:49:39', '2025-03-10 17:49:39');

-- --------------------------------------------------------

--
-- Table structure for table `psst`
--

CREATE TABLE `psst` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `responses` json NOT NULL,
  `pms` tinyint(1) NOT NULL,
  `pmdd` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `psst`
--

INSERT INTO `psst` (`id`, `user_id`, `responses`, `pms`, `pmdd`, `created_at`, `updated_at`) VALUES
(6, 2, '{\"0\": \"3\", \"1\": \"3\", \"2\": \"3\", \"3\": \"3\", \"4\": \"3\", \"5\": \"3\", \"6\": \"3\", \"7\": \"3\", \"8\": \"3\", \"9\": \"3\", \"10\": \"3\", \"11\": \"3\", \"12\": \"3\", \"13\": \"3\", \"14\": \"3\", \"15\": \"3\", \"16\": \"3\", \"17\": \"3\", \"18\": \"3\"}', 0, 0, '2025-03-10 07:18:27', '2025-03-10 07:18:27'),
(7, 2, '{\"0\": \"3\", \"1\": \"3\", \"2\": \"3\", \"3\": \"3\", \"4\": \"3\", \"5\": \"3\", \"6\": \"3\", \"7\": \"3\", \"8\": \"3\", \"9\": \"3\", \"10\": \"3\", \"11\": \"3\", \"12\": \"3\", \"13\": \"3\", \"14\": \"3\", \"15\": \"3\", \"16\": \"3\", \"17\": \"3\", \"18\": \"3\"}', 0, 0, '2025-03-10 07:25:50', '2025-03-10 07:25:50'),
(8, 2, '{\"0\": \"0\", \"1\": \"0\", \"2\": \"0\", \"3\": \"0\", \"4\": \"0\", \"5\": \"0\", \"6\": \"0\", \"7\": \"0\", \"8\": \"0\", \"9\": \"0\", \"10\": \"0\", \"11\": \"0\", \"12\": \"0\", \"13\": \"0\", \"14\": \"0\", \"15\": \"0\", \"16\": \"0\", \"17\": \"0\", \"18\": \"0\"}', 0, 0, '2025-03-10 07:27:57', '2025-03-10 07:27:57'),
(9, 2, '{\"0\": \"3\", \"1\": \"3\", \"2\": \"3\", \"3\": \"3\", \"4\": \"3\", \"5\": \"3\", \"6\": \"3\", \"7\": \"3\", \"8\": \"3\", \"9\": \"3\", \"10\": \"3\", \"11\": \"3\", \"12\": \"3\", \"13\": \"3\", \"14\": \"3\", \"15\": \"3\", \"16\": \"3\", \"17\": \"3\", \"18\": \"3\"}', 0, 0, '2025-03-10 07:29:53', '2025-03-10 07:29:53'),
(10, 2, '{\"0\": \"3\", \"1\": \"3\", \"2\": \"3\", \"3\": \"3\", \"4\": \"3\", \"5\": \"3\", \"6\": \"3\", \"7\": \"3\", \"8\": \"3\", \"9\": \"3\", \"10\": \"3\", \"11\": \"3\", \"12\": \"3\", \"13\": \"3\", \"14\": \"3\", \"15\": \"3\", \"16\": \"3\", \"17\": \"3\", \"18\": \"3\"}', 0, 0, '2025-03-10 07:30:40', '2025-03-10 07:30:40'),
(11, 2, '{\"0\": \"3\", \"1\": \"3\", \"2\": \"3\", \"3\": \"3\", \"4\": \"3\", \"5\": \"3\", \"6\": \"3\", \"7\": \"3\", \"8\": \"3\", \"9\": \"3\", \"10\": \"3\", \"11\": \"3\", \"12\": \"3\", \"13\": \"3\", \"14\": \"3\", \"15\": \"3\", \"16\": \"3\", \"17\": \"3\", \"18\": \"3\"}', 0, 0, '2025-03-10 07:31:14', '2025-03-10 07:31:14'),
(12, 2, '{\"0\": \"3\", \"1\": \"3\", \"2\": \"3\", \"3\": \"3\", \"4\": \"3\", \"5\": \"3\", \"6\": \"3\", \"7\": \"3\", \"8\": \"3\", \"9\": \"3\", \"10\": \"3\", \"11\": \"3\", \"12\": \"3\", \"13\": \"3\", \"14\": \"3\", \"15\": \"3\", \"16\": \"3\", \"17\": \"3\", \"18\": \"3\"}', 0, 0, '2025-03-10 07:32:19', '2025-03-10 07:32:19'),
(13, 2, '{\"0\": \"3\", \"1\": \"3\", \"2\": \"3\", \"3\": \"3\", \"4\": \"3\", \"5\": \"3\", \"6\": \"3\", \"7\": \"3\", \"8\": \"3\", \"9\": \"3\", \"10\": \"3\", \"11\": \"3\", \"12\": \"3\", \"13\": \"3\", \"14\": \"3\", \"15\": \"3\", \"16\": \"3\", \"17\": \"3\", \"18\": \"3\"}', 0, 0, '2025-03-10 07:33:06', '2025-03-10 07:33:06'),
(14, 2, '{\"0\": \"3\", \"1\": \"3\", \"2\": \"3\", \"3\": \"3\", \"4\": \"3\", \"5\": \"3\", \"6\": \"3\", \"7\": \"3\", \"8\": \"3\", \"9\": \"3\", \"10\": \"3\", \"11\": \"3\", \"12\": \"3\", \"13\": \"3\", \"14\": \"3\", \"15\": \"3\", \"16\": \"3\", \"17\": \"3\", \"18\": \"3\"}', 0, 0, '2025-03-10 07:33:18', '2025-03-10 07:33:18'),
(15, 2, '{\"0\": \"3\", \"1\": \"3\", \"2\": \"3\", \"3\": \"3\", \"4\": \"3\", \"5\": \"3\", \"6\": \"3\", \"7\": \"3\", \"8\": \"3\", \"9\": \"3\", \"10\": \"3\", \"11\": \"3\", \"12\": \"3\", \"13\": \"3\", \"14\": \"3\", \"15\": \"3\", \"16\": \"3\", \"17\": \"3\", \"18\": \"3\"}', 0, 1, '2025-03-10 07:34:54', '2025-03-10 07:34:54'),
(16, 7, '{\"0\": \"0\", \"1\": \"0\", \"2\": \"1\", \"3\": \"2\", \"4\": \"2\", \"5\": \"3\", \"6\": \"3\", \"7\": \"2\", \"8\": \"2\", \"9\": \"3\", \"10\": \"2\", \"11\": \"1\", \"12\": \"3\", \"13\": \"3\", \"14\": \"1\", \"15\": \"2\", \"16\": \"3\", \"17\": \"3\", \"18\": \"2\"}', 1, 0, '2025-03-10 17:40:19', '2025-03-10 17:40:19'),
(17, 8, '{\"0\": \"0\", \"1\": \"1\", \"2\": \"3\", \"3\": \"2\", \"4\": \"2\", \"5\": \"3\", \"6\": \"1\", \"7\": \"2\", \"8\": \"3\", \"9\": \"2\", \"10\": \"2\", \"11\": \"1\", \"12\": \"2\", \"13\": \"3\", \"14\": \"2\", \"15\": \"3\", \"16\": \"3\", \"17\": \"2\", \"18\": \"3\"}', 0, 1, '2025-03-10 17:48:56', '2025-03-10 17:48:56');

-- --------------------------------------------------------

--
-- Table structure for table `symptom_tracking`
--

CREATE TABLE `symptom_tracking` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `period` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `physicalSymptoms` json DEFAULT NULL,
  `emotionalSymptoms` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `symptom_tracking`
--

INSERT INTO `symptom_tracking` (`id`, `user_id`, `period`, `physicalSymptoms`, `emotionalSymptoms`, `created_at`, `updated_at`) VALUES
(2, 7, 'ช่วงก่อนมีรอบเดือน', '[\"สิว\", \"ปวดศีรษะ\", \"เจ็บเต้านม\"]', '[\"ระเบิดอารมณ์ ทะเลาะวิวาท มีแนวโน้มรุนแรง\", \"อยากอาหารเพิ่มขึ้น\", \"หงุดหงิด\"]', '2025-03-10 16:53:02', '2025-03-10 16:53:02'),
(3, 7, 'ช่วงก่อนมีรอบเดือน', '[\"สิว\", \"เวียนศีรษะ\", \"ใจสั่น\"]', '[\"ซึมเศร้า\", \"อารมณ์แปรปรวน\", \"สับสน สมาธิไม่ดี\"]', '2025-03-10 17:39:41', '2025-03-10 17:39:41'),
(4, 8, 'ช่วงก่อนมีรอบเดือน', '[\"สิว\", \"ท้องอืด\", \"ร้อนวูบวาบ\"]', '[\"สับสน สมาธิไม่ดี\", \"หลงลืม\"]', '2025-03-10 17:48:09', '2025-03-10 17:48:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'testuser', 'test@example.com', '$2b$10$Yb/ibmGiGysA4wdhUmpToexye0V0yZlVVLbnnnh5.tACmGwNWdKPy'),
(2, 'sirawittop', 'sirawit.code+tn23h4@gmail.com', '$2b$10$StjZaR/rlN5Zb3qv43DgZOOB5a2KYLaqZa6HgGrtCH.4XvJLPj0Fe'),
(3, 'sirawittoptest32423', 'sirawit.code+t3h4th@gmail.com', '$2b$10$hNwvlHTiL4rZ/ChqXGA7/edeIzOC2mguQkn.IvsHV2FBRTdH9lBMS'),
(4, 'สิรวิชญ์น้าาา', 'sirawit.code+tb3thhh@gmail.com', '$2b$10$Z8aMW6VjyyL/wVz4gJPEG.PZ7ZtDBTsj7IBlT2DXQjHuiwR7FM7RS'),
(5, 'สวัสดีนี่ท็อปเอง', 'sirawit.code+test1@gmail.com', '$2b$10$gn3ox6N0CH/yIFKsECinJeX89sT2fxz2ZrpzgGGh82oLnot60idFy'),
(6, 'sirawittoptest555', 'sirawit.code+test2@gmail.com', '$2b$10$.EXTAy2jXRuPI0JfZ98D4eA2ptvYytxF2bxYzdB.Hz0WV9Xim.ste'),
(7, 'test', 'satehusntoehu@gmail.com', '$2b$10$RrHweEWNDZQgPDvXb1v3aOivlH3YeLj4AXSsfHIksefb5XKzZwoRm'),
(8, 'jiraporn', 'jiraporn.code@gmail.com', '$2b$10$hPki1/h3lAXH6k0aIlioxuSpPWCRQW3S8kRWSr1atF0sWx8kwaGUi');

-- --------------------------------------------------------

--
-- Table structure for table `user_cycles`
--

CREATE TABLE `user_cycles` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `cycle` int NOT NULL,
  `cycleDays` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_cycles`
--

INSERT INTO `user_cycles` (`id`, `user_id`, `cycle`, `cycleDays`, `created_at`, `updated_at`) VALUES
(1, 2, 10, 5, '2025-03-10 08:15:07', '2025-03-10 08:15:07'),
(2, 2, 20, 4, '2025-03-10 08:55:56', '2025-03-10 08:55:56'),
(3, 2, 10, 5, '2025-03-10 08:57:11', '2025-03-10 08:57:11'),
(4, 2, 28, 7, '2025-03-10 09:10:18', '2025-03-10 09:10:18'),
(5, 2, 10, 5, '2025-03-10 09:11:03', '2025-03-10 09:11:03'),
(6, 8, 20, 5, '2025-03-10 17:49:31', '2025-03-10 17:49:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dass21`
--
ALTER TABLE `dass21`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_period` (`user_id`,`period`);

--
-- Indexes for table `date_ranges`
--
ALTER TABLE `date_ranges`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_date` (`user_id`,`start_date`,`end_date`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `date` (`date`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notification_settings`
--
ALTER TABLE `notification_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `psst`
--
ALTER TABLE `psst`
  ADD PRIMARY KEY (`id`),
  ADD KEY `psst_ibfk_1` (`user_id`);

--
-- Indexes for table `symptom_tracking`
--
ALTER TABLE `symptom_tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_cycles`
--
ALTER TABLE `user_cycles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dass21`
--
ALTER TABLE `dass21`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `date_ranges`
--
ALTER TABLE `date_ranges`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_settings`
--
ALTER TABLE `notification_settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `psst`
--
ALTER TABLE `psst`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `symptom_tracking`
--
ALTER TABLE `symptom_tracking`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user_cycles`
--
ALTER TABLE `user_cycles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dass21`
--
ALTER TABLE `dass21`
  ADD CONSTRAINT `dass21_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `date_ranges`
--
ALTER TABLE `date_ranges`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification_settings`
--
ALTER TABLE `notification_settings`
  ADD CONSTRAINT `notification_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `psst`
--
ALTER TABLE `psst`
  ADD CONSTRAINT `psst_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `symptom_tracking`
--
ALTER TABLE `symptom_tracking`
  ADD CONSTRAINT `symptom_tracking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_cycles`
--
ALTER TABLE `user_cycles`
  ADD CONSTRAINT `user_cycles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
