-- phpMyAdmin SQL Dump
-- version 4.7.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 19, 2017 at 11:15 AM
-- Server version: 5.6.35
-- PHP Version: 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `craft_fantastec`
--

-- --------------------------------------------------------

--
-- Table structure for table `craft_assetfiles`
--

CREATE TABLE `craft_assetfiles` (
  `id` int(11) NOT NULL,
  `sourceId` int(11) DEFAULT NULL,
  `folderId` int(11) NOT NULL,
  `filename` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `kind` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'unknown',
  `width` int(11) UNSIGNED DEFAULT NULL,
  `height` int(11) UNSIGNED DEFAULT NULL,
  `size` bigint(20) UNSIGNED DEFAULT NULL,
  `dateModified` datetime DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_assetfiles`
--

INSERT INTO `craft_assetfiles` (`id`, `sourceId`, `folderId`, `filename`, `kind`, `width`, `height`, `size`, `dateModified`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(19, 2, 10, '3.03.jpg', 'image', 3840, 2160, 561086, '2017-09-13 11:48:49', '2017-11-15 10:53:02', '2017-11-15 14:44:39', 'ea0c953e-a166-4085-9ea7-851e1445a0cd'),
(20, 2, 10, '3.01.jpg', 'image', 3240, 2160, 123117, '2017-09-08 15:58:32', '2017-11-15 11:31:20', '2017-11-15 14:44:38', '98b3818e-887f-4440-970b-63ed53d30cfe'),
(21, 2, 10, '3.02.jpg', 'image', 3840, 2160, 373888, '2017-09-13 11:32:15', '2017-11-15 11:33:01', '2017-11-15 14:44:39', 'c1483df5-4ac7-45e0-b636-63e0a517d00c'),
(23, 2, 10, '3.04.jpg', 'image', 1920, 1440, 820980, '2017-09-08 15:58:32', '2017-11-15 11:35:19', '2017-11-15 14:44:40', '3ff03a56-511e-4bfc-9a7a-94ac4405ad87'),
(27, 2, 10, '3.05.jpg', 'image', 3270, 2180, 315175, '2017-09-08 15:58:32', '2017-11-15 12:54:58', '2017-11-15 14:44:40', '66f58d72-12ad-48b4-8211-1f4f664b45af'),
(28, 2, 10, '3.06.jpg', 'image', 3323, 2160, 468091, '2017-09-08 15:58:32', '2017-11-15 12:55:06', '2017-11-15 14:44:41', '9e1aeb76-9fa3-47db-b743-8e63e01f9b0f'),
(31, 2, 14, '1.01.jpg', 'image', 3880, 2160, 234861, '2017-09-08 15:54:14', '2017-11-15 14:44:30', '2017-11-15 14:44:31', '95e04e60-843d-4239-8bc8-73f0a0951620'),
(32, 2, 14, '1.03.jpg', 'image', 2232, 1365, 279759, '2017-09-08 15:54:14', '2017-11-15 14:44:31', '2017-11-15 14:44:31', '02053a73-8bec-4b23-a16e-167b487b0498'),
(33, 2, 14, '1.02.jpg', 'image', 4178, 2160, 259110, '2017-09-08 15:54:14', '2017-11-15 14:44:31', '2017-11-15 14:44:32', '439b3cb8-12c1-4df3-a34b-c99f3177be41'),
(34, 2, 9, 'android-icon-144x144.png', 'image', 144, 144, 5698, '2017-09-12 10:09:10', '2017-11-15 14:44:32', '2017-11-15 14:44:32', 'd8bd00f4-0229-4b2e-ac1c-ce07255a30c3'),
(35, 2, 9, 'android-icon-192x192.png', 'image', 192, 192, 6048, '2017-09-12 10:09:10', '2017-11-15 14:44:32', '2017-11-15 14:44:32', '1208650f-75b9-4172-836a-1f7fb4ac819d'),
(36, 2, 9, 'android-icon-36x36.png', 'image', 36, 36, 2103, '2017-09-12 10:09:10', '2017-11-15 14:44:32', '2017-11-15 14:44:32', 'a094ae89-a068-4d15-80e9-d4977c7f82c8'),
(37, 2, 9, 'android-icon-48x48.png', 'image', 48, 48, 2048, '2017-09-12 10:09:10', '2017-11-15 14:44:33', '2017-11-15 14:44:33', 'a5b762a9-6417-489b-94ae-cf2efb339aae'),
(38, 2, 9, 'android-icon-72x72.png', 'image', 72, 72, 2836, '2017-09-12 10:09:10', '2017-11-15 14:44:33', '2017-11-15 14:44:33', '9919a789-f160-4120-8d4f-18c438796985'),
(39, 2, 9, 'android-icon-96x96.png', 'image', 96, 96, 3714, '2017-09-12 10:09:10', '2017-11-15 14:44:33', '2017-11-15 14:44:33', 'ca0130bb-4c01-4f2c-80e5-42937a5af5c5'),
(40, 2, 9, 'apple-icon-114x114.png', 'image', 114, 114, 4490, '2017-09-12 10:09:10', '2017-11-15 14:44:33', '2017-11-15 14:44:33', '0a9a4c7c-e776-4c20-b71a-fa3d416345dc'),
(41, 2, 9, 'apple-icon-120x120.png', 'image', 120, 120, 4705, '2017-09-12 10:09:10', '2017-11-15 14:44:33', '2017-11-15 14:44:33', 'bfa83561-371c-43df-ba21-d3e176e01f18'),
(42, 2, 9, 'apple-icon-144x144.png', 'image', 144, 144, 5698, '2017-09-12 10:09:10', '2017-11-15 14:44:34', '2017-11-15 14:44:34', 'a84a53bc-0db2-4052-b504-7a25a37ed4ff'),
(43, 2, 9, 'apple-icon-152x152.png', 'image', 152, 152, 6061, '2017-09-12 10:09:10', '2017-11-15 14:44:34', '2017-11-15 14:44:34', 'aa6da002-d3b1-4efd-b3ac-ef0266bfa978'),
(44, 2, 9, 'apple-icon-180x180.png', 'image', 180, 180, 7450, '2017-09-12 10:09:10', '2017-11-15 14:44:34', '2017-11-15 14:44:34', '25a2f459-37f0-4ce0-9566-066d56840cee'),
(45, 2, 9, 'apple-icon-57x57.png', 'image', 57, 57, 2341, '2017-09-12 10:09:10', '2017-11-15 14:44:34', '2017-11-15 14:44:34', 'a7e58c9e-07f2-4e4a-9b6f-053cb344cc35'),
(46, 2, 9, 'apple-icon-60x60.png', 'image', 60, 60, 2422, '2017-09-12 10:09:10', '2017-11-15 14:44:34', '2017-11-15 14:44:34', 'ded30143-4a05-488d-b16f-7851e823379d'),
(47, 2, 9, 'apple-icon-72x72.png', 'image', 72, 72, 2836, '2017-09-12 10:09:10', '2017-11-15 14:44:34', '2017-11-15 14:44:34', '9885cb57-bcb3-4d59-be6f-b809efe91cea'),
(48, 2, 9, 'apple-icon-76x76.png', 'image', 76, 76, 2964, '2017-09-12 10:09:10', '2017-11-15 14:44:35', '2017-11-15 14:44:35', '5f4553d7-1393-4881-a8ab-f97e238513d2'),
(49, 2, 9, 'apple-icon-precomposed.png', 'image', 192, 192, 6624, '2017-09-12 10:09:10', '2017-11-15 14:44:35', '2017-11-15 14:44:35', '9b320db1-906e-49c2-bf55-0dc00adc3dfc'),
(50, 2, 9, 'apple-icon.png', 'image', 192, 192, 6624, '2017-09-12 10:09:10', '2017-11-15 14:44:35', '2017-11-15 14:44:35', 'bff69a83-9d6f-4dc4-9814-e139952e3195'),
(51, 2, 9, 'downArrow.svg', 'image', 40, 40, 582, '2017-09-15 09:58:24', '2017-11-15 14:44:35', '2017-11-15 14:44:35', '58d3702a-9f69-45ce-b113-efe571908f0c'),
(52, 2, 9, 'email_logo.png', 'image', 301, 71, 3372, '2017-09-15 14:38:00', '2017-11-15 14:44:35', '2017-11-15 14:44:35', 'd1701bbc-e5e3-4fc6-a525-75faf3ab8b21'),
(53, 2, 9, 'email_simon.png', 'image', 301, 43, 3578, '2017-09-15 14:32:20', '2017-11-15 14:44:35', '2017-11-15 14:44:36', 'b2d3c5aa-49e7-40a7-a30e-094c210657ec'),
(54, 2, 9, 'email_steve.png', 'image', 301, 58, 3794, '2017-09-15 14:35:33', '2017-11-15 14:44:36', '2017-11-15 14:44:36', '7ed0689d-2640-4246-9a5d-e3c2e2a96392'),
(55, 2, 9, 'favicon-16x16.png', 'image', 16, 16, 1224, '2017-09-12 10:09:10', '2017-11-15 14:44:36', '2017-11-15 14:44:36', 'c6958711-63d9-43ff-b821-d569df9b21ec'),
(56, 2, 9, 'favicon-32x32.png', 'image', 32, 32, 1880, '2017-09-12 10:09:10', '2017-11-15 14:44:36', '2017-11-15 14:44:36', '96114a40-a65d-40d4-b5eb-255292bf1fa6'),
(57, 2, 9, 'favicon-96x96.png', 'image', 96, 96, 3714, '2017-09-12 10:09:10', '2017-11-15 14:44:36', '2017-11-15 14:44:36', '299694cd-1483-43d2-b5c1-54fd4ce93d42'),
(58, 2, 15, '2.01.jpg', 'image', 3240, 2160, 433568, '2017-09-08 15:57:00', '2017-11-15 14:44:36', '2017-11-15 14:44:37', '19a7f40c-ff11-4bea-a35b-56e855d58da6'),
(59, 2, 15, '2.02.jpg', 'image', 3240, 2160, 318523, '2017-09-08 15:57:00', '2017-11-15 14:44:37', '2017-11-15 14:44:37', '83b7cdfe-81fc-4b27-8427-d7e8475c064f'),
(60, 2, 15, '2.03.jpg', 'image', 1200, 801, 137554, '2017-09-08 15:57:00', '2017-11-15 14:44:38', '2017-11-15 14:44:38', '03e83b26-5618-400c-9915-686638c209b1'),
(61, 2, 9, 'instagram.svg', 'image', 24, 24, 359, '2017-09-06 10:08:16', '2017-11-15 14:44:41', '2017-11-15 14:44:41', '8e768315-0e29-490e-b551-549835abf87f'),
(62, 2, 9, 'linkedIn.svg', 'image', 60, 60, 914, '2017-09-06 09:09:22', '2017-11-15 14:44:41', '2017-11-15 14:44:41', '5ab8f17c-5e84-48b5-8292-5edd6d9df810'),
(63, 2, 9, 'loading.gif', 'image', 300, 300, 120246, '2017-09-08 11:15:46', '2017-11-15 14:44:41', '2017-11-15 14:44:41', '1607d554-9ef0-4699-96fd-021aa8c2e459'),
(64, 2, 9, 'logo.svg', 'image', 1920, 1080, 2377, '2017-09-12 14:26:05', '2017-11-15 14:44:42', '2017-11-15 14:44:42', '91c17368-b36a-43a0-882f-6b335936b500'),
(65, 2, 9, 'ms-icon-144x144.png', 'image', 144, 144, 5698, '2017-09-12 10:09:10', '2017-11-15 14:44:42', '2017-11-15 14:44:42', 'ddfb4726-c03d-45b5-9118-290ce1fad982'),
(66, 2, 9, 'ms-icon-150x150.png', 'image', 150, 150, 6015, '2017-09-12 10:09:10', '2017-11-15 14:44:42', '2017-11-15 14:44:42', '8fbe3f83-bc65-415a-951a-2bacd546603a'),
(67, 2, 9, 'ms-icon-310x310.png', 'image', 310, 310, 16050, '2017-09-12 10:09:10', '2017-11-15 14:44:42', '2017-11-15 14:44:42', 'ad051bee-109b-479f-bf87-a6703b7296f9'),
(68, 2, 9, 'ms-icon-70x70.png', 'image', 70, 70, 2753, '2017-09-12 10:09:10', '2017-11-15 14:44:42', '2017-11-15 14:44:42', '080f16d5-832c-41f7-a233-d0270dedfa58'),
(69, 2, 9, 'social_icons.png', 'image', 302, 60, 3833, '2017-09-15 14:31:20', '2017-11-15 14:44:42', '2017-11-15 14:44:43', 'a901baad-4775-42d3-88f6-bbcc4a277097'),
(70, 2, 9, 'twitter.svg', 'image', 25, 19, 1132, '2017-09-06 09:06:45', '2017-11-15 14:44:43', '2017-11-15 14:44:43', '5b6f3a51-aa90-4f82-b13a-7e1f72d1cffc'),
(71, 2, 16, '4.01.jpg', 'image', 2736, 1558, 161942, '2017-09-08 15:58:32', '2017-11-15 14:44:43', '2017-11-15 14:44:43', 'ac87e228-f92f-4bea-82f0-aadcfdbfa3bb'),
(72, 2, 16, '4.02.jpg', 'image', 1675, 1071, 424835, '2017-09-08 15:58:32', '2017-11-15 14:44:43', '2017-11-15 14:44:43', 'c1bd107d-97d1-4dee-bf03-a5bb28d7e779'),
(73, 2, 16, '4.03.jpg', 'image', 1920, 1280, 215242, '2017-09-08 15:59:32', '2017-11-15 14:44:44', '2017-11-15 14:44:44', '1854a390-6f42-4126-8698-a60916a38557'),
(87, 3, 17, 'landingVideo.mp4', 'video', NULL, NULL, 14187671, '2017-11-17 12:01:53', '2017-11-17 12:01:53', '2017-11-17 12:01:53', '715da8dc-29cf-491b-8f34-9c66be008fec');

-- --------------------------------------------------------

--
-- Table structure for table `craft_assetfolders`
--

CREATE TABLE `craft_assetfolders` (
  `id` int(11) NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  `sourceId` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_assetfolders`
--

INSERT INTO `craft_assetfolders` (`id`, `parentId`, `sourceId`, `name`, `path`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(2, NULL, NULL, 'Temporary source', NULL, '2017-11-14 16:42:04', '2017-11-14 16:42:04', '377f8900-198f-4418-bef7-b765735f1f4c'),
(3, 2, NULL, 'user_1', 'user_1/', '2017-11-14 16:42:04', '2017-11-14 16:42:04', '586d6a92-ee2b-4df9-b018-b82822461c03'),
(4, 3, NULL, 'field_9', 'user_1/field_9/', '2017-11-14 16:42:04', '2017-11-14 16:42:04', '79a34297-1f65-435a-becb-b86b754f982d'),
(9, NULL, 2, 'Images', '', '2017-11-14 17:11:36', '2017-11-14 17:11:36', '94ddbe4c-2913-4090-91b1-3d64d3c9b4e7'),
(10, 9, 2, 'imagineIf', 'imagineIf/', '2017-11-14 17:27:13', '2017-11-14 17:27:13', 'b4974855-7336-4a18-8d65-b944b7070a1c'),
(14, 9, 2, 'aboutUs', 'aboutUs/', '2017-11-15 14:44:30', '2017-11-15 14:44:30', '0c4b0c32-ef67-4590-9990-7dd119f320a8'),
(15, 9, 2, 'howWeInnovate', 'howWeInnovate/', '2017-11-15 14:44:30', '2017-11-15 14:44:30', 'bcf7b969-3589-42c0-b595-97a854b0e070'),
(16, 9, 2, 'workForUs', 'workForUs/', '2017-11-15 14:44:30', '2017-11-15 14:44:30', 'fbf5cd8f-2a2d-4a80-aa84-abeb2304545c'),
(17, NULL, 3, 'Videos', '', '2017-11-17 11:48:17', '2017-11-17 11:48:17', '9ec969ca-6d3a-4118-9182-9be58f893faa');

-- --------------------------------------------------------

--
-- Table structure for table `craft_assetindexdata`
--

CREATE TABLE `craft_assetindexdata` (
  `id` int(11) NOT NULL,
  `sessionId` varchar(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `sourceId` int(10) NOT NULL,
  `offset` int(10) NOT NULL,
  `uri` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `size` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `recordId` int(10) DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_assetindexdata`
--

INSERT INTO `craft_assetindexdata` (`id`, `sessionId`, `sourceId`, `offset`, `uri`, `size`, `recordId`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, '473b7081-f896-4885-8d80-649d594de754', 2, 0, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/aboutUs/1.01.jpg', '234861', 31, '2017-11-15 14:44:30', '2017-11-15 14:44:30', 'c0e76013-e3c4-435a-928b-d3cd6fa26e2b'),
(2, '473b7081-f896-4885-8d80-649d594de754', 2, 1, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/aboutUs/1.02.jpg', '259110', 33, '2017-11-15 14:44:30', '2017-11-15 14:44:31', '5b414271-5273-4bce-a54e-83b9b21d5df3'),
(3, '473b7081-f896-4885-8d80-649d594de754', 2, 2, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/aboutUs/1.03.jpg', '279759', 32, '2017-11-15 14:44:30', '2017-11-15 14:44:31', 'c5dd3b6d-e86d-4c87-9466-8b220e1f43c4'),
(4, '473b7081-f896-4885-8d80-649d594de754', 2, 3, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/android-icon-144x144.png', '5698', 34, '2017-11-15 14:44:30', '2017-11-15 14:44:32', 'da20d544-7c74-4432-806f-5f6f74c165de'),
(5, '473b7081-f896-4885-8d80-649d594de754', 2, 4, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/android-icon-192x192.png', '6048', 35, '2017-11-15 14:44:30', '2017-11-15 14:44:32', '0f92c670-0d6f-4bdf-aa9a-036e97d3a5b6'),
(6, '473b7081-f896-4885-8d80-649d594de754', 2, 5, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/android-icon-36x36.png', '2103', 36, '2017-11-15 14:44:30', '2017-11-15 14:44:32', '8d0a286d-7926-4597-9ff3-9e853e06b3ff'),
(7, '473b7081-f896-4885-8d80-649d594de754', 2, 6, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/android-icon-48x48.png', '2048', 37, '2017-11-15 14:44:30', '2017-11-15 14:44:33', '118f34b0-517f-4cbb-b826-5b56e74a1978'),
(8, '473b7081-f896-4885-8d80-649d594de754', 2, 7, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/android-icon-72x72.png', '2836', 38, '2017-11-15 14:44:30', '2017-11-15 14:44:33', '7e322ee9-b7cc-40a0-9e12-b7ab1a184b36'),
(9, '473b7081-f896-4885-8d80-649d594de754', 2, 8, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/android-icon-96x96.png', '3714', 39, '2017-11-15 14:44:30', '2017-11-15 14:44:33', '8f364bc9-af0c-48e9-9298-cfff3e796b89'),
(10, '473b7081-f896-4885-8d80-649d594de754', 2, 9, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/apple-icon-114x114.png', '4490', 40, '2017-11-15 14:44:30', '2017-11-15 14:44:33', '1d08c12c-30a1-445e-a2a1-50fa2bd1795f'),
(11, '473b7081-f896-4885-8d80-649d594de754', 2, 10, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/apple-icon-120x120.png', '4705', 41, '2017-11-15 14:44:30', '2017-11-15 14:44:33', '0e6b88c0-3d56-40e7-97bc-f34090cfbc7e'),
(12, '473b7081-f896-4885-8d80-649d594de754', 2, 11, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/apple-icon-144x144.png', '5698', 42, '2017-11-15 14:44:30', '2017-11-15 14:44:34', 'd32ebfcd-a626-4b2c-923a-3de7b3e890db'),
(13, '473b7081-f896-4885-8d80-649d594de754', 2, 12, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/apple-icon-152x152.png', '6061', 43, '2017-11-15 14:44:30', '2017-11-15 14:44:34', 'b2c02308-b43b-4a63-a1be-f370b205a324'),
(14, '473b7081-f896-4885-8d80-649d594de754', 2, 13, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/apple-icon-180x180.png', '7450', 44, '2017-11-15 14:44:30', '2017-11-15 14:44:34', 'fcdfc386-880e-4da4-b5e3-68219b8afab5'),
(15, '473b7081-f896-4885-8d80-649d594de754', 2, 14, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/apple-icon-57x57.png', '2341', 45, '2017-11-15 14:44:30', '2017-11-15 14:44:34', '0262cc98-0af3-4ce0-9c74-597b87777c6c'),
(16, '473b7081-f896-4885-8d80-649d594de754', 2, 15, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/apple-icon-60x60.png', '2422', 46, '2017-11-15 14:44:30', '2017-11-15 14:44:34', '6344ef44-3599-4ccb-af73-e072bc13403f'),
(17, '473b7081-f896-4885-8d80-649d594de754', 2, 16, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/apple-icon-72x72.png', '2836', 47, '2017-11-15 14:44:30', '2017-11-15 14:44:34', 'ed098d9f-fbae-4297-b1f4-7602c2b26068'),
(18, '473b7081-f896-4885-8d80-649d594de754', 2, 17, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/apple-icon-76x76.png', '2964', 48, '2017-11-15 14:44:30', '2017-11-15 14:44:35', '6ef39870-429c-4a11-b3bf-3c1f7436a552'),
(19, '473b7081-f896-4885-8d80-649d594de754', 2, 18, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/apple-icon-precomposed.png', '6624', 49, '2017-11-15 14:44:30', '2017-11-15 14:44:35', 'd14e1e1d-a67e-4d5e-a4b5-3738c2a52a8a'),
(20, '473b7081-f896-4885-8d80-649d594de754', 2, 19, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/apple-icon.png', '6624', 50, '2017-11-15 14:44:30', '2017-11-15 14:44:35', 'ae431456-e347-41bb-83ec-700d54153b14'),
(21, '473b7081-f896-4885-8d80-649d594de754', 2, 20, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/browserconfig.xml', '281', NULL, '2017-11-15 14:44:30', '2017-11-15 14:44:30', '0280a284-1b6f-433c-b0b3-df4c1d723a55'),
(22, '473b7081-f896-4885-8d80-649d594de754', 2, 21, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/downArrow.svg', '582', 51, '2017-11-15 14:44:30', '2017-11-15 14:44:35', '4590c015-6da9-408b-9a14-fe8a4e53b153'),
(23, '473b7081-f896-4885-8d80-649d594de754', 2, 22, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/email_logo.png', '3372', 52, '2017-11-15 14:44:30', '2017-11-15 14:44:35', 'c00ae2f0-3a64-474d-95e6-e3a76fa6baaa'),
(24, '473b7081-f896-4885-8d80-649d594de754', 2, 23, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/email_simon.png', '3578', 53, '2017-11-15 14:44:30', '2017-11-15 14:44:35', '3bab4715-cd41-423b-ae4d-80e7a0c67ded'),
(25, '473b7081-f896-4885-8d80-649d594de754', 2, 24, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/email_steve.png', '3794', 54, '2017-11-15 14:44:30', '2017-11-15 14:44:36', '36e6419f-f80f-4831-aadd-56db0d98a812'),
(26, '473b7081-f896-4885-8d80-649d594de754', 2, 25, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/favicon-16x16.png', '1224', 55, '2017-11-15 14:44:30', '2017-11-15 14:44:36', 'dcfcf7d6-8d0b-4fcc-b6ab-8acbb4ef30af'),
(27, '473b7081-f896-4885-8d80-649d594de754', 2, 26, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/favicon-32x32.png', '1880', 56, '2017-11-15 14:44:30', '2017-11-15 14:44:36', '5f59edf1-2562-4724-ba50-e72cb36823ce'),
(28, '473b7081-f896-4885-8d80-649d594de754', 2, 27, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/favicon-96x96.png', '3714', 57, '2017-11-15 14:44:30', '2017-11-15 14:44:36', '31d82496-c3f6-4560-b46f-d976c3723a00'),
(29, '473b7081-f896-4885-8d80-649d594de754', 2, 28, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/favicon.ico', '1150', NULL, '2017-11-15 14:44:30', '2017-11-15 14:44:30', 'ae0169d9-9d03-4b20-a440-db3435b5c1ba'),
(30, '473b7081-f896-4885-8d80-649d594de754', 2, 29, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/howWeInnovate/2.01.jpg', '433568', 58, '2017-11-15 14:44:30', '2017-11-15 14:44:36', '84a5a82d-907f-4141-8645-7afc20f7ab9c'),
(31, '473b7081-f896-4885-8d80-649d594de754', 2, 30, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/howWeInnovate/2.02.jpg', '318523', 59, '2017-11-15 14:44:30', '2017-11-15 14:44:37', '5d6e78b0-d7c9-4f61-bde0-4ba9c01b3005'),
(32, '473b7081-f896-4885-8d80-649d594de754', 2, 31, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/howWeInnovate/2.03.jpg', '137554', 60, '2017-11-15 14:44:30', '2017-11-15 14:44:38', '575e1c5c-66f1-4729-9343-82e3ea9aeaf6'),
(33, '473b7081-f896-4885-8d80-649d594de754', 2, 32, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/imagineIf/3.01.jpg', '123117', 20, '2017-11-15 14:44:30', '2017-11-15 14:44:38', 'e73fef3b-2ec8-41e2-8051-1b447558728e'),
(34, '473b7081-f896-4885-8d80-649d594de754', 2, 33, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/imagineIf/3.02.jpg', '373888', 21, '2017-11-15 14:44:30', '2017-11-15 14:44:38', '3a6c5b49-8323-4246-9f22-9f61410e5e9d'),
(35, '473b7081-f896-4885-8d80-649d594de754', 2, 34, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/imagineIf/3.03.jpg', '561086', 19, '2017-11-15 14:44:30', '2017-11-15 14:44:39', 'bba2c3b3-a6e8-4e46-8d0d-7f102fefabcb'),
(36, '473b7081-f896-4885-8d80-649d594de754', 2, 35, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/imagineIf/3.04.jpg', '820980', 23, '2017-11-15 14:44:30', '2017-11-15 14:44:40', '5e817c9c-e3ff-44ab-9bd0-41ee184b530a'),
(37, '473b7081-f896-4885-8d80-649d594de754', 2, 36, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/imagineIf/3.05.jpg', '315175', 27, '2017-11-15 14:44:30', '2017-11-15 14:44:40', 'ec211aeb-378a-49bb-b803-b9f5ed206759'),
(38, '473b7081-f896-4885-8d80-649d594de754', 2, 37, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/imagineIf/3.06.jpg', '468091', 28, '2017-11-15 14:44:30', '2017-11-15 14:44:40', 'cbca1bff-3e8d-407a-99f5-7166fd6a1a74'),
(39, '473b7081-f896-4885-8d80-649d594de754', 2, 38, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/instagram.svg', '359', 61, '2017-11-15 14:44:30', '2017-11-15 14:44:41', '116bdb3b-2094-4f18-a706-192b0b373f10'),
(40, '473b7081-f896-4885-8d80-649d594de754', 2, 39, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/linkedIn.svg', '914', 62, '2017-11-15 14:44:30', '2017-11-15 14:44:41', 'afa6ee8d-1b17-4044-b25a-4285cf443e41'),
(41, '473b7081-f896-4885-8d80-649d594de754', 2, 40, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/loading.gif', '120246', 63, '2017-11-15 14:44:30', '2017-11-15 14:44:41', 'ef323a72-c924-43d9-a57d-4da6fad0d56d'),
(42, '473b7081-f896-4885-8d80-649d594de754', 2, 41, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/logo.svg', '2377', 64, '2017-11-15 14:44:30', '2017-11-15 14:44:42', '5436e45f-0b5c-482b-b7a2-4e27e87794a2'),
(43, '473b7081-f896-4885-8d80-649d594de754', 2, 42, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/ms-icon-144x144.png', '5698', 65, '2017-11-15 14:44:30', '2017-11-15 14:44:42', 'de144f1e-f1a0-45bc-85ff-375bf55219c3'),
(44, '473b7081-f896-4885-8d80-649d594de754', 2, 43, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/ms-icon-150x150.png', '6015', 66, '2017-11-15 14:44:30', '2017-11-15 14:44:42', '694fa8f4-e46e-4f76-8607-8e4ef60836ab'),
(45, '473b7081-f896-4885-8d80-649d594de754', 2, 44, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/ms-icon-310x310.png', '16050', 67, '2017-11-15 14:44:30', '2017-11-15 14:44:42', 'ef8d01dc-c3d0-4408-b04e-67a8f94e7586'),
(46, '473b7081-f896-4885-8d80-649d594de754', 2, 45, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/ms-icon-70x70.png', '2753', 68, '2017-11-15 14:44:30', '2017-11-15 14:44:42', '8b405b7c-4b3c-4b84-9337-781daa4637a9'),
(47, '473b7081-f896-4885-8d80-649d594de754', 2, 46, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/social_icons.png', '3833', 69, '2017-11-15 14:44:30', '2017-11-15 14:44:42', '2e310a1f-d655-4f44-8c70-8a8c0a28909d'),
(48, '473b7081-f896-4885-8d80-649d594de754', 2, 47, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/twitter.svg', '1132', 70, '2017-11-15 14:44:30', '2017-11-15 14:44:43', '71bdf0e1-e2a0-4926-9d90-8e00d68bdc91'),
(49, '473b7081-f896-4885-8d80-649d594de754', 2, 48, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/workForUs/4.01.jpg', '161942', 71, '2017-11-15 14:44:30', '2017-11-15 14:44:43', 'c4f1b988-f15d-494b-93e9-31a842d168f3'),
(50, '473b7081-f896-4885-8d80-649d594de754', 2, 49, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/workForUs/4.02.jpg', '424835', 72, '2017-11-15 14:44:30', '2017-11-15 14:44:43', '0a297845-1ed2-4ce0-8dbb-a6059184fac3'),
(51, '473b7081-f896-4885-8d80-649d594de754', 2, 50, '/Users/damianwhyte/Documents/Projects/craftFantastec/public_html/assets/images/workForUs/4.03.jpg', '215242', 73, '2017-11-15 14:44:30', '2017-11-15 14:44:44', '16cbec86-8e2e-458c-bc77-8c14db7c3d15');

-- --------------------------------------------------------

--
-- Table structure for table `craft_assetsources`
--

CREATE TABLE `craft_assetsources` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `handle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `settings` text COLLATE utf8_unicode_ci,
  `sortOrder` smallint(6) UNSIGNED DEFAULT NULL,
  `fieldLayoutId` int(10) DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_assetsources`
--

INSERT INTO `craft_assetsources` (`id`, `name`, `handle`, `type`, `settings`, `sortOrder`, `fieldLayoutId`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(2, 'Images', 'images', 'Local', '{\"path\":\"assets\\/images\\/\",\"publicURLs\":\"1\",\"url\":\"http:\\/\\/localhost:8888\\/craftFantastec\\/public_html\\/assets\\/images\\/\"}', 1, 37, '2017-11-14 17:11:36', '2017-11-15 10:13:30', '27c3338d-646f-4b9e-9434-29069a03f2c5'),
(3, 'Videos', 'videos', 'Local', '{\"path\":\"assets\\/videos\\/\",\"publicURLs\":\"1\",\"url\":\"http:\\/\\/localhost:8888\\/craftFantastec\\/public_html\\/assets\\/videos\\/\"}', 2, 60, '2017-11-17 11:48:17', '2017-11-17 11:57:01', '3043967e-c6cc-4cfa-b4c4-8671701334a5');

-- --------------------------------------------------------

--
-- Table structure for table `craft_assettransformindex`
--

CREATE TABLE `craft_assettransformindex` (
  `id` int(11) NOT NULL,
  `fileId` int(11) NOT NULL,
  `filename` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `format` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sourceId` int(11) DEFAULT NULL,
  `fileExists` tinyint(1) DEFAULT NULL,
  `inProgress` tinyint(1) DEFAULT NULL,
  `dateIndexed` datetime DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_assettransforms`
--

CREATE TABLE `craft_assettransforms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `handle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `mode` enum('stretch','fit','crop') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'crop',
  `position` enum('top-left','top-center','top-right','center-left','center-center','center-right','bottom-left','bottom-center','bottom-right') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'center-center',
  `height` int(10) DEFAULT NULL,
  `width` int(10) DEFAULT NULL,
  `format` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `quality` int(10) DEFAULT NULL,
  `dimensionChangeTime` datetime DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_categories`
--

CREATE TABLE `craft_categories` (
  `id` int(11) NOT NULL,
  `groupId` int(11) NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_categorygroups`
--

CREATE TABLE `craft_categorygroups` (
  `id` int(11) NOT NULL,
  `structureId` int(11) NOT NULL,
  `fieldLayoutId` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `handle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `hasUrls` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `template` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_categorygroups_i18n`
--

CREATE TABLE `craft_categorygroups_i18n` (
  `id` int(11) NOT NULL,
  `groupId` int(11) NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `urlFormat` text COLLATE utf8_unicode_ci,
  `nestedUrlFormat` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_content`
--

CREATE TABLE `craft_content` (
  `id` int(11) NOT NULL,
  `elementId` int(11) NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `field_body` text COLLATE utf8_unicode_ci,
  `field_paragraphs` text COLLATE utf8_unicode_ci,
  `field_text` varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
  `field_seo` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_content`
--

INSERT INTO `craft_content` (`id`, `elementId`, `locale`, `title`, `field_body`, `field_paragraphs`, `field_text`, `field_seo`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 1, 'en_gb', NULL, NULL, NULL, NULL, NULL, '2017-11-14 10:47:52', '2017-11-14 10:47:52', '684cf63b-f397-4d5a-a58f-03659fb9e4ac'),
(4, 4, 'en_gb', 'Imagine if...', NULL, NULL, NULL, NULL, '2017-11-14 14:25:13', '2017-11-24 16:40:43', '33dfe083-61c2-4283-997f-d21dffb78045'),
(18, 19, 'en_gb', '3 03', NULL, NULL, NULL, NULL, '2017-11-15 10:53:02', '2017-11-15 14:44:39', 'e87e64cd-e63e-4d8c-98cb-d70bbe04c066'),
(19, 20, 'en_gb', '3 01', NULL, NULL, NULL, NULL, '2017-11-15 11:31:20', '2017-11-15 14:44:38', '2d4369e5-5037-417c-9fc4-3214cb3df8be'),
(20, 21, 'en_gb', '3 02', NULL, NULL, NULL, NULL, '2017-11-15 11:33:01', '2017-11-15 14:44:39', '017e7b6a-07ef-4087-bd71-9c5d858e28fb'),
(22, 23, 'en_gb', '3 04', NULL, NULL, NULL, NULL, '2017-11-15 11:35:19', '2017-11-15 14:44:40', '1b730e2d-22c6-4fb9-9c70-afa46b974f3b'),
(23, 27, 'en_gb', '3 05', NULL, NULL, NULL, NULL, '2017-11-15 12:54:58', '2017-11-15 14:44:40', 'a2590b19-fc45-48b7-946d-7bc259d68bd6'),
(24, 28, 'en_gb', '3 06', NULL, NULL, NULL, NULL, '2017-11-15 12:55:06', '2017-11-15 14:44:41', '96810790-7b32-4080-a9a2-10fe67519ef8'),
(25, 31, 'en_gb', '1 01', NULL, NULL, NULL, NULL, '2017-11-15 14:44:30', '2017-11-15 14:44:31', '33b982e1-be59-4e4b-bdda-12b7ca83de0f'),
(26, 32, 'en_gb', '1 03', NULL, NULL, NULL, NULL, '2017-11-15 14:44:31', '2017-11-15 14:44:31', 'de6dbd84-7093-4661-868d-608ff3cadd78'),
(27, 33, 'en_gb', '1 02', NULL, NULL, NULL, NULL, '2017-11-15 14:44:31', '2017-11-15 14:44:32', '9dcc4017-6a17-4da0-945a-3a72438355d0'),
(28, 34, 'en_gb', 'Android Icon 144X144', NULL, NULL, NULL, NULL, '2017-11-15 14:44:32', '2017-11-15 14:44:32', '565cb8a0-e5b6-440e-9a12-03ad27f8724e'),
(29, 35, 'en_gb', 'Android Icon 192X192', NULL, NULL, NULL, NULL, '2017-11-15 14:44:32', '2017-11-15 14:44:32', 'f79a3797-3dec-4da7-b64c-cb57a9524118'),
(30, 36, 'en_gb', 'Android Icon 36X36', NULL, NULL, NULL, NULL, '2017-11-15 14:44:32', '2017-11-15 14:44:32', '401de419-615e-478e-9e71-2410c9a93a0e'),
(31, 37, 'en_gb', 'Android Icon 48X48', NULL, NULL, NULL, NULL, '2017-11-15 14:44:33', '2017-11-15 14:44:33', 'dedb5e86-406c-4495-81dd-90bdb9b96aa4'),
(32, 38, 'en_gb', 'Android Icon 72X72', NULL, NULL, NULL, NULL, '2017-11-15 14:44:33', '2017-11-15 14:44:33', 'b3c61e06-a5dc-4da3-8415-f138244f44d4'),
(33, 39, 'en_gb', 'Android Icon 96X96', NULL, NULL, NULL, NULL, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '095a95d9-de09-4b6e-b62a-231b2d4d8c9f'),
(34, 40, 'en_gb', 'Apple Icon 114X114', NULL, NULL, NULL, NULL, '2017-11-15 14:44:33', '2017-11-15 14:44:33', 'bd40d197-59be-4d58-8759-e708f6c592a3'),
(35, 41, 'en_gb', 'Apple Icon 120X120', NULL, NULL, NULL, NULL, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '48507840-40e8-4912-bdb1-dd19b53f7524'),
(36, 42, 'en_gb', 'Apple Icon 144X144', NULL, NULL, NULL, NULL, '2017-11-15 14:44:33', '2017-11-15 14:44:34', '04d42629-5ce0-4c9e-8086-1742346a33fb'),
(37, 43, 'en_gb', 'Apple Icon 152X152', NULL, NULL, NULL, NULL, '2017-11-15 14:44:34', '2017-11-15 14:44:34', '626fe8f8-521f-41df-a02c-08713acbbdc0'),
(38, 44, 'en_gb', 'Apple Icon 180X180', NULL, NULL, NULL, NULL, '2017-11-15 14:44:34', '2017-11-15 14:44:34', '4d0f74f1-5fd5-4362-ad9e-90265bfa535d'),
(39, 45, 'en_gb', 'Apple Icon 57X57', NULL, NULL, NULL, NULL, '2017-11-15 14:44:34', '2017-11-15 14:44:34', 'c3bb44ec-9e02-4d7e-a3f6-a6080adffd08'),
(40, 46, 'en_gb', 'Apple Icon 60X60', NULL, NULL, NULL, NULL, '2017-11-15 14:44:34', '2017-11-15 14:44:34', '66ca3a96-f61a-45bf-85ae-9d4b285ffcd3'),
(41, 47, 'en_gb', 'Apple Icon 72X72', NULL, NULL, NULL, NULL, '2017-11-15 14:44:34', '2017-11-15 14:44:34', '05d8775f-548e-4614-b078-c6eea5a31407'),
(42, 48, 'en_gb', 'Apple Icon 76X76', NULL, NULL, NULL, NULL, '2017-11-15 14:44:35', '2017-11-15 14:44:35', 'fa778e45-ba75-4904-a1e4-e4b26e72c90a'),
(43, 49, 'en_gb', 'Apple Icon Precomposed', NULL, NULL, NULL, NULL, '2017-11-15 14:44:35', '2017-11-15 14:44:35', '596d1cae-dcea-48f1-b674-3f4af03127b3'),
(44, 50, 'en_gb', 'Apple Icon', NULL, NULL, NULL, NULL, '2017-11-15 14:44:35', '2017-11-15 14:44:35', '1142528b-28dd-4766-9a57-45ccd2c15dea'),
(45, 51, 'en_gb', 'Down Arrow', NULL, NULL, NULL, NULL, '2017-11-15 14:44:35', '2017-11-15 14:44:35', 'b48a7505-6002-4148-8617-df4a062be385'),
(46, 52, 'en_gb', 'Email Logo', NULL, NULL, NULL, NULL, '2017-11-15 14:44:35', '2017-11-15 14:44:35', '2e8c2dcb-4c00-423f-9f40-cfdbd75973b2'),
(47, 53, 'en_gb', 'Email Simon', NULL, NULL, NULL, NULL, '2017-11-15 14:44:35', '2017-11-15 14:44:35', '7b6a681b-8fc7-4efd-a939-174f08984f78'),
(48, 54, 'en_gb', 'Email Steve', NULL, NULL, NULL, NULL, '2017-11-15 14:44:36', '2017-11-15 14:44:36', '46fc2f06-1765-428c-a990-fa06eb4b6c86'),
(49, 55, 'en_gb', 'Favicon 16X16', NULL, NULL, NULL, NULL, '2017-11-15 14:44:36', '2017-11-15 14:44:36', '107ed880-3543-4ff8-99ff-3294db90d9da'),
(50, 56, 'en_gb', 'Favicon 32X32', NULL, NULL, NULL, NULL, '2017-11-15 14:44:36', '2017-11-15 14:44:36', '6e56c947-9fdd-452c-973c-4d47f4fdf873'),
(51, 57, 'en_gb', 'Favicon 96X96', NULL, NULL, NULL, NULL, '2017-11-15 14:44:36', '2017-11-15 14:44:36', '4e082b09-9817-445a-8306-4bc73e1080fd'),
(52, 58, 'en_gb', '2 01', NULL, NULL, NULL, NULL, '2017-11-15 14:44:36', '2017-11-15 14:44:37', 'ca450dcc-020a-4109-9245-d987237ae36f'),
(53, 59, 'en_gb', '2 02', NULL, NULL, NULL, NULL, '2017-11-15 14:44:37', '2017-11-15 14:44:37', '2c1a1154-5380-4681-820e-dc7d16d8cbff'),
(54, 60, 'en_gb', '2 03', NULL, NULL, NULL, NULL, '2017-11-15 14:44:38', '2017-11-15 14:44:38', 'db6d0dd7-0a76-48e2-aa08-7a043ca38567'),
(55, 61, 'en_gb', 'Instagram', NULL, NULL, NULL, NULL, '2017-11-15 14:44:41', '2017-11-15 14:44:41', '23d68a7d-1701-47d4-9caf-e47fe140acd6'),
(56, 62, 'en_gb', 'Linked In', NULL, NULL, NULL, NULL, '2017-11-15 14:44:41', '2017-11-15 14:44:41', '83c41103-46d0-4d60-a00f-ca3a9ea6aa40'),
(57, 63, 'en_gb', 'Loading', NULL, NULL, NULL, NULL, '2017-11-15 14:44:41', '2017-11-15 14:44:41', '82a908fc-f888-4aa1-bdfc-8fd95f5ed624'),
(58, 64, 'en_gb', 'Logo', NULL, NULL, NULL, NULL, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '70c7a195-d6d0-4e86-88c3-6addb908e295'),
(59, 65, 'en_gb', 'Ms Icon 144X144', NULL, NULL, NULL, NULL, '2017-11-15 14:44:42', '2017-11-15 14:44:42', 'ab36a120-ee28-4c30-92ca-2ee822774c14'),
(60, 66, 'en_gb', 'Ms Icon 150X150', NULL, NULL, NULL, NULL, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '24efda52-87e0-4339-b402-1ee6a17c0085'),
(61, 67, 'en_gb', 'Ms Icon 310X310', NULL, NULL, NULL, NULL, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '994e35df-cfb7-4341-89c9-eb599ba69426'),
(62, 68, 'en_gb', 'Ms Icon 70X70', NULL, NULL, NULL, NULL, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '45d21f48-ec23-4f42-99fd-572e65398fd9'),
(63, 69, 'en_gb', 'Social Icons', NULL, NULL, NULL, NULL, '2017-11-15 14:44:42', '2017-11-15 14:44:43', 'c96216dc-a81c-4a1a-9168-75aff8a265a5'),
(64, 70, 'en_gb', 'Twitter', NULL, NULL, NULL, NULL, '2017-11-15 14:44:43', '2017-11-15 14:44:43', 'cb86effa-f493-432f-9841-1c4d1fcdfa40'),
(65, 71, 'en_gb', '4 01', NULL, NULL, NULL, NULL, '2017-11-15 14:44:43', '2017-11-15 14:44:43', '41111eb4-cce9-4478-b583-946faf160729'),
(66, 72, 'en_gb', '4 02', NULL, NULL, NULL, NULL, '2017-11-15 14:44:43', '2017-11-15 14:44:43', '1eec8b54-d39d-4ca1-9976-00d9038ba84c'),
(67, 73, 'en_gb', '4 03', NULL, NULL, NULL, NULL, '2017-11-15 14:44:44', '2017-11-15 14:44:44', 'e479db7f-0fd5-4e20-9218-837489ec013b'),
(68, 74, 'en_gb', 'How we Innovate', NULL, NULL, NULL, NULL, '2017-11-15 15:38:01', '2017-11-15 17:04:12', '4e2e54bf-8834-4a1d-91a1-ada67a5d1077'),
(69, 80, 'en_gb', 'Work with us', NULL, NULL, NULL, NULL, '2017-11-15 17:07:16', '2017-11-23 12:28:40', '5137a253-87a6-40c6-a0b5-505a1be2352f'),
(70, 84, 'en_gb', 'About Us', NULL, '<p>Professional sport now enjoys a truly global following. Through technology our Fantastec goal is to enable ever richer more rewarding fan experiences.</p>\n<p>Only 0.5% of the annual English Premier League audience experience a match from a stadium seat. Yet billions of fans around the world follow the action, the characters and the stories.<br /></p>\n<p>Through emerging technologies like virtual &amp; augmented reality, wearable tech, A.I and the Blockchain, Fantastec is developing products, platforms and experiences so globally distanced fans can connect and engage more deeply with the sport they love.<br /></p>', NULL, NULL, '2017-11-16 11:07:37', '2017-11-23 12:33:34', 'e9cfcb7a-f511-4887-a013-a6a36738cd41'),
(73, 87, 'en_gb', 'Landing Video', NULL, NULL, NULL, NULL, '2017-11-17 12:01:53', '2017-11-17 12:01:53', '1692c043-57c2-4fd8-a919-1d04f6494ca1'),
(74, 88, 'en_gb', 'Home', NULL, NULL, NULL, '{\"id\":null,\"enabled\":1,\"archived\":0,\"locale\":\"en_gb\",\"localeEnabled\":1,\"slug\":null,\"uri\":null,\"dateCreated\":null,\"dateUpdated\":null,\"root\":null,\"lft\":null,\"rgt\":null,\"level\":null,\"searchScore\":null,\"elementId\":0,\"metaType\":\"template\",\"metaPath\":\"\",\"seoMainEntityCategory\":\"CreativeWork\",\"seoMainEntityOfPage\":\"WebPage\",\"seoTitle\":\"Home\",\"seoDescription\":\"\",\"seoKeywords\":\"\",\"seoImageTransform\":\"\",\"seoFacebookImageTransform\":\"\",\"seoTwitterImageTransform\":\"\",\"twitterCardType\":\"\",\"openGraphType\":\"\",\"robots\":\"\",\"seoImageId\":\"\",\"seoTwitterImageId\":\"\",\"seoFacebookImageId\":\"\",\"canonicalUrlOverride\":\"\",\"seoTitleUnparsed\":\"Home\",\"seoDescriptionUnparsed\":\"\",\"seoKeywordsUnparsed\":\"\",\"seoTitleSource\":\"field\",\"seoTitleSourceField\":\"title\",\"seoDescriptionSource\":\"custom\",\"seoDescriptionSourceField\":\"title\",\"seoKeywordsSource\":\"custom\",\"seoKeywordsSourceField\":\"title\",\"seoImageIdSource\":\"custom\",\"seoImageIdSourceField\":\"videos\",\"seoTwitterImageIdSource\":\"custom\",\"seoTwitterImageIdSourceField\":\"videos\",\"seoFacebookImageIdSource\":\"custom\",\"seoFacebookImageIdSourceField\":\"videos\",\"seoCommerceVariants\":null,\"__model__\":\"Craft\\\\Seomatic_MetaFieldModel\"}', '2017-11-17 12:37:57', '2017-11-20 12:03:28', '7c9957a7-971b-41cb-a3c6-7b45fb3eff72'),
(75, 89, 'en_gb', 'Contact Us', NULL, NULL, NULL, NULL, '2017-11-17 14:03:16', '2017-11-23 12:39:53', '9effb329-88c9-4c89-aad3-fad608f62f3b');

-- --------------------------------------------------------

--
-- Table structure for table `craft_cpnav_layouts`
--

CREATE TABLE `craft_cpnav_layouts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `isDefault` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `permissions` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_cpnav_layouts`
--

INSERT INTO `craft_cpnav_layouts` (`id`, `name`, `isDefault`, `permissions`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 'Default', 1, NULL, '2017-11-20 17:21:52', '2017-11-20 17:21:52', 'a225795a-974c-48e8-b339-9485776a63a5');

-- --------------------------------------------------------

--
-- Table structure for table `craft_cpnav_navs`
--

CREATE TABLE `craft_cpnav_navs` (
  `id` int(11) NOT NULL,
  `layoutId` int(11) DEFAULT NULL,
  `handle` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `prevLabel` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `currLabel` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `enabled` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `order` int(10) DEFAULT '0',
  `prevUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `icon` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `customIcon` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `manualNav` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `newWindow` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_cpnav_navs`
--

INSERT INTO `craft_cpnav_navs` (`id`, `layoutId`, `handle`, `prevLabel`, `currLabel`, `enabled`, `order`, `prevUrl`, `url`, `icon`, `customIcon`, `manualNav`, `newWindow`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 1, 'dashboard', 'Dashboard', 'Dashboard', 0, 0, 'dashboard', 'dashboard', 'gauge', NULL, 0, 0, '2017-11-20 17:21:52', '2017-11-20 17:28:16', '5ff202ec-60c1-4125-9509-db3106a512e5'),
(2, 1, 'entries', 'Entries', 'Entries', 1, 1, 'entries', 'entries', 'section', NULL, 0, 0, '2017-11-20 17:21:52', '2017-11-20 17:21:52', 'dff39ef0-d845-4c0b-a4a2-1ae2bc06a4c1'),
(3, 1, 'assets', 'Assets', 'Assets', 1, 2, 'assets', 'assets', 'assets', NULL, 0, 0, '2017-11-20 17:21:52', '2017-11-20 17:23:59', '08b3b288-57d0-47a6-b21a-30a4325cc0dd'),
(4, 1, 'oauth', 'OAuth', 'OAuth', 0, 3, 'oauth', 'oauth', 'iconSvg-oauth', NULL, 0, 0, '2017-11-20 17:21:52', '2017-11-20 17:25:49', '8dd8b96d-2f5f-41cb-a789-ea87b19820fd'),
(5, 1, 'seomatic', 'SEOmatic', 'SEOmatic', 1, 4, 'seomatic', 'seomatic', 'iconSvg-seomatic', NULL, 0, 0, '2017-11-20 17:21:52', '2017-11-20 17:26:05', '62e9f66c-d8e8-415c-b69a-192927267693'),
(6, 1, 'settings', 'Settings', 'Settings', 1, 5, 'settings', 'settings', 'settings', NULL, 0, 0, '2017-11-20 17:21:52', '2017-11-20 17:21:52', 'cf9a6d13-ec77-4166-bb95-542d162f2e5d');

-- --------------------------------------------------------

--
-- Table structure for table `craft_deprecationerrors`
--

CREATE TABLE `craft_deprecationerrors` (
  `id` int(11) NOT NULL,
  `key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fingerprint` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `lastOccurrence` datetime NOT NULL,
  `file` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `line` smallint(6) UNSIGNED NOT NULL,
  `class` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `method` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `template` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `templateLine` smallint(6) UNSIGNED DEFAULT NULL,
  `message` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `traces` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_elementindexsettings`
--

CREATE TABLE `craft_elementindexsettings` (
  `id` int(11) NOT NULL,
  `type` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `settings` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_elementindexsettings`
--

INSERT INTO `craft_elementindexsettings` (`id`, `type`, `settings`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 'Asset', '{\"sources\":{\"folder:1\":{\"tableAttributes\":{\"1\":\"filename\",\"2\":\"size\",\"3\":\"dateModified\",\"4\":\"imageSize\"}}}}', '2017-11-14 16:51:08', '2017-11-14 16:51:08', '465e4ad3-fc88-43f9-8a81-0832aff83d3a');

-- --------------------------------------------------------

--
-- Table structure for table `craft_elements`
--

CREATE TABLE `craft_elements` (
  `id` int(11) NOT NULL,
  `type` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `enabled` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `archived` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_elements`
--

INSERT INTO `craft_elements` (`id`, `type`, `enabled`, `archived`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 'User', 1, 0, '2017-11-14 10:47:52', '2017-11-14 10:47:52', '44382433-e633-4867-81a0-3620aecc9bf9'),
(4, 'Entry', 1, 0, '2017-11-14 14:25:13', '2017-11-24 16:40:43', 'fc085f6a-2b41-4fc2-9d37-9f47221efade'),
(6, 'MatrixBlock', 1, 0, '2017-11-14 15:36:44', '2017-11-24 16:40:43', '8effbd72-ed4e-4523-8584-bf8dad26aaad'),
(19, 'Asset', 1, 0, '2017-11-15 10:53:02', '2017-11-15 14:44:39', '3a36c76e-100f-4e34-8c62-aa9bb9ee5477'),
(20, 'Asset', 1, 0, '2017-11-15 11:31:20', '2017-11-15 14:44:38', 'a27b9bfc-4818-4960-8916-8d2220a53ebc'),
(21, 'Asset', 1, 0, '2017-11-15 11:33:01', '2017-11-15 14:44:39', '9290ca77-e95f-4ef6-86c5-a7b347d5b695'),
(23, 'Asset', 1, 0, '2017-11-15 11:35:19', '2017-11-15 14:44:40', 'aa2742e1-26a6-4513-b69b-3e9cda97b9b3'),
(24, 'MatrixBlock', 1, 0, '2017-11-15 11:35:24', '2017-11-24 16:40:43', '75e184ca-d2fe-46b4-8af3-b1e51f1a2535'),
(25, 'MatrixBlock', 1, 0, '2017-11-15 11:35:24', '2017-11-24 16:40:43', 'e9459545-f1ea-4b65-aa1e-8de38fc0d927'),
(26, 'MatrixBlock', 1, 0, '2017-11-15 11:35:24', '2017-11-24 16:40:43', '6be5c768-5af6-4ca1-9a6e-2d4ee2847998'),
(27, 'Asset', 1, 0, '2017-11-15 12:54:58', '2017-11-15 14:44:40', '06500659-73cb-4fb7-8598-983949efaa2b'),
(28, 'Asset', 1, 0, '2017-11-15 12:55:06', '2017-11-15 14:44:41', '6a11fdeb-8472-4d4f-a4d7-f0c6658952ca'),
(29, 'MatrixBlock', 1, 0, '2017-11-15 12:55:19', '2017-11-24 16:40:43', '58289c5f-ad7f-408b-b538-947d1c2e7a2c'),
(30, 'MatrixBlock', 1, 0, '2017-11-15 12:55:19', '2017-11-24 16:40:43', '0ba09b1f-a06a-4eda-b0f5-da4b13db5582'),
(31, 'Asset', 1, 0, '2017-11-15 14:44:30', '2017-11-15 14:44:31', '400d92f5-daca-4a3f-8397-91373587e3af'),
(32, 'Asset', 1, 0, '2017-11-15 14:44:31', '2017-11-15 14:44:31', '4ad3a954-f846-4a95-8280-f5e7ed46c4a6'),
(33, 'Asset', 1, 0, '2017-11-15 14:44:31', '2017-11-15 14:44:32', '8913f3f9-244c-412d-a80f-80eacae99c43'),
(34, 'Asset', 1, 0, '2017-11-15 14:44:32', '2017-11-15 14:44:32', '196d630a-199e-4e5c-9c46-afebc1e64503'),
(35, 'Asset', 1, 0, '2017-11-15 14:44:32', '2017-11-15 14:44:32', '7997ad8f-8298-4dc7-ba6e-2febfad7fa6d'),
(36, 'Asset', 1, 0, '2017-11-15 14:44:32', '2017-11-15 14:44:32', '6ca57a36-5f72-4cb7-9595-47569f9a1117'),
(37, 'Asset', 1, 0, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '26bd362d-933b-4c0a-a01f-843452373534'),
(38, 'Asset', 1, 0, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '8b916f14-1a8e-4477-a229-24e254a91237'),
(39, 'Asset', 1, 0, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '1dcd7a97-5bfc-4906-93f2-51a9a58b1f38'),
(40, 'Asset', 1, 0, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '6303e970-8a23-461f-9c99-03ca93d8250d'),
(41, 'Asset', 1, 0, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '68b55199-d095-423b-8289-61b7509b6d22'),
(42, 'Asset', 1, 0, '2017-11-15 14:44:33', '2017-11-15 14:44:34', '4b2f30df-5119-42b4-ad1d-2ca9a23a789a'),
(43, 'Asset', 1, 0, '2017-11-15 14:44:34', '2017-11-15 14:44:34', 'a3ee0055-6186-463b-85d9-5d876398db19'),
(44, 'Asset', 1, 0, '2017-11-15 14:44:34', '2017-11-15 14:44:34', 'ed1c3c2c-f6b0-4af4-bf8c-86a90b02a782'),
(45, 'Asset', 1, 0, '2017-11-15 14:44:34', '2017-11-15 14:44:34', 'bdb76b46-535b-4b9e-8fea-80f92451e15f'),
(46, 'Asset', 1, 0, '2017-11-15 14:44:34', '2017-11-15 14:44:34', '47963e59-6f64-4465-a666-c8e33003eb22'),
(47, 'Asset', 1, 0, '2017-11-15 14:44:34', '2017-11-15 14:44:34', 'cdb5eade-a76c-454b-91c9-405f0e3a1423'),
(48, 'Asset', 1, 0, '2017-11-15 14:44:35', '2017-11-15 14:44:35', '0885b844-f75d-4f94-af01-2e8ce6c12e2d'),
(49, 'Asset', 1, 0, '2017-11-15 14:44:35', '2017-11-15 14:44:35', '103e0c6f-da7a-4e8e-a621-4ded88ae525c'),
(50, 'Asset', 1, 0, '2017-11-15 14:44:35', '2017-11-15 14:44:35', 'cc8ae5cb-bb7e-4d4d-b99e-c7f95add713a'),
(51, 'Asset', 1, 0, '2017-11-15 14:44:35', '2017-11-15 14:44:35', 'c38c63dd-f786-46aa-a944-96295b0bd8ac'),
(52, 'Asset', 1, 0, '2017-11-15 14:44:35', '2017-11-15 14:44:35', 'fa1eba54-207c-4951-86e1-8ce0a5d6fe3e'),
(53, 'Asset', 1, 0, '2017-11-15 14:44:35', '2017-11-15 14:44:35', 'e7609e92-b60c-483b-9830-5d7bb81dae0b'),
(54, 'Asset', 1, 0, '2017-11-15 14:44:36', '2017-11-15 14:44:36', 'fbc1d26f-25f0-40c8-b5c3-82e66d75d87f'),
(55, 'Asset', 1, 0, '2017-11-15 14:44:36', '2017-11-15 14:44:36', '775f6eee-0dc9-4a66-99b1-26dd2cced6ec'),
(56, 'Asset', 1, 0, '2017-11-15 14:44:36', '2017-11-15 14:44:36', '4672ba37-5d6c-4630-a02e-5b5e0443c6ad'),
(57, 'Asset', 1, 0, '2017-11-15 14:44:36', '2017-11-15 14:44:36', 'f1873c51-28b1-45a0-b85d-99659196bfc8'),
(58, 'Asset', 1, 0, '2017-11-15 14:44:36', '2017-11-15 14:44:37', '5d75c19a-c5be-40f7-9031-86951b079792'),
(59, 'Asset', 1, 0, '2017-11-15 14:44:37', '2017-11-15 14:44:37', '80a2f824-5ebb-47c4-80fa-9b56df2aecab'),
(60, 'Asset', 1, 0, '2017-11-15 14:44:38', '2017-11-15 14:44:38', '597a416f-6742-46db-9e06-a84b210a69df'),
(61, 'Asset', 1, 0, '2017-11-15 14:44:41', '2017-11-15 14:44:41', 'd522317d-b315-4c16-94a6-150b65ad11a3'),
(62, 'Asset', 1, 0, '2017-11-15 14:44:41', '2017-11-15 14:44:41', '7b59f15c-f6a2-4306-9b9a-5b74f0c81b2f'),
(63, 'Asset', 1, 0, '2017-11-15 14:44:41', '2017-11-15 14:44:41', '7874b93d-3268-4146-9662-c6f133ef9217'),
(64, 'Asset', 1, 0, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '839e5b05-56ab-413b-a1eb-49007c0e3ad2'),
(65, 'Asset', 1, 0, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '2ada7fda-7a10-4dcc-8820-fa815b7a372d'),
(66, 'Asset', 1, 0, '2017-11-15 14:44:42', '2017-11-15 14:44:42', 'dae57d89-56f6-4a1a-b52c-80e4bfb5a67b'),
(67, 'Asset', 1, 0, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '22ccf8cc-a360-4b66-bbf1-2ed0723e2dee'),
(68, 'Asset', 1, 0, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '9dd3b353-45db-467f-ad62-eddf7a43bdd7'),
(69, 'Asset', 1, 0, '2017-11-15 14:44:42', '2017-11-15 14:44:43', '1ad6cb9c-774a-4595-bebe-6dcfdddcdb18'),
(70, 'Asset', 1, 0, '2017-11-15 14:44:43', '2017-11-15 14:44:43', '9c5c4014-b797-473e-9394-0044ad74b7d6'),
(71, 'Asset', 1, 0, '2017-11-15 14:44:43', '2017-11-15 14:44:43', 'c44142a4-7b2a-4357-afa1-45ab9fed2156'),
(72, 'Asset', 1, 0, '2017-11-15 14:44:43', '2017-11-15 14:44:43', '80372954-87a7-4c77-8764-616329115a76'),
(73, 'Asset', 1, 0, '2017-11-15 14:44:44', '2017-11-15 14:44:44', '6d5c528c-801c-4dbd-9eb8-e3cc63d902da'),
(74, 'Entry', 1, 0, '2017-11-15 15:38:01', '2017-11-15 17:04:12', 'a91e8bc9-ea24-496e-9afd-855fba068779'),
(75, 'MatrixBlock', 1, 0, '2017-11-15 15:38:01', '2017-11-15 15:45:57', '7304c340-6e41-4933-91cf-0cee4f25741c'),
(78, 'MatrixBlock', 1, 0, '2017-11-15 15:45:57', '2017-11-15 15:45:57', 'ade6060e-9b96-436a-acf0-f32c5c69e53b'),
(79, 'MatrixBlock', 1, 0, '2017-11-15 15:45:57', '2017-11-15 15:45:57', 'c788a497-82ca-4da5-b306-6a18e60caeda'),
(80, 'Entry', 1, 0, '2017-11-15 17:07:16', '2017-11-23 12:28:40', 'de8cbdc3-ce33-4ae8-a5a6-d8309bcdbfc2'),
(81, 'MatrixBlock', 1, 0, '2017-11-15 17:14:34', '2017-11-23 12:28:40', 'b81c2f3e-048b-47b0-94b3-a4248da50ab4'),
(82, 'MatrixBlock', 1, 0, '2017-11-15 17:14:34', '2017-11-23 12:28:40', '7ae2560d-eeb0-45c9-8310-d71c21ac8818'),
(83, 'MatrixBlock', 1, 0, '2017-11-15 17:14:34', '2017-11-23 12:28:40', 'de7738f3-fd20-466f-ba3c-af716ff80e5d'),
(84, 'Entry', 1, 0, '2017-11-16 11:07:37', '2017-11-23 12:33:34', 'dd008529-a257-4180-8e6a-d0955eda5608'),
(87, 'Asset', 1, 0, '2017-11-17 12:01:53', '2017-11-17 12:01:53', '1de98cbf-c5b5-409a-9dda-8b9c82f5a102'),
(88, 'Entry', 1, 0, '2017-11-17 12:37:57', '2017-11-20 12:03:28', '779b9bd7-46af-4d95-b176-bf7d12cb7e15'),
(89, 'Entry', 1, 0, '2017-11-17 14:03:16', '2017-11-23 12:39:53', '03948489-9c5b-47c1-8dfe-b01af64e873c'),
(90, 'MatrixBlock', 1, 0, '2017-11-17 14:38:14', '2017-11-23 12:39:53', 'c6c4a5d7-0f68-4669-8a7b-911226d15d03');

-- --------------------------------------------------------

--
-- Table structure for table `craft_elements_i18n`
--

CREATE TABLE `craft_elements_i18n` (
  `id` int(11) NOT NULL,
  `elementId` int(11) NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `uri` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `enabled` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_elements_i18n`
--

INSERT INTO `craft_elements_i18n` (`id`, `elementId`, `locale`, `slug`, `uri`, `enabled`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 1, 'en_gb', '', NULL, 1, '2017-11-14 10:47:52', '2017-11-14 10:47:52', 'a66d2c4c-daf5-410c-95a0-35ddc0a191dd'),
(4, 4, 'en_gb', 'imagine-if', 'imagine-if/imagine-if', 1, '2017-11-14 14:25:13', '2017-11-24 16:40:43', '996d0e75-efe0-4794-a23b-fe81ed5d5073'),
(6, 6, 'en_gb', '', NULL, 1, '2017-11-14 15:36:44', '2017-11-24 16:40:43', 'e6a9f85b-2fea-48c2-9532-c38035b1a7d0'),
(19, 19, 'en_gb', '3-03', NULL, 1, '2017-11-15 10:53:02', '2017-11-15 14:44:39', '8e8ab840-bb21-4390-b18a-f2bf211f6c9c'),
(20, 20, 'en_gb', '3-01', NULL, 1, '2017-11-15 11:31:20', '2017-11-15 14:44:38', '94fe3032-2d57-4739-8acc-6e5eea2e9981'),
(21, 21, 'en_gb', '3-02', NULL, 1, '2017-11-15 11:33:01', '2017-11-15 14:44:39', '98a5cdfe-a903-4a06-a5ca-8f6dfcd6d9cf'),
(23, 23, 'en_gb', '3-04', NULL, 1, '2017-11-15 11:35:19', '2017-11-15 14:44:40', '89723d7e-152f-474b-919a-ec9465e8b7f5'),
(24, 24, 'en_gb', '', NULL, 1, '2017-11-15 11:35:24', '2017-11-24 16:40:43', 'd7b6f736-4b42-42b5-a4dd-8698b688083d'),
(25, 25, 'en_gb', '', NULL, 1, '2017-11-15 11:35:24', '2017-11-24 16:40:43', 'e3d67bee-289e-43ce-98e4-7e47617e926e'),
(26, 26, 'en_gb', '', NULL, 1, '2017-11-15 11:35:24', '2017-11-24 16:40:43', '9e5f1d8a-1f53-48d8-86db-84cf47c99133'),
(27, 27, 'en_gb', '3-05', NULL, 1, '2017-11-15 12:54:58', '2017-11-15 14:44:40', '0541dda9-7c38-4505-b7d7-7e156b941210'),
(28, 28, 'en_gb', '3-06', NULL, 1, '2017-11-15 12:55:06', '2017-11-15 14:44:41', '1b772836-a176-45ec-a4fa-073e355a6280'),
(29, 29, 'en_gb', '', NULL, 1, '2017-11-15 12:55:19', '2017-11-24 16:40:43', 'a3d00aa2-a794-4f62-82a2-e47184cbcf4c'),
(30, 30, 'en_gb', '', NULL, 1, '2017-11-15 12:55:19', '2017-11-24 16:40:43', '5a2470f8-ef27-45db-8c7b-0c55fb9de06a'),
(31, 31, 'en_gb', '1-01', NULL, 1, '2017-11-15 14:44:30', '2017-11-15 14:44:31', 'c5c8133b-788b-49d5-b846-3ff09fc9dd4a'),
(32, 32, 'en_gb', '1-03', NULL, 1, '2017-11-15 14:44:31', '2017-11-15 14:44:31', '39434faa-5021-4035-8198-fc50231a6873'),
(33, 33, 'en_gb', '1-02', NULL, 1, '2017-11-15 14:44:31', '2017-11-15 14:44:32', 'bac3dd4c-10b3-4c69-8b7a-7c1a50807c3f'),
(34, 34, 'en_gb', 'android-icon-144x144', NULL, 1, '2017-11-15 14:44:32', '2017-11-15 14:44:32', '059a318f-dae4-4763-baaf-28dcad0ec7e1'),
(35, 35, 'en_gb', 'android-icon-192x192', NULL, 1, '2017-11-15 14:44:32', '2017-11-15 14:44:32', 'dbb4e376-0b2c-499c-a588-aa4df6be6032'),
(36, 36, 'en_gb', 'android-icon-36x36', NULL, 1, '2017-11-15 14:44:32', '2017-11-15 14:44:32', '4b586c43-be68-4531-9c3d-31e7103d16bf'),
(37, 37, 'en_gb', 'android-icon-48x48', NULL, 1, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '7b8d1fee-ede4-4837-b337-31ad8055f263'),
(38, 38, 'en_gb', 'android-icon-72x72', NULL, 1, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '3c355ac9-2868-4ddc-bf98-98876eb515ae'),
(39, 39, 'en_gb', 'android-icon-96x96', NULL, 1, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '3e3e8128-3802-4946-a55d-0d92bf247d29'),
(40, 40, 'en_gb', 'apple-icon-114x114', NULL, 1, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '86cbf66b-90d0-414d-bc44-889cf674b541'),
(41, 41, 'en_gb', 'apple-icon-120x120', NULL, 1, '2017-11-15 14:44:33', '2017-11-15 14:44:33', '32758ca3-7a61-4b44-8459-97d8f328d5a9'),
(42, 42, 'en_gb', 'apple-icon-144x144', NULL, 1, '2017-11-15 14:44:33', '2017-11-15 14:44:34', '78279fd4-c169-4ecd-bd84-351cf655aba5'),
(43, 43, 'en_gb', 'apple-icon-152x152', NULL, 1, '2017-11-15 14:44:34', '2017-11-15 14:44:34', 'aa4dc9d4-e4b0-4c3c-adf7-94275fb4a997'),
(44, 44, 'en_gb', 'apple-icon-180x180', NULL, 1, '2017-11-15 14:44:34', '2017-11-15 14:44:34', '8a7852ea-b1b2-4a96-bed4-890dded84c1c'),
(45, 45, 'en_gb', 'apple-icon-57x57', NULL, 1, '2017-11-15 14:44:34', '2017-11-15 14:44:34', 'e13287bc-1c62-40ca-a237-a0e806436837'),
(46, 46, 'en_gb', 'apple-icon-60x60', NULL, 1, '2017-11-15 14:44:34', '2017-11-15 14:44:34', '11d3e4ae-31be-4bbc-831d-476d154e94b8'),
(47, 47, 'en_gb', 'apple-icon-72x72', NULL, 1, '2017-11-15 14:44:34', '2017-11-15 14:44:34', '829fbe22-e41a-42e2-a5e5-73c961d33a32'),
(48, 48, 'en_gb', 'apple-icon-76x76', NULL, 1, '2017-11-15 14:44:35', '2017-11-15 14:44:35', '643c612a-71a7-4686-8946-18680c0060b3'),
(49, 49, 'en_gb', 'apple-icon-precomposed', NULL, 1, '2017-11-15 14:44:35', '2017-11-15 14:44:35', '6c2060db-a61b-41de-9629-e2f13772108d'),
(50, 50, 'en_gb', 'apple-icon', NULL, 1, '2017-11-15 14:44:35', '2017-11-15 14:44:35', 'b7d23824-4df0-4ab3-af7e-8acf60ebc009'),
(51, 51, 'en_gb', 'down-arrow', NULL, 1, '2017-11-15 14:44:35', '2017-11-15 14:44:35', '3b3687be-9007-45fd-bece-ebdc39d0141e'),
(52, 52, 'en_gb', 'email-logo', NULL, 1, '2017-11-15 14:44:35', '2017-11-15 14:44:35', 'a18664e9-46fc-4d3d-a52b-803a18bbba1f'),
(53, 53, 'en_gb', 'email-simon', NULL, 1, '2017-11-15 14:44:35', '2017-11-15 14:44:36', '28ea64d1-83fe-408f-bd3c-03f9d13c3709'),
(54, 54, 'en_gb', 'email-steve', NULL, 1, '2017-11-15 14:44:36', '2017-11-15 14:44:36', '17d4d13d-5c24-4fc8-9c97-cdf98f7b8849'),
(55, 55, 'en_gb', 'favicon-16x16', NULL, 1, '2017-11-15 14:44:36', '2017-11-15 14:44:36', '983eba3f-af85-4728-90e5-99b0cb60c86c'),
(56, 56, 'en_gb', 'favicon-32x32', NULL, 1, '2017-11-15 14:44:36', '2017-11-15 14:44:36', 'dd53896e-35e9-4c1a-9aa9-314cc429e088'),
(57, 57, 'en_gb', 'favicon-96x96', NULL, 1, '2017-11-15 14:44:36', '2017-11-15 14:44:36', '62ce6f3b-d96f-41c4-9f12-d418a71c2ce0'),
(58, 58, 'en_gb', '2-01', NULL, 1, '2017-11-15 14:44:36', '2017-11-15 14:44:37', 'e5a41c66-0359-47e8-be01-a6e9c6d79c88'),
(59, 59, 'en_gb', '2-02', NULL, 1, '2017-11-15 14:44:37', '2017-11-15 14:44:37', '45d3a724-5b6a-4a0a-9afd-4914df10ce41'),
(60, 60, 'en_gb', '2-03', NULL, 1, '2017-11-15 14:44:38', '2017-11-15 14:44:38', '6627e94e-7dbc-4c38-8ee6-64b50281a725'),
(61, 61, 'en_gb', 'instagram', NULL, 1, '2017-11-15 14:44:41', '2017-11-15 14:44:41', 'cc61dad3-2ee6-414d-8d0f-b0b4150bcf12'),
(62, 62, 'en_gb', 'linked-in', NULL, 1, '2017-11-15 14:44:41', '2017-11-15 14:44:41', 'f3ea48c1-2824-4a31-a23b-6d0cb4247349'),
(63, 63, 'en_gb', 'loading', NULL, 1, '2017-11-15 14:44:41', '2017-11-15 14:44:41', 'b540f426-8f77-4d79-99c9-d3f96615f55c'),
(64, 64, 'en_gb', 'logo', NULL, 1, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '330f8e4d-5bef-45cc-87e0-b118a470dd78'),
(65, 65, 'en_gb', 'ms-icon-144x144', NULL, 1, '2017-11-15 14:44:42', '2017-11-15 14:44:42', 'b88b221b-de9a-47a3-b92f-f895537cdde1'),
(66, 66, 'en_gb', 'ms-icon-150x150', NULL, 1, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '36f883c1-7b31-4e88-b371-f404c6db430f'),
(67, 67, 'en_gb', 'ms-icon-310x310', NULL, 1, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '509602d6-086b-4189-8857-b183b3c62923'),
(68, 68, 'en_gb', 'ms-icon-70x70', NULL, 1, '2017-11-15 14:44:42', '2017-11-15 14:44:42', '5637145a-4c68-425e-8f26-b90312b00cbb'),
(69, 69, 'en_gb', 'social-icons', NULL, 1, '2017-11-15 14:44:42', '2017-11-15 14:44:43', 'a72759fd-851f-4229-8a97-8f2d024b2c11'),
(70, 70, 'en_gb', 'twitter', NULL, 1, '2017-11-15 14:44:43', '2017-11-15 14:44:43', 'c9f28abb-c82d-4885-83fd-c237beb6c71e'),
(71, 71, 'en_gb', '4-01', NULL, 1, '2017-11-15 14:44:43', '2017-11-15 14:44:43', '88a0d3fa-b244-4885-aaff-5d89f0c4a00c'),
(72, 72, 'en_gb', '4-02', NULL, 1, '2017-11-15 14:44:43', '2017-11-15 14:44:43', 'f9d62c4c-5242-41c1-ac4d-2517bc90f8b3'),
(73, 73, 'en_gb', '4-03', NULL, 1, '2017-11-15 14:44:44', '2017-11-15 14:44:44', '0f31f860-883c-43fc-ba64-b89ca666a5c6'),
(74, 74, 'en_gb', 'how-we-innovate', 'how-we-innovate/how-we-innovate', 1, '2017-11-15 15:38:01', '2017-11-15 17:04:12', '3c653447-be84-400b-8f9d-a0006e26debd'),
(75, 75, 'en_gb', '', NULL, 1, '2017-11-15 15:38:01', '2017-11-15 15:45:57', '487f30c6-68b9-4998-b006-1143997f4842'),
(78, 78, 'en_gb', '', NULL, 1, '2017-11-15 15:45:57', '2017-11-15 15:45:57', '3aeb48de-512b-41fd-a641-6afc6db30daa'),
(79, 79, 'en_gb', '', NULL, 1, '2017-11-15 15:45:57', '2017-11-15 15:45:57', '56150e43-09a8-4893-bbc1-05e66dea9ed3'),
(80, 80, 'en_gb', 'work-with-us', 'work-with-us/work-with-us', 1, '2017-11-15 17:07:16', '2017-11-23 12:28:40', '6415bc28-0985-43cd-ba80-587147f64672'),
(81, 81, 'en_gb', '', NULL, 1, '2017-11-15 17:14:34', '2017-11-23 12:28:40', '02da8200-838b-487e-a950-ca8d4a3127b4'),
(82, 82, 'en_gb', '', NULL, 1, '2017-11-15 17:14:34', '2017-11-23 12:28:40', 'c473c397-78fe-46bf-bd38-ce9a2fc6b8dc'),
(83, 83, 'en_gb', '', NULL, 1, '2017-11-15 17:14:34', '2017-11-23 12:28:40', '45545936-a61a-448e-9d32-37c4d84e24f1'),
(84, 84, 'en_gb', 'about-us', 'about-us', 1, '2017-11-16 11:07:37', '2017-11-23 12:33:34', 'a7b38f07-d9fe-4ea0-9f90-8bd1552db127'),
(87, 87, 'en_gb', 'landing-video', NULL, 1, '2017-11-17 12:01:53', '2017-11-17 12:01:53', '09190e3b-949f-4a12-a2be-469c70c45ffa'),
(88, 88, 'en_gb', 'home-video', 'home-video', 1, '2017-11-17 12:37:57', '2017-11-20 12:03:28', '0a3ec83b-693e-4ce8-b74e-88e3390e41cb'),
(89, 89, 'en_gb', 'contact-us', 'contact-us', 1, '2017-11-17 14:03:16', '2017-11-23 12:39:53', 'beb57ba2-0e63-4d15-bb6b-e6dc2af01580'),
(90, 90, 'en_gb', '', NULL, 1, '2017-11-17 14:38:14', '2017-11-23 12:39:53', '1d273cbf-21b3-4419-b18e-ad2bb2812568');

-- --------------------------------------------------------

--
-- Table structure for table `craft_emailmessages`
--

CREATE TABLE `craft_emailmessages` (
  `id` int(11) NOT NULL,
  `key` char(150) COLLATE utf8_unicode_ci NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `subject` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
  `body` text COLLATE utf8_unicode_ci NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_entries`
--

CREATE TABLE `craft_entries` (
  `id` int(11) NOT NULL,
  `sectionId` int(11) NOT NULL,
  `typeId` int(11) DEFAULT NULL,
  `authorId` int(11) DEFAULT NULL,
  `postDate` datetime DEFAULT NULL,
  `expiryDate` datetime DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_entries`
--

INSERT INTO `craft_entries` (`id`, `sectionId`, `typeId`, `authorId`, `postDate`, `expiryDate`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(4, 3, 3, 1, '2017-11-14 14:25:00', NULL, '2017-11-14 14:25:13', '2017-11-24 16:40:43', '22f424d6-3b1a-4551-8e7e-012e76cbc864'),
(74, 4, 5, 1, '2017-11-15 15:38:00', NULL, '2017-11-15 15:38:01', '2017-11-15 15:45:57', '39126bf3-3c8a-4cbc-b3be-e6d504077555'),
(80, 5, 6, 1, '2017-11-15 17:07:00', NULL, '2017-11-15 17:07:16', '2017-11-23 12:28:40', 'a598dbc2-e27d-4edf-9787-aa250705b5a1'),
(84, 6, NULL, NULL, '2017-11-16 11:07:37', NULL, '2017-11-16 11:07:37', '2017-11-23 12:33:34', 'd0973ce3-8ab8-4d2f-8047-ef01f9cfc8ac'),
(88, 7, 8, NULL, '2017-11-20 11:40:32', NULL, '2017-11-17 12:37:57', '2017-11-20 12:03:28', 'f171994f-7afb-4698-ba96-f1711cbbeecf'),
(89, 8, NULL, NULL, '2017-11-17 14:03:16', NULL, '2017-11-17 14:03:16', '2017-11-23 12:39:53', 'da39c67e-067f-4f65-8c0d-555384f34012');

-- --------------------------------------------------------

--
-- Table structure for table `craft_entrydrafts`
--

CREATE TABLE `craft_entrydrafts` (
  `id` int(11) NOT NULL,
  `entryId` int(11) NOT NULL,
  `sectionId` int(11) NOT NULL,
  `creatorId` int(11) NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `notes` tinytext COLLATE utf8_unicode_ci,
  `data` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_entrytypes`
--

CREATE TABLE `craft_entrytypes` (
  `id` int(11) NOT NULL,
  `sectionId` int(11) NOT NULL,
  `fieldLayoutId` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `handle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `hasTitleField` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `titleLabel` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'Title',
  `titleFormat` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sortOrder` smallint(6) UNSIGNED DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_entrytypes`
--

INSERT INTO `craft_entrytypes` (`id`, `sectionId`, `fieldLayoutId`, `name`, `handle`, `hasTitleField`, `titleLabel`, `titleFormat`, `sortOrder`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(3, 3, 16, 'Imagine-if', 'imagineIf', 1, 'Title', NULL, 1, '2017-11-14 13:00:04', '2017-11-14 15:24:15', '5a078f61-e0df-42f5-a11a-6c3be11bf593'),
(5, 4, 64, 'HWI-entry', 'hwiEntry', 0, NULL, 'How we Innovate', 2, '2017-11-15 15:35:43', '2017-11-17 12:47:34', 'cc605146-b9fd-4621-af7a-c4b9b15af4f4'),
(6, 5, 53, 'WWU-entry', 'workWithUs', 1, 'Section Title', NULL, 1, '2017-11-15 16:45:04', '2017-11-15 17:05:44', '31906312-962c-47f9-a0e1-2292f2b974c2'),
(7, 6, 56, 'About Us', 'aboutUs', 0, NULL, '{section.name|raw}', 1, '2017-11-16 11:07:37', '2017-11-16 11:24:52', '59565dc8-947c-4904-b78f-11eda4b1f85f'),
(8, 7, 72, 'Home', 'homeVideo', 0, NULL, '{section.name|raw}', 1, '2017-11-17 12:37:57', '2017-11-20 11:40:32', '54dca358-38cb-4d93-8f79-40c3a20a5cc8'),
(9, 8, 70, 'Contact Us', 'contactUs', 0, NULL, '{section.name|raw}', 1, '2017-11-17 14:03:16', '2017-11-17 14:36:03', '77448dd9-a123-48d6-b994-6d895b5ec1d8');

-- --------------------------------------------------------

--
-- Table structure for table `craft_entryversions`
--

CREATE TABLE `craft_entryversions` (
  `id` int(11) NOT NULL,
  `entryId` int(11) NOT NULL,
  `sectionId` int(11) NOT NULL,
  `creatorId` int(11) DEFAULT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `num` smallint(6) UNSIGNED NOT NULL,
  `notes` tinytext COLLATE utf8_unicode_ci,
  `data` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_entryversions`
--

INSERT INTO `craft_entryversions` (`id`, `entryId`, `sectionId`, `creatorId`, `locale`, `num`, `notes`, `data`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(4, 4, 3, 1, 'en_gb', 1, '', '{\"typeId\":null,\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669513,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":[]}', '2017-11-14 14:25:13', '2017-11-14 14:25:13', '437a2860-3f69-40e4-bb45-9b1a10cbf247'),
(5, 4, 3, 1, 'en_gb', 2, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":[]}', '2017-11-14 14:33:29', '2017-11-14 14:33:29', '76c63b22-6e85-4346-953d-5c5653b8d1df'),
(8, 4, 3, 1, 'en_gb', 3, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"new1\":{\"type\":\"imagunematrix\",\"enabled\":\"1\",\"fields\":{\"titleimag\":\"Imagine if...\",\"desc\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\"}}}}}', '2017-11-14 15:36:44', '2017-11-14 15:36:44', '6e672a50-6e83-4daa-92cf-bb1e3e3c782f'),
(9, 4, 3, 1, 'en_gb', 4, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"18\"]}}}}}', '2017-11-15 10:34:25', '2017-11-15 10:34:25', '0ddadbd4-1c68-4f95-b77e-23a0a260b244'),
(10, 4, 3, 1, 'en_gb', 5, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"19\"]}}}}}', '2017-11-15 10:54:03', '2017-11-15 10:54:03', '61a87f80-8049-4097-b3bc-451746aeb628'),
(11, 4, 3, 1, 'en_gb', 6, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":\"\"}}}}}', '2017-11-15 11:31:08', '2017-11-15 11:31:08', '5bd1ab49-0781-4981-a572-dfcb510d93ba'),
(12, 4, 3, 1, 'en_gb', 7, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"]}}}}}', '2017-11-15 11:31:28', '2017-11-15 11:31:28', '77e0b433-8d79-4135-9004-7d722a26652d'),
(13, 4, 3, 1, 'en_gb', 8, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"]}},\"new1\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Football clubs used wearable tech to select its teams not only based its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"]}},\"new2\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... An A.I. chatbot who\\u2019s deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"22\"]}},\"new3\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"]}}}}}', '2017-11-15 11:35:24', '2017-11-15 11:35:24', '476b2f72-e476-4f88-a5e9-71e55eb200c4'),
(14, 4, 3, 1, 'en_gb', 9, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"]}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Football clubs used wearable tech to select its teams not only based its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"]}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... An A.I. chatbot who\\u2019s deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"22\"]}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"]}},\"new1\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"]}},\"new2\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"]}}}}}', '2017-11-15 12:55:19', '2017-11-15 12:55:19', 'fe59f1a7-97c8-4167-af26-a4170ee766d4'),
(15, 4, 3, 1, 'en_gb', 10, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"]}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Football clubs used wearable tech to select its teams not only based its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"]}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... An A.I. chatbot who\\u2019s deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"22\"]}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"]}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"]}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"]}}}}}', '2017-11-15 12:59:42', '2017-11-15 12:59:42', 'e463c0b9-27c5-4f1e-bbd7-71554f6e8143'),
(16, 4, 3, 1, 'en_gb', 11, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"]}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Football clubs used wearable tech to select its teams not only based its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"]}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... An A.I. chatbot who\\u2019s deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"22\"]}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"]}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"]}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"]}}}}}', '2017-11-15 13:00:08', '2017-11-15 13:00:08', '0bdd9edd-3068-4865-940d-8aec515b0bae'),
(17, 4, 3, 1, 'en_gb', 12, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"]}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Football clubs used wearable tech to select its teams not only based its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"]}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... An A.I. chatbot who\\u2019s deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"22\"]}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"]}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"]}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"]}}}}}', '2017-11-15 13:10:39', '2017-11-15 13:10:39', 'd7e53828-7593-4e5d-9069-66fc5f2b8a90'),
(18, 4, 3, 1, 'en_gb', 13, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"]}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Football clubs used wearable tech to select its teams not only based its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"]}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... An A.I. chatbot who\\u2019s deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"19\"]}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"]}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"]}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"]}}}}}', '2017-11-15 14:45:32', '2017-11-15 14:45:32', 'ba5acbda-12f6-4387-85ca-2d3d7c714c75'),
(19, 74, 4, 1, 'en_gb', 1, '', '{\"typeId\":null,\"authorId\":\"1\",\"title\":\"How we Innovate\",\"slug\":\"how-we-innovate\",\"postDate\":1510760281,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"10\":{\"new1\":{\"type\":\"subheading\",\"enabled\":\"1\",\"fields\":{\"subHeading\":\"create\"}},\"new2\":{\"type\":\"paragraphText\",\"enabled\":\"1\",\"fields\":{\"paragraphText\":\"We are a collective of data scientists, tech engineers and creative pioneers who have cultivated world class experience in sports. Our fan insights inspire technology led ideas brought to life through our products, platforms and service-led experiences.\"}},\"new3\":{\"type\":\"backgroundimage\",\"enabled\":\"1\",\"fields\":{\"backgroundImage\":[\"58\"]}}}}}', '2017-11-15 15:38:01', '2017-11-15 15:38:01', '58cd947d-c792-45f9-bdd3-84b567841b23'),
(20, 74, 4, 1, 'en_gb', 2, '', '{\"typeId\":\"5\",\"authorId\":\"1\",\"title\":\"How we Innovate\",\"slug\":\"how-we-innovate\",\"postDate\":1510760280,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"10\":{\"75\":{\"type\":\"HWIdata\",\"enabled\":\"1\",\"fields\":{\"subHeading\":\"create\",\"paragraph\":\"We are a collective of data scientists, tech engineers and creative pioneers who have cultivated world class experience in sports. Our fan insights inspire technology led ideas brought to life through our products, platforms and service-led experiences.\",\"backgroundimage\":[\"58\"]}}}}}', '2017-11-15 15:44:30', '2017-11-15 15:44:30', '01aa4970-e5c4-42cf-aaf4-4020d2db4104'),
(21, 74, 4, 1, 'en_gb', 3, '', '{\"typeId\":\"5\",\"authorId\":\"1\",\"title\":\"How we Innovate\",\"slug\":\"how-we-innovate\",\"postDate\":1510760280,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"10\":{\"75\":{\"type\":\"HWIdata\",\"enabled\":\"1\",\"fields\":{\"subHeading\":\"create\",\"paragraph\":\"We are a collective of data scientists, tech engineers and creative pioneers who have cultivated world class experience in sports. Our fan insights inspire technology led ideas brought to life through our products, platforms and service-led experiences.\",\"backgroundimage\":[\"58\"]}},\"new1\":{\"type\":\"HWIdata\",\"enabled\":\"1\",\"fields\":{\"subHeading\":\"curate\",\"paragraph\":\"We identify, incubate and accelerate technology based start-ups to create disruptive sport concepts for global sports fans.\",\"backgroundimage\":[\"59\"]}},\"new2\":{\"type\":\"HWIdata\",\"enabled\":\"1\",\"fields\":{\"subHeading\":\"collaborate\",\"paragraph\":\"With decades of sports marketing experience and envied connectivity in the sector, we work side-by-side with high profile sports leagues, teams and digital platforms to ensure the best exposure and access to our ideas by global fan communities.\",\"backgroundimage\":[\"60\"]}}}}}', '2017-11-15 15:45:57', '2017-11-15 15:45:57', '2be226e6-0790-4f6a-9017-be3df3818bf9'),
(22, 80, 5, 1, 'en_gb', 1, '', '{\"typeId\":null,\"authorId\":\"1\",\"title\":\"Work with us\",\"slug\":\"work-with-us\",\"postDate\":1510765636,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"16\":\"\"}}', '2017-11-15 17:07:16', '2017-11-15 17:07:16', 'f485c26f-063c-44ff-a46b-43b36ac722cd'),
(23, 80, 5, 1, 'en_gb', 2, '', '{\"typeId\":\"6\",\"authorId\":\"1\",\"title\":\"Work with us\",\"slug\":\"work-with-us\",\"postDate\":1510765620,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"16\":{\"new1\":{\"type\":\"wwuEntry\",\"enabled\":\"1\",\"fields\":{\"subHeading\":\"Inspire\",\"paragraph\":\"Do you have an idea, a vision or an aspiration you believe could revolutionise a sports experience for fans? Can you hook us in 50 words or less?\",\"backgroundImage\":[\"71\"],\"buttonText\":\"hello\"}},\"new2\":{\"type\":\"wwuEntry\",\"enabled\":\"1\",\"fields\":{\"subHeading\":\"Partner\",\"paragraph\":\"Are you are an established start-up or small business with a technology or proof of concept that could benefit sports fans?\",\"backgroundImage\":[\"72\"],\"buttonText\":\"Hello\"}},\"new3\":{\"type\":\"wwuEntry\",\"enabled\":\"1\",\"fields\":{\"subHeading\":\"Join\",\"paragraph\":\"Are you passionate about technology, sports, creativity and teamwork? We\\u2019re looking for people like you.\",\"backgroundImage\":[\"73\"],\"buttonText\":\"Hello\"}}}}}', '2017-11-15 17:14:34', '2017-11-15 17:14:34', '4855b309-79f3-4c13-b4be-a6fd1cf3a4b8'),
(24, 84, 6, 1, 'en_gb', 1, NULL, '{\"typeId\":\"7\",\"authorId\":null,\"title\":\"About Us\",\"slug\":\"about-us\",\"postDate\":1510830457,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":[]}', '2017-11-16 11:07:37', '2017-11-16 11:07:37', '7e0aa1c3-a37a-4eb4-8fb7-59341c8a1207'),
(25, 84, 6, 1, 'en_gb', 2, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"About Us\",\"slug\":\"about-us\",\"postDate\":1510830457,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":[]}', '2017-11-16 11:21:11', '2017-11-16 11:21:11', '625c976d-9fce-4081-bc0c-14b567207235'),
(26, 84, 6, 1, 'en_gb', 3, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"About Us\",\"slug\":\"about-us\",\"postDate\":1510830457,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"22\":[\"31\",\"33\",\"32\"],\"21\":\"\"}}', '2017-11-16 11:26:04', '2017-11-16 11:26:04', '577e47b5-7cf5-4d15-a0cb-50bf5a415a7f'),
(27, 84, 6, 1, 'en_gb', 4, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"About Us\",\"slug\":\"about-us\",\"postDate\":1510830457,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"22\":[\"31\",\"33\",\"32\"],\"21\":\"<p>Professional sport now enjoys a truly global following. Through technology our Fantastec goal is to enable ever richer more rewarding fan experiences.<br><\\/p>\\r\\n<p>Only 0.5% of the annual English Premier League audience experience a match from a stadium seat. Yet billions of fans the world over follow the action, the characters and the stories.<\\/p>\\r\\n<p>Through emerging technologies like A.I, Virtual & Augmented Reality, wearable tech and the Blockchain, Fantastec is developing products, platforms and experiences so globally distanced fans can connect and engage more deeply with the sport they love.<\\/p>\"}}', '2017-11-16 11:32:29', '2017-11-16 11:32:29', 'aeb4c199-c336-46b8-88ff-b8113e56bb76'),
(28, 84, 6, 1, 'en_gb', 5, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"About Us\",\"slug\":\"about-us\",\"postDate\":1510830457,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"22\":[\"31\",\"33\",\"32\"],\"21\":\"Professional sport now enjoys a truly global following. Through technology our Fantastec goal is to enable ever richer more rewarding fan experiences.\\r\\n\\r\\nOnly 0.5% of the annual English Premier League audience experience a match from a stadium seat. Yet billions of fans the world over follow the action, the characters and the stories.\\r\\n\\r\\nThrough emerging technologies like A.I, Virtual & Augmented Reality, wearable tech and the Blockchain, Fantastec is developing products, platforms and experiences so globally distanced fans can connect and engage more deeply with the sport they love.\"}}', '2017-11-16 11:34:47', '2017-11-16 11:34:47', '0257cef3-2557-4a42-81ca-b10bd5013b59'),
(29, 84, 6, 1, 'en_gb', 6, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"About Us\",\"slug\":\"about-us\",\"postDate\":1510830457,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"22\":[\"31\",\"33\",\"32\"],\"21\":\"Professional sport now enjoys a truly global following. Through technology our Fantastec goal is to enable ever richer more rewarding fan experiences.  Only 0.5% of the annual English Premier League audience experience a match from a stadium seat. Yet billions of fans the world over follow the action, the characters and the stories.  Through emerging technologies like A.I, Virtual & Augmented Reality, wearable tech and the Blockchain, Fantastec is developing products, platforms and experiences so globally distanced fans can connect and engage more deeply with the sport they love.\"}}', '2017-11-16 11:36:33', '2017-11-16 11:36:33', 'a0c0b95c-e17e-4dcd-83b4-7417e45991c7'),
(30, 84, 6, 1, 'en_gb', 7, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"About Us\",\"slug\":\"about-us\",\"postDate\":1510830457,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"22\":[\"31\",\"33\",\"32\"],\"21\":\"<p>Professional sport now enjoys a truly global following. Through technology our Fantastec goal is to enable ever richer more rewarding fan experiences.<\\/p>\\r\\n<p>Only 0.5% of the annual English Premier League audience experience a match from a stadium seat. Yet billions of fans the world over follow the action, the characters and the stories.<\\/p>\\r\\n<p>Through emerging technologies like A.I, Virtual & Augmented Reality, wearable tech and the Blockchain, Fantastec is developing products, platforms and experiences so globally distanced fans can connect and engage more deeply with the sport they love.<\\/p>\"}}', '2017-11-16 11:40:47', '2017-11-16 11:40:47', 'c92f105a-d26f-40d9-bbc8-7f857a3a1dd9'),
(31, 84, 6, 1, 'en_gb', 8, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"About Us\",\"slug\":\"about-us\",\"postDate\":1510830457,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"22\":[\"31\",\"33\",\"32\"],\"21\":\"<p>Professional sport now enjoys a truly global following. Through technology our Fantastec goal is to enable ever richer more rewarding fan experiences.<\\/p>\\r\\n<p>Only 0.5% of the annual English Premier League audience experience a match from a stadium seat. Yet billions of fans the world over follow the action, the characters and the stories.<\\/p>\\r\\n<p>Through emerging technologies like A.I, Virtual & Augmented Reality, wearable tech and the Blockchain, Fantastec is developing products, platforms and experiences so globally distanced fans can connect and engage more deeply with the sport they love.<\\/p>\"}}', '2017-11-16 11:41:40', '2017-11-16 11:41:40', 'dd930d47-1a40-4b6f-8afa-348ecd46c856'),
(36, 88, 7, 1, 'en_gb', 1, NULL, '{\"typeId\":\"8\",\"authorId\":null,\"title\":\"Home Video\",\"slug\":\"home-video\",\"postDate\":1510922277,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":[]}', '2017-11-17 12:37:57', '2017-11-17 12:37:57', 'e0a3f4d7-1c4d-405f-8497-67700bb1d701'),
(37, 88, 7, 1, 'en_gb', 2, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"Home Video\",\"slug\":\"home-video\",\"postDate\":1510922277,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"23\":[\"87\"]}}', '2017-11-17 12:38:24', '2017-11-17 12:38:24', '5ed80d0e-263e-492c-9146-1e323dd609be'),
(38, 89, 8, 1, 'en_gb', 1, NULL, '{\"typeId\":\"9\",\"authorId\":null,\"title\":\"Contact Us\",\"slug\":\"contact-us\",\"postDate\":1510927396,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":[]}', '2017-11-17 14:03:16', '2017-11-17 14:03:16', '4606b6b3-fbde-41f5-90c2-374d5914d4e8'),
(39, 89, 8, 1, 'en_gb', 2, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"Contact Us\",\"slug\":\"contact-us\",\"postDate\":1510927396,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"25\":{\"new1\":{\"type\":\"mapMarkerData\",\"enabled\":\"1\",\"fields\":{\"markerTitle\":\"Fantastec\",\"address\":\"<p>Surrey Technology Centre<\\/p><p>40 Occam Road<\\/p><p>Guildford Surrey<\\/p><p>GU2 7YG<\\/p>\",\"googleMapsLink\":\"https:\\/\\/www.google.com\\/maps\\/place\\/Surrey+Research+Park\\/@51.2396613,-0.6142707,17z\\/data=!4m5!3m4!1s0x0:0x632d0439c869347!8m2!3d51.2398362!4d-0.6120311\",\"telephoneNumber\":\"+44 207 654 321\",\"contactEmailAddress\":\"hello@fantastec.io\"}}}}}', '2017-11-17 14:38:14', '2017-11-17 14:38:14', '967c83e0-9244-417d-99ef-f91daa07ca4d'),
(40, 88, 7, 1, 'en_gb', 3, '', '{\"typeId\":\"8\",\"authorId\":null,\"title\":\"Home\",\"slug\":\"home-video\",\"postDate\":1511178032,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"31\":{\"seoMainEntityCategory\":\"CreativeWork\",\"seoMainEntityOfPage\":\"WebPage\",\"seoTitleSource\":\"field\",\"seoTitleSourceField\":\"title\",\"seoTitleUnparsed\":\"\",\"seoDescriptionSource\":\"custom\",\"seoDescriptionSourceField\":\"title\",\"seoDescriptionUnparsed\":\"\",\"seoKeywordsSource\":\"custom\",\"seoKeywordsSourceField\":\"title\",\"seoKeywordsUnparsed\":\"\",\"seoImageIdSource\":\"custom\",\"seoImageIdSourceField\":\"videos\",\"seoImageId\":\"\",\"seoImageTransform\":\"\",\"canonicalUrlOverride\":\"\",\"twitterCardType\":\"\",\"seoTwitterImageIdSource\":\"custom\",\"seoTwitterImageIdSourceField\":\"videos\",\"seoTwitterImageId\":\"\",\"seoTwitterImageTransform\":\"\",\"openGraphType\":\"\",\"seoFacebookImageIdSource\":\"custom\",\"seoFacebookImageIdSourceField\":\"videos\",\"seoFacebookImageId\":\"\",\"seoFacebookImageTransform\":\"\",\"robots\":\"\"},\"23\":[\"87\"]}}', '2017-11-20 12:03:28', '2017-11-20 12:03:28', '7d628ba7-4565-4271-b18f-e13d424f4b6e'),
(41, 80, 5, 1, 'en_gb', 3, '', '{\"typeId\":\"6\",\"authorId\":\"1\",\"title\":\"Work with us\",\"slug\":\"work-with-us\",\"postDate\":1510765620,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"16\":{\"81\":{\"type\":\"wwuEntry\",\"enabled\":\"1\",\"fields\":{\"subHeading\":\"Inspire\",\"paragraph\":\"Do you have an idea, a vision or an aspiration you believe could revolutionise a sports experience for fans? Can you hook us in 50 words or less?\",\"backgroundImage\":[\"71\"],\"buttonText\":\"hello\"}},\"82\":{\"type\":\"wwuEntry\",\"enabled\":\"1\",\"fields\":{\"subHeading\":\"Partner\",\"paragraph\":\"Are you an established start-up or small business with a technology or proof of concept that could benefit sports fans?\",\"backgroundImage\":[\"72\"],\"buttonText\":\"Hello\"}},\"83\":{\"type\":\"wwuEntry\",\"enabled\":\"1\",\"fields\":{\"subHeading\":\"Join\",\"paragraph\":\"Are you passionate about technology, sports, creativity and teamwork? We\\u2019re looking for people like you.\",\"backgroundImage\":[\"73\"],\"buttonText\":\"Hello\"}}}}}', '2017-11-23 12:28:40', '2017-11-23 12:28:40', 'fc11cb8d-7842-412d-bedf-370a5fce419d'),
(42, 4, 3, 1, 'en_gb', 14, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"]}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;Football clubs used wearable tech to select its teams not only based on its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"]}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;An A.I. chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"19\"]}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"]}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"]}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"]}}}}}', '2017-11-23 12:32:33', '2017-11-23 12:32:33', '8f4af21f-1ec2-4030-a68c-360b1e1bca6d'),
(43, 84, 6, 1, 'en_gb', 9, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"About Us\",\"slug\":\"about-us\",\"postDate\":1510830457,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"22\":[\"31\",\"33\",\"32\"],\"21\":\"<p>Professional sport now enjoys a truly global following. Through technology our Fantastec goal is to enable ever richer more rewarding fan experiences.<\\/p>\\r\\n<p>Only 0.5% of the annual English Premier League audience experience a match from a stadium seat. Yet billions of fans around the world follow the action, the characters and the stories.<br><\\/p>\\r\\n<p>Through emerging technologies like virtual & augmented reality, wearable tech, A.I and the Blockchain, Fantastec is developing products, platforms and experiences so globally distanced fans can connect and engage more deeply with the sport they love.<br><\\/p>\"}}', '2017-11-23 12:33:34', '2017-11-23 12:33:34', '0305d221-fbee-4375-afbd-8b88d66ff1ba'),
(44, 89, 8, 1, 'en_gb', 3, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"Contact Us\",\"slug\":\"contact-us\",\"postDate\":1510927396,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"25\":{\"90\":{\"type\":\"mapMarkerData\",\"enabled\":\"1\",\"fields\":{\"markerTitle\":\"Fantastec\",\"address\":\"<p>Surrey Technology Centre<\\/p>\\r\\n<p>40 Occam Road<\\/p>\\r\\n<p>Guildford Surrey<\\/p>\\r\\n<p>GU2 7YG<\\/p>\",\"googleMapsLink\":\"https:\\/\\/www.google.com\\/maps\\/place\\/Surrey+Research+Park\\/@51.2396613,-0.6142707,17z\\/data=!4m5!3m4!1s0x0:0x632d0439c869347!8m2!3d51.2398362!4d-0.6120311\",\"telephoneNumber\":\"+44 148 368 8309\",\"telephoneNumberAlternative\":\"+44 148 3688186\",\"contactEmailAddress\":\"hello@fantastec.io\"}}}}}', '2017-11-23 12:39:35', '2017-11-23 12:39:35', '91d4c2ce-b6cb-4dbd-9af4-98e8eba104b3'),
(45, 89, 8, 1, 'en_gb', 4, '', '{\"typeId\":null,\"authorId\":null,\"title\":\"Contact Us\",\"slug\":\"contact-us\",\"postDate\":1510927396,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"25\":{\"90\":{\"type\":\"mapMarkerData\",\"enabled\":\"1\",\"fields\":{\"markerTitle\":\"Fantastec\",\"address\":\"<p>Surrey Technology Centre<\\/p>\\r\\n<p>40 Occam Road<\\/p>\\r\\n<p>Guildford Surrey<\\/p>\\r\\n<p>GU2 7YG<\\/p>\",\"googleMapsLink\":\"https:\\/\\/www.google.com\\/maps\\/place\\/Surrey+Research+Park\\/@51.2396613,-0.6142707,17z\\/data=!4m5!3m4!1s0x0:0x632d0439c869347!8m2!3d51.2398362!4d-0.6120311\",\"telephoneNumber\":\"+44 148 368 8309\",\"telephoneNumberAlternative\":\"+44 148 368 8186\",\"contactEmailAddress\":\"hello@fantastec.io\"}}}}}', '2017-11-23 12:39:53', '2017-11-23 12:39:53', '20814429-118c-475c-86df-4f82dbddc074'),
(46, 4, 3, 1, 'en_gb', 15, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"],\"backgroundPosition\":\"left center\"}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;Football clubs used wearable tech to select its teams not only based on its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"],\"backgroundPosition\":\"\"}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;An A.I. chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"19\"],\"backgroundPosition\":\"left center\"}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"],\"backgroundPosition\":\"\"}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"],\"backgroundPosition\":\"\"}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"],\"backgroundPosition\":\"left center\"}}}}}', '2017-11-24 15:50:38', '2017-11-24 15:50:38', '6c40d7be-0fcb-4c89-8e69-3de6591a537b'),
(47, 4, 3, 1, 'en_gb', 16, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"],\"backgroundPosition\":\"right center\"}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;Football clubs used wearable tech to select its teams not only based on its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"],\"backgroundPosition\":\"\"}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;An A.I. chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"19\"],\"backgroundPosition\":\"right center\"}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"],\"backgroundPosition\":\"\"}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"],\"backgroundPosition\":\"\"}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"],\"backgroundPosition\":\"right center\"}}}}}', '2017-11-24 16:19:47', '2017-11-24 16:19:47', '6895c3db-8e6a-40f1-89c1-9202bf28bc09'),
(48, 4, 3, 1, 'en_gb', 17, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"],\"backgroundPosition\":\"right center\"}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;Football clubs used wearable tech to select its teams not only based on its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"],\"backgroundPosition\":\" 25% center\"}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;An A.I. chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"19\"],\"backgroundPosition\":\"right center\"}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"],\"backgroundPosition\":\"\"}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"],\"backgroundPosition\":\"\"}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"],\"backgroundPosition\":\"right center\"}}}}}', '2017-11-24 16:25:12', '2017-11-24 16:25:12', 'd5c6e964-279f-486c-99e2-9d94b5aaf367'),
(49, 4, 3, 1, 'en_gb', 18, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"],\"backgroundPosition\":\"right center\"}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;Football clubs used wearable tech to select its teams not only based on its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"],\"backgroundPosition\":\" 25% center\"}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;An A.I. chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"19\"],\"backgroundPosition\":\"75% center\"}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"],\"backgroundPosition\":\"\"}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"],\"backgroundPosition\":\"\"}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"],\"backgroundPosition\":\"\"}}}}}', '2017-11-24 16:33:19', '2017-11-24 16:33:19', '754f8634-a74e-4c89-af70-9b5f4beb9dfd'),
(50, 4, 3, 1, 'en_gb', 19, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"],\"backgroundPosition\":\"right center\"}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;Football clubs used wearable tech to select its teams not only based on its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"],\"backgroundPosition\":\" 25% center\"}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;An A.I. chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"19\"],\"backgroundPosition\":\"75% center\"}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"],\"backgroundPosition\":\"\"}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"],\"backgroundPosition\":\"\"}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"],\"backgroundPosition\":\"\"}}}}}', '2017-11-24 16:33:28', '2017-11-24 16:33:28', 'fb8644fb-816e-4d62-970b-2ed07691c95f');
INSERT INTO `craft_entryversions` (`id`, `entryId`, `sectionId`, `creatorId`, `locale`, `num`, `notes`, `data`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(51, 4, 3, 1, 'en_gb', 20, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"],\"backgroundPosition\":\"20% center\"}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;Football clubs used wearable tech to select its teams not only based on its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"],\"backgroundPosition\":\" 25% center\"}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;An A.I. chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"19\"],\"backgroundPosition\":\"75% center\"}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"],\"backgroundPosition\":\"\"}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"],\"backgroundPosition\":\"\"}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"],\"backgroundPosition\":\"\"}}}}}', '2017-11-24 16:35:21', '2017-11-24 16:35:21', '1caebf40-a6f1-48f1-85c9-0137ddbfc344'),
(52, 4, 3, 1, 'en_gb', 21, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"],\"backgroundPosition\":\"40% center\"}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;Football clubs used wearable tech to select its teams not only based on its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"],\"backgroundPosition\":\" 25% center\"}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;An A.I. chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"19\"],\"backgroundPosition\":\"75% center\"}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"],\"backgroundPosition\":\"\"}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"],\"backgroundPosition\":\"\"}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"],\"backgroundPosition\":\"\"}}}}}', '2017-11-24 16:39:25', '2017-11-24 16:39:25', 'b96cb88d-fb5b-4a49-a628-00719c8defb3'),
(53, 4, 3, 1, 'en_gb', 22, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"],\"backgroundPosition\":\"40% center\"}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...\\u00a0Football clubs used wearable tech to select its teams not only based on its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"],\"backgroundPosition\":\" 25% center\"}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...\\u00a0An A.I. chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"19\"],\"backgroundPosition\":\"75% center\"}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"],\"backgroundPosition\":\"\"}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"],\"backgroundPosition\":\"\"}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"],\"backgroundPosition\":\"\"}}}}}', '2017-11-24 16:39:28', '2017-11-24 16:39:28', '9274a577-bee9-45a0-8007-c8cf8cabddb4'),
(54, 4, 3, 1, 'en_gb', 23, '', '{\"typeId\":\"3\",\"authorId\":\"1\",\"title\":\"Imagine if...\",\"slug\":\"imagine-if\",\"postDate\":1510669500,\"expiryDate\":null,\"enabled\":1,\"parentId\":null,\"fields\":{\"6\":{\"6\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.<\\/p>\",\"backgroundImage\":[\"20\"],\"backgroundPosition\":\"50% center\"}},\"24\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;Football clubs used wearable tech to select its teams not only based on its players physical performance in training, but on their mental preparedness.<\\/p>\",\"backgroundImage\":[\"21\"],\"backgroundPosition\":\" 25% center\"}},\"25\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>...&nbsp;An A.I. chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you\\u2019d have fun with that.<\\/p>\",\"backgroundImage\":[\"19\"],\"backgroundPosition\":\"75% center\"}},\"26\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.<\\/p>\",\"backgroundImage\":[\"23\"],\"backgroundPosition\":\"\"}},\"29\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.<\\/p>\",\"backgroundImage\":[\"27\"],\"backgroundPosition\":\"\"}},\"30\":{\"type\":\"imagineIfDataMatrix\",\"enabled\":\"1\",\"fields\":{\"titleContent\":\"Imagine if...\",\"textContent\":\"<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can\\u2019t tell what\\u2019s real.<\\/p>\",\"backgroundImage\":[\"28\"],\"backgroundPosition\":\"\"}}}}}', '2017-11-24 16:40:43', '2017-11-24 16:40:43', '44a3417b-893e-4543-bb75-f7df826799fc');

-- --------------------------------------------------------

--
-- Table structure for table `craft_fieldgroups`
--

CREATE TABLE `craft_fieldgroups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_fieldgroups`
--

INSERT INTO `craft_fieldgroups` (`id`, `name`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 'Default', '2017-11-14 10:47:55', '2017-11-14 10:47:55', '2a29faa7-c3fa-43f0-9cdd-2a498d2919d9'),
(2, 'About Us', '2017-11-16 11:16:58', '2017-11-16 11:16:58', 'd04f9008-e5be-4722-8928-18696df154fe'),
(3, 'Home', '2017-11-20 11:39:12', '2017-11-20 11:39:12', 'f013eb5c-cc00-44a1-b5ba-b17e3c5bad4b');

-- --------------------------------------------------------

--
-- Table structure for table `craft_fieldlayoutfields`
--

CREATE TABLE `craft_fieldlayoutfields` (
  `id` int(11) NOT NULL,
  `layoutId` int(11) NOT NULL,
  `tabId` int(11) NOT NULL,
  `fieldId` int(11) NOT NULL,
  `required` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `sortOrder` smallint(6) UNSIGNED DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_fieldlayoutfields`
--

INSERT INTO `craft_fieldlayoutfields` (`id`, `layoutId`, `tabId`, `fieldId`, `required`, `sortOrder`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(17, 16, 8, 6, 0, 1, '2017-11-14 15:24:15', '2017-11-14 15:24:15', 'fa99fae4-8399-45e5-bfd6-1a823581f4a4'),
(94, 53, 38, 16, 0, 1, '2017-11-15 17:05:44', '2017-11-15 17:05:44', '9a7cb27e-95fb-4f66-a38d-71d7adc4f6ed'),
(98, 56, 40, 22, 0, 1, '2017-11-16 11:24:52', '2017-11-16 11:24:52', '266794db-4b13-4571-8232-d11aded9e872'),
(99, 56, 40, 21, 0, 2, '2017-11-16 11:24:52', '2017-11-16 11:24:52', 'a0e49d89-a46a-433c-8bcc-e913a6a0b319'),
(102, 64, 43, 10, 0, 1, '2017-11-17 12:47:34', '2017-11-17 12:47:34', 'cf9adc19-714a-47c2-8760-f459e7d64e0d'),
(109, 67, 46, 17, 0, 1, '2017-11-17 12:54:42', '2017-11-17 12:54:42', 'ef1406dc-0017-48b5-a4eb-9205bf50e244'),
(110, 67, 46, 18, 0, 2, '2017-11-17 12:54:42', '2017-11-17 12:54:42', '81743960-d519-42d5-b1fa-1d03db1f9248'),
(111, 67, 46, 19, 0, 3, '2017-11-17 12:54:42', '2017-11-17 12:54:42', 'a0b0a70a-4b9a-4d4f-b03b-f71e7438909e'),
(112, 67, 46, 20, 0, 4, '2017-11-17 12:54:42', '2017-11-17 12:54:42', '55d2afd6-663f-43e5-91b8-f35e99ed2b07'),
(118, 70, 48, 25, 0, 1, '2017-11-17 14:36:03', '2017-11-17 14:36:03', 'e8aa9bed-cc36-42e0-9471-0855989ed82c'),
(124, 72, 50, 23, 0, 1, '2017-11-20 11:40:20', '2017-11-20 11:40:20', '970bdcf2-d410-452b-b50b-de99b335d558'),
(125, 72, 50, 31, 0, 2, '2017-11-20 11:40:20', '2017-11-20 11:40:20', '3ed1c8fc-16bc-441d-ab56-17b990883f09'),
(126, 73, 51, 26, 0, 1, '2017-11-23 12:37:46', '2017-11-23 12:37:46', '5ee7b439-6573-4727-aeca-2d5e486d0e87'),
(127, 73, 51, 27, 0, 2, '2017-11-23 12:37:46', '2017-11-23 12:37:46', '791e8f9c-a032-4774-a702-920deb76f73a'),
(128, 73, 51, 28, 0, 3, '2017-11-23 12:37:46', '2017-11-23 12:37:46', '746456e4-a5b7-43c7-9688-6f4e9ac7000f'),
(129, 73, 51, 29, 0, 4, '2017-11-23 12:37:46', '2017-11-23 12:37:46', 'e0701724-1623-46ff-8cdb-22119fc322fe'),
(130, 73, 51, 32, 0, 5, '2017-11-23 12:37:46', '2017-11-23 12:37:46', '270df501-17ba-40b6-a2f0-1a0c4f5ebccc'),
(131, 73, 51, 30, 0, 6, '2017-11-23 12:37:46', '2017-11-23 12:37:46', 'a0327d79-320b-446d-9299-692b193ef906'),
(144, 77, 55, 11, 0, 1, '2017-11-24 16:27:29', '2017-11-24 16:27:29', 'e20657e9-e6a2-4a2b-bc14-7d5682d22add'),
(145, 77, 55, 14, 0, 2, '2017-11-24 16:27:29', '2017-11-24 16:27:29', 'bd10a367-003c-4105-92ed-ad8cde19bfda'),
(146, 77, 55, 15, 0, 3, '2017-11-24 16:27:29', '2017-11-24 16:27:29', 'd5b86835-17e6-4959-970f-9e0e6d3b78c1'),
(147, 77, 55, 33, 0, 4, '2017-11-24 16:27:29', '2017-11-24 16:27:29', '6a05cd06-073b-416b-b58f-dbe4ea1005fe'),
(148, 78, 56, 7, 0, 1, '2017-11-24 16:27:51', '2017-11-24 16:27:51', '482e7ed5-4aa1-41ae-aad6-2bc3d9747468'),
(149, 78, 56, 8, 0, 2, '2017-11-24 16:27:51', '2017-11-24 16:27:51', '0cc4e6df-4e9d-42cf-a2fe-70bcb207856f'),
(150, 78, 56, 9, 0, 3, '2017-11-24 16:27:51', '2017-11-24 16:27:51', 'afadd215-1dda-48ac-8720-5aa0dc47590c'),
(151, 78, 56, 34, 0, 4, '2017-11-24 16:27:51', '2017-11-24 16:27:51', 'd58fbef5-ac0b-49d0-ab52-5523b2ea390c');

-- --------------------------------------------------------

--
-- Table structure for table `craft_fieldlayouts`
--

CREATE TABLE `craft_fieldlayouts` (
  `id` int(11) NOT NULL,
  `type` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_fieldlayouts`
--

INSERT INTO `craft_fieldlayouts` (`id`, `type`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 'Tag', '2017-11-14 10:47:55', '2017-11-14 10:47:55', '934bbcad-039c-4260-8bd3-79f3dbd73e1f'),
(16, 'Entry', '2017-11-14 15:24:15', '2017-11-14 15:24:15', '0e0885fd-9558-4d57-aafc-d8a4423c5b9a'),
(27, 'Asset', '2017-11-14 16:40:59', '2017-11-14 16:40:59', '8f602d9b-e78a-4eb7-a2ac-52531f690413'),
(37, 'Asset', '2017-11-15 10:13:30', '2017-11-15 10:13:30', 'eaf46d77-2825-4e5e-990d-a99fa5be09cd'),
(53, 'Entry', '2017-11-15 17:05:44', '2017-11-15 17:05:44', '7fca4db6-4814-4a3c-b293-3ea5b6dc85b4'),
(56, 'Entry', '2017-11-16 11:24:52', '2017-11-16 11:24:52', '17063f26-7757-4137-99cf-2661c713e676'),
(60, 'Asset', '2017-11-17 11:57:01', '2017-11-17 11:57:01', 'd29c21ae-a271-4719-b65d-50f17e3af146'),
(64, 'Entry', '2017-11-17 12:47:34', '2017-11-17 12:47:34', '8a141c26-fd56-44a3-8c6e-8651734b1cc6'),
(67, 'MatrixBlock', '2017-11-17 12:54:42', '2017-11-17 12:54:42', 'cf276870-dedb-4ad4-bcd9-2d48691de195'),
(70, 'Entry', '2017-11-17 14:36:03', '2017-11-17 14:36:03', 'fa9fc7bb-6008-4c7c-aaf2-c081a2e95f73'),
(72, 'Entry', '2017-11-20 11:40:20', '2017-11-20 11:40:20', '354c8a88-1a62-4afd-bdbb-e19b836a56f9'),
(73, 'MatrixBlock', '2017-11-23 12:37:46', '2017-11-23 12:37:46', '7b376949-e909-4a26-8138-205ba6929394'),
(77, 'MatrixBlock', '2017-11-24 16:27:29', '2017-11-24 16:27:29', '757ff79d-57ae-4e9b-b66f-cd6395266201'),
(78, 'MatrixBlock', '2017-11-24 16:27:51', '2017-11-24 16:27:51', '3b02a9d7-bbac-41b1-85be-4f277c1a17bc');

-- --------------------------------------------------------

--
-- Table structure for table `craft_fieldlayouttabs`
--

CREATE TABLE `craft_fieldlayouttabs` (
  `id` int(11) NOT NULL,
  `layoutId` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sortOrder` smallint(6) UNSIGNED DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_fieldlayouttabs`
--

INSERT INTO `craft_fieldlayouttabs` (`id`, `layoutId`, `name`, `sortOrder`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(8, 16, 'Tab 1', 1, '2017-11-14 15:24:15', '2017-11-14 15:24:15', 'df261325-667e-4000-bd89-e20c3afab115'),
(38, 53, 'Tab 1', 1, '2017-11-15 17:05:44', '2017-11-15 17:05:44', '23ead663-473f-4ffb-9229-fc3311fb1c9a'),
(40, 56, 'Tab 1', 1, '2017-11-16 11:24:52', '2017-11-16 11:24:52', '1d21722a-dccc-4111-90c0-aa1cc1e1bcf6'),
(43, 64, 'Content', 1, '2017-11-17 12:47:34', '2017-11-17 12:47:34', '11a4ee48-443f-4b22-9258-2ac3a310d9f3'),
(46, 67, 'Content', 1, '2017-11-17 12:54:42', '2017-11-17 12:54:42', '8f8ccede-7b41-4a2d-9b80-6d96cb6a9f2d'),
(48, 70, 'Tab 1', 1, '2017-11-17 14:36:03', '2017-11-17 14:36:03', '66a9f264-25e1-452a-98d0-e0fa85ca0a47'),
(50, 72, 'Tab 1', 1, '2017-11-20 11:40:20', '2017-11-20 11:40:20', '36af1f4d-ac2b-4b1d-b9cd-91fbee5cf404'),
(51, 73, 'Content', 1, '2017-11-23 12:37:46', '2017-11-23 12:37:46', '6979c1cf-babb-4196-b518-0415f8e8caf4'),
(55, 77, 'Content', 1, '2017-11-24 16:27:29', '2017-11-24 16:27:29', '8b49a358-6b6b-49c1-a302-23a902833501'),
(56, 78, 'Content', 1, '2017-11-24 16:27:51', '2017-11-24 16:27:51', '50dbf418-2328-454b-825d-cdd3d7763c1a');

-- --------------------------------------------------------

--
-- Table structure for table `craft_fields`
--

CREATE TABLE `craft_fields` (
  `id` int(11) NOT NULL,
  `groupId` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `handle` varchar(58) COLLATE utf8_unicode_ci NOT NULL,
  `context` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'global',
  `instructions` text COLLATE utf8_unicode_ci,
  `translatable` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `type` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `settings` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_fields`
--

INSERT INTO `craft_fields` (`id`, `groupId`, `name`, `handle`, `context`, `instructions`, `translatable`, `type`, `settings`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 1, 'Body', 'body', 'global', NULL, 1, 'RichText', '{\"configFile\":\"Standard.json\",\"columnType\":\"text\"}', '2017-11-14 10:47:55', '2017-11-14 10:47:55', '0d4cd642-d21d-4c74-be90-979e050c8bd5'),
(2, 1, 'Tags', 'tags', 'global', NULL, 0, 'Tags', '{\"source\":\"taggroup:1\"}', '2017-11-14 10:47:55', '2017-11-14 10:47:55', '7fa558e1-8313-495d-b58a-124cfaa6052d'),
(6, 1, 'IIDataMatrix', 'imagineIf', 'global', '', 0, 'Matrix', '{\"maxBlocks\":null}', '2017-11-14 15:23:04', '2017-11-24 16:27:50', 'cbeb0121-3a0c-4f31-95ad-0cfcbff63352'),
(7, NULL, 'Title', 'titleContent', 'matrixBlockType:1', '', 0, 'PlainText', '{\"placeholder\":\"\",\"maxLength\":\"\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-14 15:23:05', '2017-11-24 16:27:50', 'a5729007-ff0f-46f8-b4b0-e892e74eb9fd'),
(8, NULL, 'Text Content', 'textContent', 'matrixBlockType:1', '', 0, 'RichText', '{\"configFile\":\"\",\"availableAssetSources\":\"*\",\"availableTransforms\":\"*\",\"cleanupHtml\":\"1\",\"purifyHtml\":\"1\",\"purifierConfig\":\"\",\"columnType\":\"text\"}', '2017-11-14 15:23:05', '2017-11-24 16:27:51', '9aa6c39c-734a-4e02-9e27-f058e379e00f'),
(9, NULL, 'Background Image', 'backgroundImage', 'matrixBlockType:1', '', 0, 'Assets', '{\"useSingleFolder\":\"\",\"sources\":\"*\",\"defaultUploadLocationSource\":\"2\",\"defaultUploadLocationSubpath\":\"imagineIf\",\"singleUploadLocationSource\":\"2\",\"singleUploadLocationSubpath\":\"assets\\/images\\/{owner.slug}\\/\",\"restrictFiles\":\"\",\"limit\":\"\",\"viewMode\":\"large\",\"selectionLabel\":\"imagine-if\"}', '2017-11-14 15:23:05', '2017-11-24 16:27:51', '5b7fd7da-f3c7-4b30-8b64-29b703e051dc'),
(10, 1, 'HWIdataMatrix', 'hwidatamatrix', 'global', 'A matrix For all fields needed to create entries for the How We Innovate section', 0, 'Matrix', '{\"maxBlocks\":null}', '2017-11-15 15:26:17', '2017-11-24 16:27:28', '3c206a76-86f6-4264-a64d-845ac6fadc94'),
(11, NULL, 'Sub Heading', 'subHeading', 'matrixBlockType:2', '', 0, 'PlainText', '{\"placeholder\":\"\",\"maxLength\":\"100\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-15 15:26:18', '2017-11-24 16:27:28', '5a5dc3ec-93c0-4ded-ba4f-092c105ba752'),
(14, NULL, 'Paragraph', 'paragraph', 'matrixBlockType:2', '', 0, 'PlainText', '{\"placeholder\":\"\",\"maxLength\":\"500\",\"multiline\":\"1\",\"initialRows\":\"1\"}', '2017-11-15 15:43:39', '2017-11-24 16:27:28', '2092fb70-420e-4f23-97e6-441aeee1bd6c'),
(15, NULL, 'Background Image', 'backgroundimage', 'matrixBlockType:2', '', 0, 'Assets', '{\"useSingleFolder\":\"\",\"sources\":\"*\",\"defaultUploadLocationSource\":\"2\",\"defaultUploadLocationSubpath\":\"howWeInnovate\",\"singleUploadLocationSource\":\"2\",\"singleUploadLocationSubpath\":\"\",\"restrictFiles\":\"1\",\"allowedKinds\":[\"image\",\"video\"],\"limit\":\"1\",\"viewMode\":\"large\",\"selectionLabel\":\"Add a background image fro this slide.\"}', '2017-11-15 15:43:39', '2017-11-24 16:27:28', '58e55704-b09f-4d59-a33e-31850adcddca'),
(16, 1, 'WWUdataMatrix', 'wwudatamatrix', 'global', '', 0, 'Matrix', '{\"maxBlocks\":null}', '2017-11-15 17:02:54', '2017-11-17 12:54:42', '03462f34-4f50-4713-b50a-26a43b12c621'),
(17, NULL, 'Sub Heading', 'subHeading', 'matrixBlockType:5', '', 0, 'PlainText', '{\"placeholder\":\"\",\"maxLength\":\"100\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-15 17:02:54', '2017-11-17 12:54:42', '06b5e8ba-9892-4105-8260-27b8be690b51'),
(18, NULL, 'Paragraph', 'paragraph', 'matrixBlockType:5', '', 0, 'PlainText', '{\"placeholder\":\"\",\"maxLength\":\"500\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-15 17:02:54', '2017-11-17 12:54:42', '20a22cb5-d4e5-4f6d-8154-9338fc93ffbd'),
(19, NULL, 'Background Image', 'backgroundImage', 'matrixBlockType:5', '', 0, 'Assets', '{\"useSingleFolder\":\"\",\"sources\":\"*\",\"defaultUploadLocationSource\":\"2\",\"defaultUploadLocationSubpath\":\"workForUs\",\"singleUploadLocationSource\":\"2\",\"singleUploadLocationSubpath\":\"\",\"restrictFiles\":\"1\",\"allowedKinds\":[\"image\",\"video\"],\"limit\":\"\",\"viewMode\":\"large\",\"selectionLabel\":\"\"}', '2017-11-15 17:02:54', '2017-11-17 12:54:42', '03a600db-3a3d-48d5-81d6-7f0ed3c4259e'),
(20, NULL, 'Button Text', 'buttonText', 'matrixBlockType:5', 'Enter text for the button in this section.', 0, 'PlainText', '{\"placeholder\":\"\",\"maxLength\":\"20\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-15 17:02:55', '2017-11-17 12:54:42', 'aed01c3b-9f22-4bcf-befe-a976ee0a571c'),
(21, 1, 'Paragraphs', 'paragraphs', 'global', '', 0, 'RichText', '{\"configFile\":\"Standard.json\",\"availableAssetSources\":\"*\",\"availableTransforms\":\"*\",\"cleanupHtml\":\"1\",\"purifyHtml\":\"1\",\"purifierConfig\":\"\",\"columnType\":\"text\"}', '2017-11-16 11:15:07', '2017-11-16 11:41:23', '68e4a943-ffa9-4d55-9eca-08d9024a45f9'),
(22, 2, 'Images', 'images', 'global', '', 0, 'Assets', '{\"useSingleFolder\":\"\",\"sources\":\"*\",\"defaultUploadLocationSource\":\"2\",\"defaultUploadLocationSubpath\":\"aboutUs\",\"singleUploadLocationSource\":\"2\",\"singleUploadLocationSubpath\":\"\",\"restrictFiles\":\"\",\"limit\":\"10\",\"viewMode\":\"large\",\"selectionLabel\":\"\"}', '2017-11-16 11:16:41', '2017-11-16 11:52:14', 'b854bacc-666b-4c9b-82b5-bafb80729e7a'),
(23, 1, 'Videos', 'videos', 'global', '', 0, 'Assets', '{\"useSingleFolder\":\"\",\"sources\":\"*\",\"defaultUploadLocationSource\":\"3\",\"defaultUploadLocationSubpath\":\"\",\"singleUploadLocationSource\":\"2\",\"singleUploadLocationSubpath\":\"\",\"restrictFiles\":\"\",\"limit\":\"\",\"viewMode\":\"large\",\"selectionLabel\":\"Add a video\"}', '2017-11-17 11:45:37', '2017-11-17 11:49:31', '55428b64-e58e-42a9-b48a-63e1fd93a07e'),
(24, 1, 'Text', 'text', 'global', '', 0, 'PlainText', '{\"placeholder\":\"\",\"maxLength\":\"250\",\"multiline\":\"1\",\"initialRows\":\"5\"}', '2017-11-17 14:26:26', '2017-11-17 14:26:26', '348b6924-dc71-4f3b-bed4-d4d061f6e937'),
(25, 1, 'CUDataMatrix', 'cudatamatrix', 'global', '', 0, 'Matrix', '{\"maxBlocks\":null}', '2017-11-17 14:35:42', '2017-11-23 12:37:46', 'cb5394b3-9912-45e8-b526-faa138a12f12'),
(26, NULL, 'Marker Title', 'markerTitle', 'matrixBlockType:6', '', 0, 'PlainText', '{\"placeholder\":\"\",\"maxLength\":\"100\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-17 14:35:43', '2017-11-23 12:37:46', 'eb1eb5bc-6ace-4508-a155-ca94eb014832'),
(27, NULL, 'Address', 'address', 'matrixBlockType:6', '', 0, 'RichText', '{\"configFile\":\"Standard.json\",\"availableAssetSources\":\"*\",\"availableTransforms\":\"*\",\"cleanupHtml\":\"1\",\"purifyHtml\":\"1\",\"purifierConfig\":\"\",\"columnType\":\"text\"}', '2017-11-17 14:35:43', '2017-11-23 12:37:46', '601901cc-764f-4b29-8626-7e8366c235b5'),
(28, NULL, 'Google Maps Link', 'googleMapsLink', 'matrixBlockType:6', '', 0, 'PlainText', '{\"placeholder\":\"\",\"maxLength\":\"\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-17 14:35:43', '2017-11-23 12:37:46', '4150a9e5-d11a-4a9f-8dc6-8039fb02ca30'),
(29, NULL, 'Telephone Number', 'telephoneNumber', 'matrixBlockType:6', '', 0, 'PlainText', '{\"placeholder\":\"Please use this format: +44 208 554 359\",\"maxLength\":\"\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-17 14:35:43', '2017-11-23 12:37:46', 'dd7922d6-3231-43bb-9095-e15727c3bcfe'),
(30, NULL, 'Contact Email Address', 'contactEmailAddress', 'matrixBlockType:6', '', 0, 'PlainText', '{\"placeholder\":\"\",\"maxLength\":\"\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-17 14:35:43', '2017-11-23 12:37:46', '43c08178-67cd-4045-9436-abf2adf20efc'),
(31, 3, 'SEO', 'seo', 'global', '', 0, 'Seomatic_Meta', '{\"assetSources\":\"*\",\"seoMainEntityCategory\":\"CreativeWork\",\"seoMainEntityOfPage\":\"WebPage\",\"seoTitleSource\":\"field\",\"seoTitleSourceField\":\"title\",\"seoTitle\":\"\",\"seoTitleSourceChangeable\":\"1\",\"seoDescriptionSource\":\"custom\",\"seoDescriptionSourceField\":\"title\",\"seoDescription\":\"\",\"seoDescriptionSourceChangeable\":\"1\",\"seoKeywordsSource\":\"custom\",\"seoKeywordsSourceField\":\"title\",\"seoKeywords\":\"\",\"seoKeywordsSourceChangeable\":\"1\",\"seoImageIdSource\":\"custom\",\"seoImageIdSourceField\":\"images\",\"seoImageIdSourceChangeable\":\"1\",\"seoImageTransform\":\"\",\"twitterCardType\":\"\",\"twitterCardTypeChangeable\":\"1\",\"seoTwitterImageIdSource\":\"custom\",\"seoTwitterImageIdSourceField\":\"images\",\"seoTwitterImageIdSourceChangeable\":\"1\",\"seoTwitterImageTransform\":\"\",\"openGraphType\":\"\",\"openGraphTypeChangeable\":\"1\",\"seoFacebookImageIdSource\":\"custom\",\"seoFacebookImageIdSourceField\":\"images\",\"seoFacebookImageIdSourceChangeable\":\"1\",\"seoFacebookImageTransform\":\"\",\"robots\":\"\",\"robotsChangeable\":\"1\"}', '2017-11-20 11:39:50', '2017-11-20 11:39:50', '43edb3e6-2fef-41de-8ab6-50084363c994'),
(32, NULL, 'Telephone Number Alternative', 'telephoneNumberAlternative', 'matrixBlockType:6', '', 0, 'PlainText', '{\"placeholder\":\"Please use this format: +44 208 554 359\",\"maxLength\":\"\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-23 12:37:46', '2017-11-23 12:37:46', '3cbd7326-73a8-4a56-8377-9c558b64561d'),
(33, NULL, 'Background Position', 'backgroundPosition', 'matrixBlockType:2', '', 0, 'PlainText', '{\"placeholder\":\"For example: center, right or  25% etc...\",\"maxLength\":\"\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-24 15:25:40', '2017-11-24 16:27:29', 'e34aba58-dbcc-4904-8220-07a6736c45f7'),
(34, NULL, 'Background Position', 'backgroundPosition', 'matrixBlockType:1', '', 0, 'PlainText', '{\"placeholder\":\"For example: center, right or  25% etc...\",\"maxLength\":\"\",\"multiline\":\"\",\"initialRows\":\"4\"}', '2017-11-24 15:49:29', '2017-11-24 16:27:51', '4065a95a-e6c9-4486-a4ec-1f03f163b7d7');

-- --------------------------------------------------------

--
-- Table structure for table `craft_globalsets`
--

CREATE TABLE `craft_globalsets` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `handle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fieldLayoutId` int(10) DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_info`
--

CREATE TABLE `craft_info` (
  `id` int(11) NOT NULL,
  `version` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `schemaVersion` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `edition` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `siteName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `siteUrl` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `timezone` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `on` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `maintenance` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_info`
--

INSERT INTO `craft_info` (`id`, `version`, `schemaVersion`, `edition`, `siteName`, `siteUrl`, `timezone`, `on`, `maintenance`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, '2.6.2997', '2.6.11', 0, 'Fantastec', 'http://localhost', 'UTC', 1, 0, '2017-11-14 10:47:49', '2017-11-20 10:07:31', '47607139-8eb4-41cd-99fd-596295a1e120');

-- --------------------------------------------------------

--
-- Table structure for table `craft_locales`
--

CREATE TABLE `craft_locales` (
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `sortOrder` smallint(6) UNSIGNED DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_locales`
--

INSERT INTO `craft_locales` (`locale`, `sortOrder`, `dateCreated`, `dateUpdated`, `uid`) VALUES
('en_gb', 1, '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'bf8c495f-9c94-49ff-8cc9-12071c9ac504');

-- --------------------------------------------------------

--
-- Table structure for table `craft_matrixblocks`
--

CREATE TABLE `craft_matrixblocks` (
  `id` int(11) NOT NULL,
  `ownerId` int(11) NOT NULL,
  `fieldId` int(11) NOT NULL,
  `typeId` int(11) DEFAULT NULL,
  `sortOrder` smallint(6) UNSIGNED DEFAULT NULL,
  `ownerLocale` char(12) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_matrixblocks`
--

INSERT INTO `craft_matrixblocks` (`id`, `ownerId`, `fieldId`, `typeId`, `sortOrder`, `ownerLocale`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(6, 4, 6, 1, 1, NULL, '2017-11-14 15:36:44', '2017-11-24 16:40:43', '51ef8e89-4e2f-4ee5-9c14-975d40638db7'),
(24, 4, 6, 1, 2, NULL, '2017-11-15 11:35:24', '2017-11-24 16:40:43', '99afe332-f410-4d5d-a4a5-eb61376bc533'),
(25, 4, 6, 1, 3, NULL, '2017-11-15 11:35:24', '2017-11-24 16:40:43', '37e4e153-dca5-4795-be79-e3ce7f837129'),
(26, 4, 6, 1, 4, NULL, '2017-11-15 11:35:24', '2017-11-24 16:40:43', 'b4de5bb7-95f4-42c2-bbf0-212d02deb2a2'),
(29, 4, 6, 1, 5, NULL, '2017-11-15 12:55:19', '2017-11-24 16:40:43', '2cd042ba-131b-4b13-8299-799d6324bf34'),
(30, 4, 6, 1, 6, NULL, '2017-11-15 12:55:19', '2017-11-24 16:40:43', '12a9f216-c172-4a85-ad2a-b601ac968a2b'),
(75, 74, 10, 2, 1, NULL, '2017-11-15 15:38:01', '2017-11-15 15:45:57', '712feac8-03f7-41f2-adf7-a134e20e0c0d'),
(78, 74, 10, 2, 2, NULL, '2017-11-15 15:45:57', '2017-11-15 15:45:57', '2bde3393-501a-4e18-9f43-28b8faf5714f'),
(79, 74, 10, 2, 3, NULL, '2017-11-15 15:45:57', '2017-11-15 15:45:57', 'cf1fe094-38a4-4e21-8027-9f7250756cfa'),
(81, 80, 16, 5, 1, NULL, '2017-11-15 17:14:34', '2017-11-23 12:28:40', '87bf147b-2493-4aa8-910d-b449145e0ff9'),
(82, 80, 16, 5, 2, NULL, '2017-11-15 17:14:34', '2017-11-23 12:28:40', 'a22613b2-d2e2-43b4-8e79-a2f6b11e7aed'),
(83, 80, 16, 5, 3, NULL, '2017-11-15 17:14:34', '2017-11-23 12:28:40', '1b7aa0ef-7229-4145-bdf9-cbe21504db97'),
(90, 89, 25, 6, 1, NULL, '2017-11-17 14:38:14', '2017-11-23 12:39:53', '6a26f993-4e11-4901-9b57-55a0695eaaeb');

-- --------------------------------------------------------

--
-- Table structure for table `craft_matrixblocktypes`
--

CREATE TABLE `craft_matrixblocktypes` (
  `id` int(11) NOT NULL,
  `fieldId` int(11) NOT NULL,
  `fieldLayoutId` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `handle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sortOrder` smallint(6) UNSIGNED DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_matrixblocktypes`
--

INSERT INTO `craft_matrixblocktypes` (`id`, `fieldId`, `fieldLayoutId`, `name`, `handle`, `sortOrder`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 6, 78, 'imagineIfDataMatrix', 'imagineIfDataMatrix', 1, '2017-11-14 15:23:05', '2017-11-24 16:27:51', '6a783917-2fd5-4d0b-857c-719ea4b19131'),
(2, 10, 77, 'HWIdata', 'HWIdata', 1, '2017-11-15 15:26:17', '2017-11-24 16:27:29', '30910c7b-ee29-444a-a386-58cb0880e0d1'),
(5, 16, 67, 'WWU-entry', 'wwuEntry', 1, '2017-11-15 17:02:54', '2017-11-17 12:54:42', 'fc820f15-c6b6-4377-bf51-7cb9926524af'),
(6, 25, 73, 'Map Marker Data', 'mapMarkerData', 1, '2017-11-17 14:35:42', '2017-11-23 12:37:46', '2c80c455-96cd-46e4-81b3-f56d6861b2e6');

-- --------------------------------------------------------

--
-- Table structure for table `craft_matrixcontent_cudatamatrix`
--

CREATE TABLE `craft_matrixcontent_cudatamatrix` (
  `id` int(11) NOT NULL,
  `elementId` int(11) NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `field_mapMarkerData_markerTitle` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `field_mapMarkerData_address` text COLLATE utf8_unicode_ci,
  `field_mapMarkerData_googleMapsLink` text COLLATE utf8_unicode_ci,
  `field_mapMarkerData_telephoneNumber` text COLLATE utf8_unicode_ci,
  `field_mapMarkerData_contactEmailAddress` text COLLATE utf8_unicode_ci,
  `field_mapMarkerData_telephoneNumberAlternative` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_matrixcontent_cudatamatrix`
--

INSERT INTO `craft_matrixcontent_cudatamatrix` (`id`, `elementId`, `locale`, `field_mapMarkerData_markerTitle`, `field_mapMarkerData_address`, `field_mapMarkerData_googleMapsLink`, `field_mapMarkerData_telephoneNumber`, `field_mapMarkerData_contactEmailAddress`, `field_mapMarkerData_telephoneNumberAlternative`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 90, 'en_gb', 'Fantastec', '<p>Surrey Technology Centre</p>\n<p>40 Occam Road</p>\n<p>Guildford Surrey</p>\n<p>GU2 7YG</p>', 'https://www.google.com/maps/place/Surrey+Research+Park/@51.2396613,-0.6142707,17z/data=!4m5!3m4!1s0x0:0x632d0439c869347!8m2!3d51.2398362!4d-0.6120311', '+44 148 368 8309', 'hello@fantastec.io', '+44 148 368 8186', '2017-11-17 14:38:14', '2017-11-23 12:39:53', 'ca9397a9-89c9-4d8a-ac9a-c2bd98d399f0');

-- --------------------------------------------------------

--
-- Table structure for table `craft_matrixcontent_hwidatamatrix`
--

CREATE TABLE `craft_matrixcontent_hwidatamatrix` (
  `id` int(11) NOT NULL,
  `elementId` int(11) NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `field_HWIdata_subHeading` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `field_HWIdata_paragraph` text COLLATE utf8_unicode_ci,
  `field_HWIdata_backgroundPosition` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_matrixcontent_hwidatamatrix`
--

INSERT INTO `craft_matrixcontent_hwidatamatrix` (`id`, `elementId`, `locale`, `field_HWIdata_subHeading`, `field_HWIdata_paragraph`, `field_HWIdata_backgroundPosition`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 75, 'en_gb', 'create', 'We are a collective of data scientists, tech engineers and creative pioneers who have cultivated world class experience in sports. Our fan insights inspire technology led ideas brought to life through our products, platforms and service-led experiences.', NULL, '2017-11-15 15:38:01', '2017-11-15 15:45:57', '5a778daf-f751-437f-abf7-0192158e7bbf'),
(4, 78, 'en_gb', 'curate', 'We identify, incubate and accelerate technology based start-ups to create disruptive sport concepts for global sports fans.', NULL, '2017-11-15 15:45:57', '2017-11-15 15:45:57', '52fda3ef-eba6-40c8-9b5b-1425f1b6a139'),
(5, 79, 'en_gb', 'collaborate', 'With decades of sports marketing experience and envied connectivity in the sector, we work side-by-side with high profile sports leagues, teams and digital platforms to ensure the best exposure and access to our ideas by global fan communities.', NULL, '2017-11-15 15:45:57', '2017-11-15 15:45:57', '8cb5cc02-41be-4558-b848-79b3411b159f');

-- --------------------------------------------------------

--
-- Table structure for table `craft_matrixcontent_imagineif`
--

CREATE TABLE `craft_matrixcontent_imagineif` (
  `id` int(11) NOT NULL,
  `elementId` int(11) NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `field_imagineIfDataMatrix_titleContent` text COLLATE utf8_unicode_ci,
  `field_imagineIfDataMatrix_textContent` text COLLATE utf8_unicode_ci,
  `field_imagineIfDataMatrix_backgroundPosition` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_matrixcontent_imagineif`
--

INSERT INTO `craft_matrixcontent_imagineif` (`id`, `elementId`, `locale`, `field_imagineIfDataMatrix_titleContent`, `field_imagineIfDataMatrix_textContent`, `field_imagineIfDataMatrix_backgroundPosition`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 6, 'en_gb', 'Imagine if...', '<p>... A drone had sense and avoid technology that enabled it to safely zip between the cars on an F1 track, capturing the ultimate slow motion overtakes, without danger or distraction to the drivers.</p>', '50% center', '2017-11-14 15:36:44', '2017-11-24 16:40:43', 'cb3712b1-7d4d-4b65-8d50-aaf56e186ba8'),
(2, 24, 'en_gb', 'Imagine if...', '<p>... Football clubs used wearable tech to select its teams not only based on its players physical performance in training, but on their mental preparedness.</p>', ' 25% center', '2017-11-15 11:35:24', '2017-11-24 16:40:43', '7296ba9b-53d0-4ac9-8cfa-ddab0f27d32b'),
(3, 25, 'en_gb', 'Imagine if...', '<p>... An A.I. chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game, player or tournament you asked of it. Bet you’d have fun with that.</p>', '75% center', '2017-11-15 11:35:24', '2017-11-24 16:40:43', '3f9242d7-e790-48ec-b1c9-1877bedde34c'),
(4, 26, 'en_gb', 'Imagine if...', '<p>... Sports fans trusted their identity to the Blockchain, linked it to a cryptocurrency, and never had to show a ticket again to gain entry.</p>', '', '2017-11-15 11:35:24', '2017-11-24 16:40:43', 'fc379ceb-4af5-474b-b945-5c78459c57d2'),
(5, 29, 'en_gb', 'Imagine if...', '<p>... Live match feeds were not monopolised by big organisations, but shared by many in any language you want, at a price you can afford.</p>', '', '2017-11-15 12:55:19', '2017-11-24 16:40:43', '21540c19-b1eb-4723-ad8e-4c8c8a6f692e'),
(6, 30, 'en_gb', 'Imagine if...', '<p>... You could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive, your brain can’t tell what’s real.</p>', '', '2017-11-15 12:55:19', '2017-11-24 16:40:43', 'd57c3979-3098-49e8-9ef7-f160cdff76bb');

-- --------------------------------------------------------

--
-- Table structure for table `craft_matrixcontent_wwudatamatrix`
--

CREATE TABLE `craft_matrixcontent_wwudatamatrix` (
  `id` int(11) NOT NULL,
  `elementId` int(11) NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `field_wwuEntry_subHeading` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `field_wwuEntry_paragraph` text COLLATE utf8_unicode_ci,
  `field_wwuEntry_buttonText` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_matrixcontent_wwudatamatrix`
--

INSERT INTO `craft_matrixcontent_wwudatamatrix` (`id`, `elementId`, `locale`, `field_wwuEntry_subHeading`, `field_wwuEntry_paragraph`, `field_wwuEntry_buttonText`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 81, 'en_gb', 'Inspire', 'Do you have an idea, a vision or an aspiration you believe could revolutionise a sports experience for fans? Can you hook us in 50 words or less?', 'hello', '2017-11-15 17:14:34', '2017-11-23 12:28:40', '551dc73c-8cea-42ba-82c2-5190cbdded35'),
(2, 82, 'en_gb', 'Partner', 'Are you an established start-up or small business with a technology or proof of concept that could benefit sports fans?', 'Hello', '2017-11-15 17:14:34', '2017-11-23 12:28:40', 'd5ba1d26-0ef9-4f1a-9307-e0a1f7ba2d3b'),
(3, 83, 'en_gb', 'Join', 'Are you passionate about technology, sports, creativity and teamwork? We’re looking for people like you.', 'Hello', '2017-11-15 17:14:34', '2017-11-23 12:28:40', 'aaa9266b-0a03-4826-bbe7-34636c2e5d98');

-- --------------------------------------------------------

--
-- Table structure for table `craft_migrations`
--

CREATE TABLE `craft_migrations` (
  `id` int(11) NOT NULL,
  `pluginId` int(11) DEFAULT NULL,
  `version` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `applyTime` datetime NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_migrations`
--

INSERT INTO `craft_migrations` (`id`, `pluginId`, `version`, `applyTime`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, NULL, 'm000000_000000_base', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '3abe9b28-92f4-4ef5-a5b4-18adf8f7d305'),
(2, NULL, 'm140730_000001_add_filename_and_format_to_transformindex', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '60477d1b-0b34-4220-98ff-1e1a01c1ba67'),
(3, NULL, 'm140815_000001_add_format_to_transforms', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '97be20c2-d699-4236-bb95-c9af5edaf8ec'),
(4, NULL, 'm140822_000001_allow_more_than_128_items_per_field', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '5735c63a-ff6a-4f7f-b644-2ee478c26d99'),
(5, NULL, 'm140829_000001_single_title_formats', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '5af9c3e0-7bcd-403f-9d7d-1de52faa49b4'),
(6, NULL, 'm140831_000001_extended_cache_keys', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '16972fda-4f9d-437f-ad82-67df54f18ed0'),
(7, NULL, 'm140922_000001_delete_orphaned_matrix_blocks', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '8c77e05d-3aea-4aa4-b3af-2e1353553ca7'),
(8, NULL, 'm141008_000001_elements_index_tune', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '7eb23567-993c-4292-8044-37cdb3e5bd83'),
(9, NULL, 'm141009_000001_assets_source_handle', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '05f2b35e-5376-4fdf-90f3-ca9346b13993'),
(10, NULL, 'm141024_000001_field_layout_tabs', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '48ceecc8-be10-4b4a-abb9-d89ec0783117'),
(11, NULL, 'm141030_000000_plugin_schema_versions', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '9179b3a5-3b99-4e86-bd28-b560a5cac519'),
(12, NULL, 'm141030_000001_drop_structure_move_permission', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '9d204bf0-4651-47ac-97e0-879fc1ad67b1'),
(13, NULL, 'm141103_000001_tag_titles', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'c2ac54b2-1bf8-49bf-b24e-06784f14e753'),
(14, NULL, 'm141109_000001_user_status_shuffle', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '338d1384-b818-47c0-aedc-54ad0a81ab48'),
(15, NULL, 'm141126_000001_user_week_start_day', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'f96f226f-7f91-4168-a01f-1e637665259c'),
(16, NULL, 'm150210_000001_adjust_user_photo_size', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '8267283c-4f30-4ac6-bfb2-5b88cbdf4c17'),
(17, NULL, 'm150724_000001_adjust_quality_settings', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '604ebfd9-ce92-4b2d-a5ca-cda89d37bb8c'),
(18, NULL, 'm150827_000000_element_index_settings', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '4d756ad9-db9b-4298-8458-31a3cf904648'),
(19, NULL, 'm150918_000001_add_colspan_to_widgets', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '30952dd3-a4dd-4142-bc15-04cb2ffcbc39'),
(20, NULL, 'm151007_000000_clear_asset_caches', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'c3428b1d-f6cb-497a-9d19-498c0764f8a5'),
(21, NULL, 'm151109_000000_text_url_formats', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'd87b5640-7675-4c85-8869-ebb7af57b25f'),
(22, NULL, 'm151110_000000_move_logo', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '15a3ca7f-4bde-4604-83f5-74b5d3c8c894'),
(23, NULL, 'm151117_000000_adjust_image_widthheight', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '328db416-99c7-4d51-85b8-ec4091a3ec82'),
(24, NULL, 'm151127_000000_clear_license_key_status', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'a82b68f9-b3dd-4a2b-8cf2-9a9a02e75205'),
(25, NULL, 'm151127_000000_plugin_license_keys', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'a088c052-f007-48df-87b3-8e36e5dd1691'),
(26, NULL, 'm151130_000000_update_pt_widget_feeds', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'b821fff6-443f-4c32-9d5c-6bb94ff592d4'),
(27, NULL, 'm160114_000000_asset_sources_public_url_default_true', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'd09c899a-7c18-4d56-b335-f85060ae4193'),
(28, NULL, 'm160223_000000_sortorder_to_smallint', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'f7318553-cd22-49e2-a6e7-ca6df4da9649'),
(29, NULL, 'm160229_000000_set_default_entry_statuses', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '4f148432-d173-401d-bc04-3625eb4d2b62'),
(30, NULL, 'm160304_000000_client_permissions', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '5e20c41f-2355-4a46-943a-dd7853c42f9e'),
(31, NULL, 'm160322_000000_asset_filesize', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'b591c0df-529e-48da-9f75-e6d866f20bfb'),
(32, NULL, 'm160503_000000_orphaned_fieldlayouts', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '59d35d35-3b4c-420d-a08d-906ce1c6af5b'),
(33, NULL, 'm160510_000000_tasksettings', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', 'c5ff96b2-9fb8-4810-905e-be9e43db2591'),
(34, NULL, 'm160829_000000_pending_user_content_cleanup', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '4cf5a3ed-827d-4bc9-91cd-01fa2fe2c875'),
(35, NULL, 'm160830_000000_asset_index_uri_increase', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '824c74e1-f247-47ec-937b-8d75e801ce31'),
(36, NULL, 'm160919_000000_usergroup_handle_title_unique', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2b2701df-0031-4957-9784-c7d66349b2ae'),
(37, NULL, 'm161108_000000_new_version_format', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '68324a5c-6299-4482-84fb-106fdfb84dc4'),
(38, NULL, 'm161109_000000_index_shuffle', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '089029b9-9837-42ff-8864-7ab9ca8887f2'),
(39, NULL, 'm170612_000000_route_index_shuffle', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '41d76df8-ec95-42de-9e50-219d21ab78f4'),
(40, NULL, 'm171107_000000_assign_group_permissions', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '2017-11-14 10:47:49', '12d53195-576d-4c8b-abd0-b18a652ba313'),
(49, 3, 'm151225_000000_seomatic_addHumansField', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', 'f18e2346-7f5d-476d-9fb4-fea042a77892'),
(50, 3, 'm151226_000000_seomatic_addTwitterFacebookFields', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', 'cddd6081-b7cb-4cae-9919-d169281a7d40'),
(51, 3, 'm160101_000000_seomatic_addRobotsFields', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', 'f9674204-55ba-441b-890e-2b3532d580bd'),
(52, 3, 'm160111_000000_seomatic_addTitleFields', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', 'd6e85f7b-7892-42e4-93d2-33f496c46be3'),
(53, 3, 'm160122_000000_seomatic_addTypeFields', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', 'eac2d410-a427-4071-be21-f6ee1a3eb2d4'),
(54, 3, 'm160123_000000_seomatic_addOpeningHours', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', 'b0890f1c-75be-4d8f-85f1-9c9eced6839c'),
(55, 3, 'm160202_000000_seomatic_addSocialHandles', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '3a412a98-6834-4b5f-ab56-b7a9225078fb'),
(56, 3, 'm160204_000000_seomatic_addGoogleAnalytics', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '81f8231f-2ef8-4f82-96af-1de476395afa'),
(57, 3, 'm160205_000000_seomatic_addResturantMenu', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '40009915-43e5-4d88-992e-fa90e0d42e4f'),
(58, 3, 'm160206_000000_seomatic_addGoogleAnalyticsPlugins', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '68a3489d-d231-45d8-802e-1684403ebabe'),
(59, 3, 'm160206_000000_seomatic_addGoogleAnalyticsSendPageView', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '5dc2adbc-660d-4594-8e15-557d83680d9e'),
(60, 3, 'm160209_000000_seomatic_alterDescriptionsColumns', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '8c32ee52-1eef-4608-8c97-6570df76ac83'),
(61, 3, 'm160209_000001_seomatic_addRobotsTxt', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2ccf2abd-c8e6-4c97-b9da-3b2c3e5a59f2'),
(62, 3, 'm160227_000000_seomatic_addFacebookAppId', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '3a42b359-fd28-4976-9061-bec65454cb54'),
(63, 3, 'm160416_000000_seomatic_addContactPoints', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '934f9a36-10fe-4f39-9ac8-a9010eeed2fa'),
(64, 3, 'm160509_000000_seomatic_addSiteLinksBing', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', 'e93d1c5d-9a69-48da-9232-f3ab15f9d364'),
(65, 3, 'm160707_000000_seomatic_addGoogleTagManager', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '19cc4e09-fcd3-472b-ab4d-6d26b1a979df'),
(66, 3, 'm160715_000000_seomatic_addSeoImageTransforms', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '174b7da9-b51c-4cd4-a628-ffbd431e6363'),
(67, 3, 'm160723_000000_seomatic_addSeoMainEntityOfPage', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '90817404-484c-41fd-8cd0-f010512b7e19'),
(68, 3, 'm160724_000000_seomatic_addSeoMainEntityCategory', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '12e83c56-d5ed-4a0a-9b94-ce9ea47507c9'),
(69, 3, 'm160811_000000_seomatic_addVimeo', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', 'f56b0763-bde2-4b28-b0ec-a5248b7b64b5'),
(70, 3, 'm160904_000000_seomatic_addTwitterFacebookImages', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '41178583-affa-4a28-82b3-ccca3e579b52'),
(71, 3, 'm161220_000000_seomatic_addPriceRange', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '6e31c391-21d3-4315-b544-49aaaec680cf'),
(72, 3, 'm170212_000000_seomatic_addGoogleAnalyticsAnonymizeIp', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '68da1b65-eca3-4132-b7bc-000b78f58c94'),
(73, 3, 'm170212_000000_seomatic_addWikipedia', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-11-20 11:31:41', '41723108-737c-4b06-9e3b-7c0618bc1f38'),
(82, 5, 'm130715_191457_oauth_addUserMappingField', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '4cfefdaf-d37b-4bb9-83df-18a5466f4328'),
(83, 5, 'm130907_140340_oauth_renameOauth_providersProviderClassToClass', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '8005f121-8408-42ae-b803-2a292562f2de'),
(84, 5, 'm130912_153247_oauth_createTokenIndexes', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '334d0ac6-4aa9-49c1-856d-152a30fc8d87'),
(85, 5, 'm140417_000003_changeTokenUniqueIndexes', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '017dfd83-8705-4f5b-8658-4f871705b9b7'),
(86, 5, 'm140623_130304_oauth_new_tokens_table', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '7e5bf7c6-84dc-4f20-816d-a69e0a282c0f'),
(87, 5, 'm150112_220705_oauth_add_token_columns', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '4a923bae-ff4d-4555-860d-b88917a136fa'),
(88, 5, 'm150311_000001_oauth_remove_old_tokens', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '237abc2c-e378-4ff1-b49b-39ded7583c44'),
(89, 5, 'm161025_000001_oauth_change_tokens_column_types', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '2017-11-20 14:34:04', '51772bdb-f312-4508-a1cb-1b6e8e3fbf51'),
(90, 8, 'm150314_144609_cpNav_addUrlSupport', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '14b1501e-d2c5-4160-819e-9cc92d835a8d'),
(91, 8, 'm150314_144610_cpNav_addPrevUrlSupport', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '2017-11-20 17:21:51', 'a143e624-1a45-4768-8d85-27eb8d8ab9b9'),
(92, 8, 'm150314_144611_cpNav_addManualNavItemSupport', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '2017-11-20 17:21:51', 'f711b2a2-b227-4d10-9a88-e7fb008b529e'),
(93, 8, 'm150314_144615_cpNav_layouts', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '89fb4c6a-d6f0-47a1-a6a5-24276ff0b6d3'),
(94, 8, 'm150321_144616_cpNav_newWindow', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '2017-11-20 17:21:51', 'd08eca26-bcc4-457f-8e58-3bdd9404d597'),
(95, 8, 'm151126_144611_cpNav_addIconSupport', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '3dba9f78-8203-45ec-adb0-b2a35e4996e9'),
(96, 8, 'm151224_144611_cpNav_populateIcons', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '742fe9df-25c0-4930-939a-d49801db43ba'),
(97, 8, 'm160625_000000_cpNav_addCustomIconSupport', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '2017-11-20 17:21:51', '527d2305-b03a-40ca-9862-c4db5b6c648a');

-- --------------------------------------------------------

--
-- Table structure for table `craft_oauth_providers`
--

CREATE TABLE `craft_oauth_providers` (
  `id` int(11) NOT NULL,
  `class` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `clientId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `clientSecret` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_oauth_providers`
--

INSERT INTO `craft_oauth_providers` (`id`, `class`, `clientId`, `clientSecret`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 'twitter', '5EFbXCutkD9izHuTB3youAGuq', 'KKaN5muUVmphixEhGeF2zXRbnAOavVqfJpLscCfP4DCL64Azs9', '2017-11-20 14:35:43', '2017-11-20 14:35:43', '5edb3f01-e87e-493a-a5eb-25c7faccd066');

-- --------------------------------------------------------

--
-- Table structure for table `craft_oauth_tokens`
--

CREATE TABLE `craft_oauth_tokens` (
  `id` int(11) NOT NULL,
  `providerHandle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pluginHandle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `accessToken` text COLLATE utf8_unicode_ci,
  `secret` text COLLATE utf8_unicode_ci,
  `endOfLife` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `refreshToken` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_oauth_tokens`
--

INSERT INTO `craft_oauth_tokens` (`id`, `providerHandle`, `pluginHandle`, `accessToken`, `secret`, `endOfLife`, `refreshToken`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 'twitter', 'twitter', '900023014695239681-uZAuBgCmtvUB9TG8PAtamJWHZCLqilN', 'IQXl44pIuBYCPQQ9vRIM2tfkvxuZSQTuVRESDp7pd8O6p', NULL, NULL, '2017-11-20 14:40:34', '2017-11-20 14:40:34', '9a905980-e4c3-4e63-8d31-2484f42d45d8');

-- --------------------------------------------------------

--
-- Table structure for table `craft_plugins`
--

CREATE TABLE `craft_plugins` (
  `id` int(11) NOT NULL,
  `class` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `version` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `schemaVersion` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `licenseKey` char(24) COLLATE utf8_unicode_ci DEFAULT NULL,
  `licenseKeyStatus` enum('valid','invalid','mismatched','unknown') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'unknown',
  `enabled` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `settings` text COLLATE utf8_unicode_ci,
  `installDate` datetime NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_plugins`
--

INSERT INTO `craft_plugins` (`id`, `class`, `version`, `schemaVersion`, `licenseKey`, `licenseKeyStatus`, `enabled`, `settings`, `installDate`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(3, 'Seomatic', '1.1.56', '1.1.25', NULL, 'unknown', 1, NULL, '2017-11-20 11:31:41', '2017-11-20 11:31:41', '2017-12-04 15:49:32', 'acb184d0-4645-487c-ab7a-b889cf00a769'),
(5, 'Oauth', '2.1.1', '1.0.1', NULL, 'unknown', 1, NULL, '2017-11-20 14:34:04', '2017-11-20 14:34:04', '2017-12-04 15:49:32', '8daeb44b-f9e2-4558-a344-5964df16c23f'),
(6, 'Twitter', '1.1.3', '1.0.0', NULL, 'unknown', 1, '{\"tokenId\":\"1\"}', '2017-11-20 14:34:34', '2017-11-20 14:34:34', '2017-12-04 15:49:32', '4124e81c-8a4e-4672-b6ac-97c437ea279e'),
(7, 'TweetLinker', '0.1', NULL, NULL, 'unknown', 1, NULL, '2017-11-20 16:31:02', '2017-11-20 16:31:02', '2017-12-04 15:49:32', 'd6396594-5bf3-4782-a66f-8fce4e05935e'),
(8, 'CpNav', '1.7.8', '1.1.0', NULL, 'unknown', 1, NULL, '2017-11-20 17:21:51', '2017-11-20 17:21:51', '2017-12-04 15:49:32', '1a851128-4990-4f15-b2fc-3e512a8d15ae');

-- --------------------------------------------------------

--
-- Table structure for table `craft_rackspaceaccess`
--

CREATE TABLE `craft_rackspaceaccess` (
  `id` int(11) NOT NULL,
  `connectionKey` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `storageUrl` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `cdnUrl` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_relations`
--

CREATE TABLE `craft_relations` (
  `id` int(11) NOT NULL,
  `fieldId` int(11) NOT NULL,
  `sourceId` int(11) NOT NULL,
  `sourceLocale` char(12) COLLATE utf8_unicode_ci DEFAULT NULL,
  `targetId` int(11) NOT NULL,
  `sortOrder` smallint(6) DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_relations`
--

INSERT INTO `craft_relations` (`id`, `fieldId`, `sourceId`, `sourceLocale`, `targetId`, `sortOrder`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(40, 15, 75, NULL, 58, 1, '2017-11-15 15:45:57', '2017-11-15 15:45:57', '702fe5ca-5a8a-4de0-90e3-5dd7cfe17e91'),
(41, 15, 78, NULL, 59, 1, '2017-11-15 15:45:57', '2017-11-15 15:45:57', '71e026ca-0b3a-42fd-8f0c-ae20339df21b'),
(42, 15, 79, NULL, 60, 1, '2017-11-15 15:45:57', '2017-11-15 15:45:57', '3732a928-a893-43a6-8cf9-3c2194067488'),
(66, 23, 88, NULL, 87, 1, '2017-11-20 12:03:28', '2017-11-20 12:03:28', 'f282b37f-182a-4c64-b7f9-b97dc497e4c7'),
(67, 19, 81, NULL, 71, 1, '2017-11-23 12:28:40', '2017-11-23 12:28:40', 'dfbf49d9-e75e-4640-a396-83a25e035271'),
(68, 19, 82, NULL, 72, 1, '2017-11-23 12:28:40', '2017-11-23 12:28:40', '4843fced-7462-4373-8cfc-279047b8fb28'),
(69, 19, 83, NULL, 73, 1, '2017-11-23 12:28:40', '2017-11-23 12:28:40', 'a170028d-ac15-4825-af6a-f571e1ef3ec1'),
(76, 22, 84, NULL, 31, 1, '2017-11-23 12:33:34', '2017-11-23 12:33:34', 'd73fb260-311e-454c-8220-92ecdb5ab52b'),
(77, 22, 84, NULL, 33, 2, '2017-11-23 12:33:34', '2017-11-23 12:33:34', '3f320b66-6f17-4117-9f4a-c5c4a00c97b6'),
(78, 22, 84, NULL, 32, 3, '2017-11-23 12:33:34', '2017-11-23 12:33:34', 'ceb5e599-0a14-4232-961d-4efb1fd02d7f'),
(127, 9, 6, NULL, 20, 1, '2017-11-24 16:40:43', '2017-11-24 16:40:43', '8ed309a9-04c1-402b-a293-3db0d788512a'),
(128, 9, 24, NULL, 21, 1, '2017-11-24 16:40:43', '2017-11-24 16:40:43', 'a3ac620a-bf81-459f-a37f-034d56655c07'),
(129, 9, 25, NULL, 19, 1, '2017-11-24 16:40:43', '2017-11-24 16:40:43', 'ddf29107-3d63-47ca-998d-c96e6215e6ea'),
(130, 9, 26, NULL, 23, 1, '2017-11-24 16:40:43', '2017-11-24 16:40:43', '840b007d-7902-48a5-b9c9-67297e604547'),
(131, 9, 29, NULL, 27, 1, '2017-11-24 16:40:43', '2017-11-24 16:40:43', '3bb2728c-df2f-4c27-9b3c-a4a86bf8dd4f'),
(132, 9, 30, NULL, 28, 1, '2017-11-24 16:40:43', '2017-11-24 16:40:43', '8d649075-6bb6-4597-9652-f2a215c0d3ee');

-- --------------------------------------------------------

--
-- Table structure for table `craft_routes`
--

CREATE TABLE `craft_routes` (
  `id` int(11) NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci DEFAULT NULL,
  `urlParts` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `urlPattern` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `template` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sortOrder` smallint(6) UNSIGNED DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_searchindex`
--

CREATE TABLE `craft_searchindex` (
  `elementId` int(11) NOT NULL,
  `attribute` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `fieldId` int(11) NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `keywords` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_searchindex`
--

INSERT INTO `craft_searchindex` (`elementId`, `attribute`, `fieldId`, `locale`, `keywords`) VALUES
(1, 'username', 0, 'en_gb', ' damian w interstateteam com '),
(1, 'firstname', 0, 'en_gb', ''),
(1, 'lastname', 0, 'en_gb', ''),
(1, 'fullname', 0, 'en_gb', ''),
(1, 'email', 0, 'en_gb', ' damian w interstateteam com '),
(1, 'slug', 0, 'en_gb', ''),
(89, 'slug', 0, 'en_gb', ' contact us '),
(88, 'title', 0, 'en_gb', ' home '),
(88, 'field', 23, 'en_gb', ' landing video '),
(87, 'extension', 0, 'en_gb', ' mp4 '),
(87, 'filename', 0, 'en_gb', ' landingvideo mp4 '),
(87, 'kind', 0, 'en_gb', ' video '),
(87, 'slug', 0, 'en_gb', ' landing video '),
(87, 'title', 0, 'en_gb', ' landing video '),
(88, 'slug', 0, 'en_gb', ' home video '),
(74, 'slug', 0, 'en_gb', ' how we innovate '),
(74, 'title', 0, 'en_gb', ' how we innovate '),
(75, 'field', 11, 'en_gb', ' create '),
(75, 'slug', 0, 'en_gb', ''),
(74, 'field', 10, 'en_gb', ' 2 01 we are a collective of data scientists tech engineers and creative pioneers who have cultivated world class experience in sports our fan insights inspire technology led ideas brought to life through our products platforms and service led experiences create 2 02 we identify incubate and accelerate technology based start ups to create disruptive sport concepts for global sports fans curate 2 03 with decades of sports marketing experience and envied connectivity in the sector we work side by side with high profile sports leagues teams and digital platforms to ensure the best exposure and access to our ideas by global fan communities collaborate '),
(4, 'slug', 0, 'en_gb', ' imagine if '),
(4, 'title', 0, 'en_gb', ' imagine if '),
(4, 'field', 6, 'en_gb', ' 3 01 50% center a drone had sense and avoid technology that enabled it to safely zip between the cars on an f1 track capturing the ultimate slow motion overtakes without danger or distraction to the drivers imagine if 3 02 25% center football clubs used wearable tech to select its teams not only based on its players physical performance in training but on their mental preparedness imagine if 3 03 75% center an a i chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game player or tournament you asked of it bet you d have fun with that imagine if 3 04 sports fans trusted their identity to the blockchain linked it to a cryptocurrency and never had to show a ticket again to gain entry imagine if 3 05 live match feeds were not monopolised by big organisations but shared by many in any language you want at a price you can afford imagine if 3 06 you could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive your brain can t tell what s real imagine if '),
(6, 'field', 7, 'en_gb', ' imagine if '),
(6, 'field', 8, 'en_gb', ' a drone had sense and avoid technology that enabled it to safely zip between the cars on an f1 track capturing the ultimate slow motion overtakes without danger or distraction to the drivers '),
(6, 'field', 9, 'en_gb', ' 3 01 '),
(6, 'slug', 0, 'en_gb', ''),
(23, 'extension', 0, 'en_gb', ' jpg '),
(23, 'kind', 0, 'en_gb', ' image '),
(23, 'filename', 0, 'en_gb', ' 3 04 jpg '),
(21, 'title', 0, 'en_gb', ' 3 02 '),
(21, 'slug', 0, 'en_gb', ' 3 02 '),
(21, 'extension', 0, 'en_gb', ' jpg '),
(21, 'kind', 0, 'en_gb', ' image '),
(20, 'kind', 0, 'en_gb', ' image '),
(20, 'slug', 0, 'en_gb', ' 3 01 '),
(20, 'title', 0, 'en_gb', ' 3 01 '),
(21, 'filename', 0, 'en_gb', ' 3 02 jpg '),
(20, 'extension', 0, 'en_gb', ' jpg '),
(19, 'title', 0, 'en_gb', ' 3 03 '),
(19, 'slug', 0, 'en_gb', ' 3 03 '),
(19, 'kind', 0, 'en_gb', ' image '),
(19, 'extension', 0, 'en_gb', ' jpg '),
(19, 'filename', 0, 'en_gb', ' 3 03 jpg '),
(20, 'filename', 0, 'en_gb', ' 3 01 jpg '),
(23, 'slug', 0, 'en_gb', ' 3 04 '),
(23, 'title', 0, 'en_gb', ' 3 04 '),
(24, 'field', 7, 'en_gb', ' imagine if '),
(24, 'field', 8, 'en_gb', ' football clubs used wearable tech to select its teams not only based on its players physical performance in training but on their mental preparedness '),
(24, 'field', 9, 'en_gb', ' 3 02 '),
(24, 'slug', 0, 'en_gb', ''),
(25, 'field', 7, 'en_gb', ' imagine if '),
(25, 'field', 8, 'en_gb', ' an a i chatbot whose deep learning was so in touch with sport that it could serve up a series of informed opinions about any game player or tournament you asked of it bet you d have fun with that '),
(25, 'field', 9, 'en_gb', ' 3 03 '),
(25, 'slug', 0, 'en_gb', ''),
(26, 'field', 7, 'en_gb', ' imagine if '),
(26, 'field', 8, 'en_gb', ' sports fans trusted their identity to the blockchain linked it to a cryptocurrency and never had to show a ticket again to gain entry '),
(26, 'field', 9, 'en_gb', ' 3 04 '),
(26, 'slug', 0, 'en_gb', ''),
(27, 'filename', 0, 'en_gb', ' 3 05 jpg '),
(27, 'extension', 0, 'en_gb', ' jpg '),
(27, 'kind', 0, 'en_gb', ' image '),
(27, 'slug', 0, 'en_gb', ' 3 05 '),
(27, 'title', 0, 'en_gb', ' 3 05 '),
(28, 'filename', 0, 'en_gb', ' 3 06 jpg '),
(28, 'extension', 0, 'en_gb', ' jpg '),
(28, 'kind', 0, 'en_gb', ' image '),
(28, 'slug', 0, 'en_gb', ' 3 06 '),
(28, 'title', 0, 'en_gb', ' 3 06 '),
(29, 'field', 7, 'en_gb', ' imagine if '),
(29, 'field', 8, 'en_gb', ' live match feeds were not monopolised by big organisations but shared by many in any language you want at a price you can afford '),
(29, 'field', 9, 'en_gb', ' 3 05 '),
(29, 'slug', 0, 'en_gb', ''),
(30, 'field', 7, 'en_gb', ' imagine if '),
(30, 'field', 8, 'en_gb', ' you could be transported to an iconic moment in sport history and experience the action play out around you in a virtual world so immersive your brain can t tell what s real '),
(30, 'field', 9, 'en_gb', ' 3 06 '),
(30, 'slug', 0, 'en_gb', ''),
(31, 'filename', 0, 'en_gb', ' 1 01 jpg '),
(31, 'extension', 0, 'en_gb', ' jpg '),
(31, 'kind', 0, 'en_gb', ' image '),
(31, 'slug', 0, 'en_gb', ' 1 01 '),
(31, 'title', 0, 'en_gb', ' 1 01 '),
(32, 'filename', 0, 'en_gb', ' 1 03 jpg '),
(32, 'extension', 0, 'en_gb', ' jpg '),
(32, 'kind', 0, 'en_gb', ' image '),
(32, 'slug', 0, 'en_gb', ' 1 03 '),
(32, 'title', 0, 'en_gb', ' 1 03 '),
(33, 'filename', 0, 'en_gb', ' 1 02 jpg '),
(33, 'extension', 0, 'en_gb', ' jpg '),
(33, 'kind', 0, 'en_gb', ' image '),
(33, 'slug', 0, 'en_gb', ' 1 02 '),
(33, 'title', 0, 'en_gb', ' 1 02 '),
(34, 'filename', 0, 'en_gb', ' android icon 144x144 png '),
(34, 'extension', 0, 'en_gb', ' png '),
(34, 'kind', 0, 'en_gb', ' image '),
(34, 'slug', 0, 'en_gb', ' android icon 144x144 '),
(34, 'title', 0, 'en_gb', ' android icon 144x144 '),
(35, 'filename', 0, 'en_gb', ' android icon 192x192 png '),
(35, 'extension', 0, 'en_gb', ' png '),
(35, 'kind', 0, 'en_gb', ' image '),
(35, 'slug', 0, 'en_gb', ' android icon 192x192 '),
(35, 'title', 0, 'en_gb', ' android icon 192x192 '),
(36, 'filename', 0, 'en_gb', ' android icon 36x36 png '),
(36, 'extension', 0, 'en_gb', ' png '),
(36, 'kind', 0, 'en_gb', ' image '),
(36, 'slug', 0, 'en_gb', ' android icon 36x36 '),
(36, 'title', 0, 'en_gb', ' android icon 36x36 '),
(37, 'filename', 0, 'en_gb', ' android icon 48x48 png '),
(37, 'extension', 0, 'en_gb', ' png '),
(37, 'kind', 0, 'en_gb', ' image '),
(37, 'slug', 0, 'en_gb', ' android icon 48x48 '),
(37, 'title', 0, 'en_gb', ' android icon 48x48 '),
(38, 'filename', 0, 'en_gb', ' android icon 72x72 png '),
(38, 'extension', 0, 'en_gb', ' png '),
(38, 'kind', 0, 'en_gb', ' image '),
(38, 'slug', 0, 'en_gb', ' android icon 72x72 '),
(38, 'title', 0, 'en_gb', ' android icon 72x72 '),
(39, 'filename', 0, 'en_gb', ' android icon 96x96 png '),
(39, 'extension', 0, 'en_gb', ' png '),
(39, 'kind', 0, 'en_gb', ' image '),
(39, 'slug', 0, 'en_gb', ' android icon 96x96 '),
(39, 'title', 0, 'en_gb', ' android icon 96x96 '),
(40, 'filename', 0, 'en_gb', ' apple icon 114x114 png '),
(40, 'extension', 0, 'en_gb', ' png '),
(40, 'kind', 0, 'en_gb', ' image '),
(40, 'slug', 0, 'en_gb', ' apple icon 114x114 '),
(40, 'title', 0, 'en_gb', ' apple icon 114x114 '),
(41, 'filename', 0, 'en_gb', ' apple icon 120x120 png '),
(41, 'extension', 0, 'en_gb', ' png '),
(41, 'kind', 0, 'en_gb', ' image '),
(41, 'slug', 0, 'en_gb', ' apple icon 120x120 '),
(41, 'title', 0, 'en_gb', ' apple icon 120x120 '),
(42, 'filename', 0, 'en_gb', ' apple icon 144x144 png '),
(42, 'extension', 0, 'en_gb', ' png '),
(42, 'kind', 0, 'en_gb', ' image '),
(42, 'slug', 0, 'en_gb', ' apple icon 144x144 '),
(42, 'title', 0, 'en_gb', ' apple icon 144x144 '),
(43, 'filename', 0, 'en_gb', ' apple icon 152x152 png '),
(43, 'extension', 0, 'en_gb', ' png '),
(43, 'kind', 0, 'en_gb', ' image '),
(43, 'slug', 0, 'en_gb', ' apple icon 152x152 '),
(43, 'title', 0, 'en_gb', ' apple icon 152x152 '),
(44, 'filename', 0, 'en_gb', ' apple icon 180x180 png '),
(44, 'extension', 0, 'en_gb', ' png '),
(44, 'kind', 0, 'en_gb', ' image '),
(44, 'slug', 0, 'en_gb', ' apple icon 180x180 '),
(44, 'title', 0, 'en_gb', ' apple icon 180x180 '),
(45, 'filename', 0, 'en_gb', ' apple icon 57x57 png '),
(45, 'extension', 0, 'en_gb', ' png '),
(45, 'kind', 0, 'en_gb', ' image '),
(45, 'slug', 0, 'en_gb', ' apple icon 57x57 '),
(45, 'title', 0, 'en_gb', ' apple icon 57x57 '),
(46, 'filename', 0, 'en_gb', ' apple icon 60x60 png '),
(46, 'extension', 0, 'en_gb', ' png '),
(46, 'kind', 0, 'en_gb', ' image '),
(46, 'slug', 0, 'en_gb', ' apple icon 60x60 '),
(46, 'title', 0, 'en_gb', ' apple icon 60x60 '),
(47, 'filename', 0, 'en_gb', ' apple icon 72x72 png '),
(47, 'extension', 0, 'en_gb', ' png '),
(47, 'kind', 0, 'en_gb', ' image '),
(47, 'slug', 0, 'en_gb', ' apple icon 72x72 '),
(47, 'title', 0, 'en_gb', ' apple icon 72x72 '),
(48, 'filename', 0, 'en_gb', ' apple icon 76x76 png '),
(48, 'extension', 0, 'en_gb', ' png '),
(48, 'kind', 0, 'en_gb', ' image '),
(48, 'slug', 0, 'en_gb', ' apple icon 76x76 '),
(48, 'title', 0, 'en_gb', ' apple icon 76x76 '),
(49, 'filename', 0, 'en_gb', ' apple icon precomposed png '),
(49, 'extension', 0, 'en_gb', ' png '),
(49, 'kind', 0, 'en_gb', ' image '),
(49, 'slug', 0, 'en_gb', ' apple icon precomposed '),
(49, 'title', 0, 'en_gb', ' apple icon precomposed '),
(50, 'filename', 0, 'en_gb', ' apple icon png '),
(50, 'extension', 0, 'en_gb', ' png '),
(50, 'kind', 0, 'en_gb', ' image '),
(50, 'slug', 0, 'en_gb', ' apple icon '),
(50, 'title', 0, 'en_gb', ' apple icon '),
(51, 'filename', 0, 'en_gb', ' downarrow svg '),
(51, 'extension', 0, 'en_gb', ' svg '),
(51, 'kind', 0, 'en_gb', ' image '),
(51, 'slug', 0, 'en_gb', ' down arrow '),
(51, 'title', 0, 'en_gb', ' down arrow '),
(52, 'filename', 0, 'en_gb', ' email_logo png '),
(52, 'extension', 0, 'en_gb', ' png '),
(52, 'kind', 0, 'en_gb', ' image '),
(52, 'slug', 0, 'en_gb', ' email logo '),
(52, 'title', 0, 'en_gb', ' email logo '),
(53, 'filename', 0, 'en_gb', ' email_simon png '),
(53, 'extension', 0, 'en_gb', ' png '),
(53, 'kind', 0, 'en_gb', ' image '),
(53, 'slug', 0, 'en_gb', ' email simon '),
(53, 'title', 0, 'en_gb', ' email simon '),
(54, 'filename', 0, 'en_gb', ' email_steve png '),
(54, 'extension', 0, 'en_gb', ' png '),
(54, 'kind', 0, 'en_gb', ' image '),
(54, 'slug', 0, 'en_gb', ' email steve '),
(54, 'title', 0, 'en_gb', ' email steve '),
(55, 'filename', 0, 'en_gb', ' favicon 16x16 png '),
(55, 'extension', 0, 'en_gb', ' png '),
(55, 'kind', 0, 'en_gb', ' image '),
(55, 'slug', 0, 'en_gb', ' favicon 16x16 '),
(55, 'title', 0, 'en_gb', ' favicon 16x16 '),
(56, 'filename', 0, 'en_gb', ' favicon 32x32 png '),
(56, 'extension', 0, 'en_gb', ' png '),
(56, 'kind', 0, 'en_gb', ' image '),
(56, 'slug', 0, 'en_gb', ' favicon 32x32 '),
(56, 'title', 0, 'en_gb', ' favicon 32x32 '),
(57, 'filename', 0, 'en_gb', ' favicon 96x96 png '),
(57, 'extension', 0, 'en_gb', ' png '),
(57, 'kind', 0, 'en_gb', ' image '),
(57, 'slug', 0, 'en_gb', ' favicon 96x96 '),
(57, 'title', 0, 'en_gb', ' favicon 96x96 '),
(58, 'filename', 0, 'en_gb', ' 2 01 jpg '),
(58, 'extension', 0, 'en_gb', ' jpg '),
(58, 'kind', 0, 'en_gb', ' image '),
(58, 'slug', 0, 'en_gb', ' 2 01 '),
(58, 'title', 0, 'en_gb', ' 2 01 '),
(59, 'filename', 0, 'en_gb', ' 2 02 jpg '),
(59, 'extension', 0, 'en_gb', ' jpg '),
(59, 'kind', 0, 'en_gb', ' image '),
(59, 'slug', 0, 'en_gb', ' 2 02 '),
(59, 'title', 0, 'en_gb', ' 2 02 '),
(60, 'filename', 0, 'en_gb', ' 2 03 jpg '),
(60, 'extension', 0, 'en_gb', ' jpg '),
(60, 'kind', 0, 'en_gb', ' image '),
(60, 'slug', 0, 'en_gb', ' 2 03 '),
(60, 'title', 0, 'en_gb', ' 2 03 '),
(61, 'filename', 0, 'en_gb', ' instagram svg '),
(61, 'extension', 0, 'en_gb', ' svg '),
(61, 'kind', 0, 'en_gb', ' image '),
(61, 'slug', 0, 'en_gb', ' instagram '),
(61, 'title', 0, 'en_gb', ' instagram '),
(62, 'filename', 0, 'en_gb', ' linkedin svg '),
(62, 'extension', 0, 'en_gb', ' svg '),
(62, 'kind', 0, 'en_gb', ' image '),
(62, 'slug', 0, 'en_gb', ' linked in '),
(62, 'title', 0, 'en_gb', ' linked in '),
(63, 'filename', 0, 'en_gb', ' loading gif '),
(63, 'extension', 0, 'en_gb', ' gif '),
(63, 'kind', 0, 'en_gb', ' image '),
(63, 'slug', 0, 'en_gb', ' loading '),
(63, 'title', 0, 'en_gb', ' loading '),
(64, 'filename', 0, 'en_gb', ' logo svg '),
(64, 'extension', 0, 'en_gb', ' svg '),
(64, 'kind', 0, 'en_gb', ' image '),
(64, 'slug', 0, 'en_gb', ' logo '),
(64, 'title', 0, 'en_gb', ' logo '),
(65, 'filename', 0, 'en_gb', ' ms icon 144x144 png '),
(65, 'extension', 0, 'en_gb', ' png '),
(65, 'kind', 0, 'en_gb', ' image '),
(65, 'slug', 0, 'en_gb', ' ms icon 144x144 '),
(65, 'title', 0, 'en_gb', ' ms icon 144x144 '),
(66, 'filename', 0, 'en_gb', ' ms icon 150x150 png '),
(66, 'extension', 0, 'en_gb', ' png '),
(66, 'kind', 0, 'en_gb', ' image '),
(66, 'slug', 0, 'en_gb', ' ms icon 150x150 '),
(66, 'title', 0, 'en_gb', ' ms icon 150x150 '),
(67, 'filename', 0, 'en_gb', ' ms icon 310x310 png '),
(67, 'extension', 0, 'en_gb', ' png '),
(67, 'kind', 0, 'en_gb', ' image '),
(67, 'slug', 0, 'en_gb', ' ms icon 310x310 '),
(67, 'title', 0, 'en_gb', ' ms icon 310x310 '),
(68, 'filename', 0, 'en_gb', ' ms icon 70x70 png '),
(68, 'extension', 0, 'en_gb', ' png '),
(68, 'kind', 0, 'en_gb', ' image '),
(68, 'slug', 0, 'en_gb', ' ms icon 70x70 '),
(68, 'title', 0, 'en_gb', ' ms icon 70x70 '),
(69, 'filename', 0, 'en_gb', ' social_icons png '),
(69, 'extension', 0, 'en_gb', ' png '),
(69, 'kind', 0, 'en_gb', ' image '),
(69, 'slug', 0, 'en_gb', ' social icons '),
(69, 'title', 0, 'en_gb', ' social icons '),
(70, 'filename', 0, 'en_gb', ' twitter svg '),
(70, 'extension', 0, 'en_gb', ' svg '),
(70, 'kind', 0, 'en_gb', ' image '),
(70, 'slug', 0, 'en_gb', ' twitter '),
(70, 'title', 0, 'en_gb', ' twitter '),
(71, 'filename', 0, 'en_gb', ' 4 01 jpg '),
(71, 'extension', 0, 'en_gb', ' jpg '),
(71, 'kind', 0, 'en_gb', ' image '),
(71, 'slug', 0, 'en_gb', ' 4 01 '),
(71, 'title', 0, 'en_gb', ' 4 01 '),
(72, 'filename', 0, 'en_gb', ' 4 02 jpg '),
(72, 'extension', 0, 'en_gb', ' jpg '),
(72, 'kind', 0, 'en_gb', ' image '),
(72, 'slug', 0, 'en_gb', ' 4 02 '),
(72, 'title', 0, 'en_gb', ' 4 02 '),
(73, 'filename', 0, 'en_gb', ' 4 03 jpg '),
(73, 'extension', 0, 'en_gb', ' jpg '),
(73, 'kind', 0, 'en_gb', ' image '),
(73, 'slug', 0, 'en_gb', ' 4 03 '),
(73, 'title', 0, 'en_gb', ' 4 03 '),
(75, 'field', 14, 'en_gb', ' we are a collective of data scientists tech engineers and creative pioneers who have cultivated world class experience in sports our fan insights inspire technology led ideas brought to life through our products platforms and service led experiences '),
(75, 'field', 15, 'en_gb', ' 2 01 '),
(78, 'field', 11, 'en_gb', ' curate '),
(78, 'field', 14, 'en_gb', ' we identify incubate and accelerate technology based start ups to create disruptive sport concepts for global sports fans '),
(78, 'field', 15, 'en_gb', ' 2 02 '),
(78, 'slug', 0, 'en_gb', ''),
(79, 'field', 11, 'en_gb', ' collaborate '),
(79, 'field', 14, 'en_gb', ' with decades of sports marketing experience and envied connectivity in the sector we work side by side with high profile sports leagues teams and digital platforms to ensure the best exposure and access to our ideas by global fan communities '),
(79, 'field', 15, 'en_gb', ' 2 03 '),
(79, 'slug', 0, 'en_gb', ''),
(80, 'field', 16, 'en_gb', ' 4 01 hello do you have an idea a vision or an aspiration you believe could revolutionise a sports experience for fans can you hook us in 50 words or less inspire 4 02 hello are you an established start up or small business with a technology or proof of concept that could benefit sports fans partner 4 03 hello are you passionate about technology sports creativity and teamwork we re looking for people like you join '),
(80, 'slug', 0, 'en_gb', ' work with us '),
(80, 'title', 0, 'en_gb', ' work with us '),
(81, 'field', 17, 'en_gb', ' inspire '),
(81, 'field', 18, 'en_gb', ' do you have an idea a vision or an aspiration you believe could revolutionise a sports experience for fans can you hook us in 50 words or less '),
(81, 'field', 19, 'en_gb', ' 4 01 '),
(81, 'field', 20, 'en_gb', ' hello '),
(81, 'slug', 0, 'en_gb', ''),
(82, 'field', 17, 'en_gb', ' partner '),
(82, 'field', 18, 'en_gb', ' are you an established start up or small business with a technology or proof of concept that could benefit sports fans '),
(82, 'field', 19, 'en_gb', ' 4 02 '),
(82, 'field', 20, 'en_gb', ' hello '),
(82, 'slug', 0, 'en_gb', ''),
(83, 'field', 17, 'en_gb', ' join '),
(83, 'field', 18, 'en_gb', ' are you passionate about technology sports creativity and teamwork we re looking for people like you '),
(83, 'field', 19, 'en_gb', ' 4 03 '),
(83, 'field', 20, 'en_gb', ' hello '),
(83, 'slug', 0, 'en_gb', ''),
(84, 'slug', 0, 'en_gb', ' about us '),
(84, 'title', 0, 'en_gb', ' about us '),
(84, 'field', 22, 'en_gb', ' 1 01 1 02 1 03 '),
(84, 'field', 21, 'en_gb', ' professional sport now enjoys a truly global following through technology our fantastec goal is to enable ever richer more rewarding fan experiences only 0 5% of the annual english premier league audience experience a match from a stadium seat yet billions of fans around the world follow the action the characters and the stories through emerging technologies like virtual augmented reality wearable tech a i and the blockchain fantastec is developing products platforms and experiences so globally distanced fans can connect and engage more deeply with the sport they love '),
(89, 'title', 0, 'en_gb', ' contact us '),
(89, 'field', 25, 'en_gb', ' surrey technology centre 40 occam road guildford surrey gu2 7yg hello fantastec io https www google com maps place surrey research park 51 2396613 0 6142707 17z data= 4m5 3m4 1s0x0 0x632d0439c869347 8m2 3d51 2398362 4d 0 6120311 fantastec 44 148 368 8309 44 148 368 8186 '),
(90, 'field', 26, 'en_gb', ' fantastec '),
(90, 'field', 27, 'en_gb', ' surrey technology centre 40 occam road guildford surrey gu2 7yg '),
(90, 'field', 28, 'en_gb', ' https www google com maps place surrey research park 51 2396613 0 6142707 17z data= 4m5 3m4 1s0x0 0x632d0439c869347 8m2 3d51 2398362 4d 0 6120311 '),
(90, 'field', 29, 'en_gb', ' 44 148 368 8309 '),
(90, 'field', 30, 'en_gb', ' hello fantastec io '),
(90, 'slug', 0, 'en_gb', ''),
(88, 'field', 31, 'en_gb', ' 1 en_gb 1 0 template creativework webpage home field title custom title custom title custom videos custom videos custom videos '),
(90, 'field', 32, 'en_gb', ' 44 148 368 8186 '),
(6, 'field', 34, 'en_gb', ' 50% center '),
(24, 'field', 34, 'en_gb', ' 25% center '),
(25, 'field', 34, 'en_gb', ' 75% center '),
(26, 'field', 34, 'en_gb', ''),
(29, 'field', 34, 'en_gb', ''),
(30, 'field', 34, 'en_gb', '');

-- --------------------------------------------------------

--
-- Table structure for table `craft_sections`
--

CREATE TABLE `craft_sections` (
  `id` int(11) NOT NULL,
  `structureId` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `handle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` enum('single','channel','structure') COLLATE utf8_unicode_ci NOT NULL DEFAULT 'channel',
  `hasUrls` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `template` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `enableVersioning` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_sections`
--

INSERT INTO `craft_sections` (`id`, `structureId`, `name`, `handle`, `type`, `hasUrls`, `template`, `enableVersioning`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(3, NULL, 'Imagine If', 'imagineIf', 'channel', 1, 'imagine-if/_entry', 1, '2017-11-14 13:00:03', '2017-11-15 17:03:52', '9d118be5-c33f-48e4-8cfe-05ffb2dbfe9e'),
(4, NULL, 'How We Innovate', 'howWeInnovate', 'channel', 1, 'how-we-innovate/_entry', 1, '2017-11-15 15:15:39', '2017-11-15 17:04:11', '646bd369-ac6c-4925-80ce-c0e88dfef096'),
(5, NULL, 'Work With Us', 'workWithUs', 'channel', 1, 'work-with-us/_entry', 1, '2017-11-15 16:45:04', '2017-11-15 17:03:32', '0e089791-f9dc-4988-a083-672a907f146f'),
(6, NULL, 'About Us', 'aboutUs', 'single', 1, 'about-us', 1, '2017-11-16 11:07:37', '2017-11-16 11:07:37', 'c0d48356-957b-4d2d-a591-b7ed97d8b422'),
(7, NULL, 'Home', 'homeVideo', 'single', 1, 'home/_entry', 1, '2017-11-17 12:37:57', '2017-11-20 11:40:32', '308335e6-e5c6-4489-a7aa-5222beae9977'),
(8, NULL, 'Contact Us', 'contactUs', 'single', 1, 'contact-us/_entry', 1, '2017-11-17 14:03:16', '2017-11-17 14:03:16', '8d86a013-3845-4098-8a5b-9da9d12b44dc');

-- --------------------------------------------------------

--
-- Table structure for table `craft_sections_i18n`
--

CREATE TABLE `craft_sections_i18n` (
  `id` int(11) NOT NULL,
  `sectionId` int(11) NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `enabledByDefault` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `urlFormat` text COLLATE utf8_unicode_ci,
  `nestedUrlFormat` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_sections_i18n`
--

INSERT INTO `craft_sections_i18n` (`id`, `sectionId`, `locale`, `enabledByDefault`, `urlFormat`, `nestedUrlFormat`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(3, 3, 'en_gb', 1, 'imagine-if/{slug}', NULL, '2017-11-14 13:00:03', '2017-11-14 13:00:03', '33e24acb-9b1b-4b0b-aff6-c5df081269ac'),
(4, 4, 'en_gb', 1, 'how-we-innovate/{slug}', NULL, '2017-11-15 15:15:39', '2017-11-15 15:15:39', '8039b30f-11cf-404a-8c58-928c8c45fd13'),
(5, 5, 'en_gb', 1, 'work-with-us/{slug}', NULL, '2017-11-15 16:45:04', '2017-11-15 16:45:04', 'e55a43b6-e20c-48b4-8ad8-a89b140e331b'),
(6, 6, 'en_gb', 1, 'about-us', NULL, '2017-11-16 11:07:37', '2017-11-16 11:07:37', '322b477f-c621-4826-8da3-186d96a00863'),
(7, 7, 'en_gb', 1, 'home-video', NULL, '2017-11-17 12:37:57', '2017-11-17 12:37:57', 'c5869d75-714b-4ebb-9399-c9e5d42accd7'),
(8, 8, 'en_gb', 1, 'contact-us', NULL, '2017-11-17 14:03:16', '2017-11-17 14:03:16', '872f5d2c-73b0-4ba5-bdeb-13f87ce9a669');

-- --------------------------------------------------------

--
-- Table structure for table `craft_seomatic_meta`
--

CREATE TABLE `craft_seomatic_meta` (
  `id` int(11) NOT NULL,
  `seoImageId` int(11) DEFAULT NULL,
  `seoTwitterImageId` int(11) DEFAULT NULL,
  `seoFacebookImageId` int(11) DEFAULT NULL,
  `locale` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'en_gb',
  `elementId` int(10) DEFAULT '0',
  `metaType` enum('default','template') COLLATE utf8_unicode_ci DEFAULT 'template',
  `metaPath` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `seoMainEntityCategory` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `seoMainEntityOfPage` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `seoTitle` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `seoDescription` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `seoKeywords` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `seoImageTransform` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `seoFacebookImageTransform` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `seoTwitterImageTransform` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `twitterCardType` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'summary',
  `openGraphType` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'website',
  `robots` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_seomatic_settings`
--

CREATE TABLE `craft_seomatic_settings` (
  `id` int(11) NOT NULL,
  `siteSeoImageId` int(11) DEFAULT NULL,
  `siteSeoTwitterImageId` int(11) DEFAULT NULL,
  `siteSeoFacebookImageId` int(11) DEFAULT NULL,
  `genericOwnerImageId` int(11) DEFAULT NULL,
  `genericCreatorImageId` int(11) DEFAULT NULL,
  `locale` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `siteSeoName` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `siteSeoTitle` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `siteSeoTitleSeparator` varchar(10) COLLATE utf8_unicode_ci DEFAULT '|',
  `siteSeoTitlePlacement` enum('before','after','none') COLLATE utf8_unicode_ci DEFAULT 'after',
  `siteSeoDescription` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `siteSeoKeywords` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `siteSeoImageTransform` varchar(100) COLLATE utf8_unicode_ci DEFAULT '',
  `siteSeoFacebookImageTransform` varchar(100) COLLATE utf8_unicode_ci DEFAULT '',
  `siteSeoTwitterImageTransform` varchar(100) COLLATE utf8_unicode_ci DEFAULT '',
  `siteTwitterCardType` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `siteOpenGraphType` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `siteRobots` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `siteRobotsTxt` text COLLATE utf8_unicode_ci,
  `siteLinksSearchTargets` text COLLATE utf8_unicode_ci,
  `siteLinksQueryInput` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `googleSiteVerification` varchar(100) COLLATE utf8_unicode_ci DEFAULT '',
  `bingSiteVerification` varchar(100) COLLATE utf8_unicode_ci DEFAULT '',
  `googleAnalyticsUID` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `googleTagManagerID` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `googleAnalyticsSendPageview` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `googleAnalyticsAdvertising` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `googleAnalyticsEcommerce` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `googleAnalyticsEEcommerce` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `googleAnalyticsLinkAttribution` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `googleAnalyticsLinker` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `googleAnalyticsAnonymizeIp` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `siteOwnerType` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `siteOwnerSubType` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `siteOwnerSpecificType` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerName` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerAlternateName` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerDescription` varchar(1024) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerTelephone` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerEmail` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerStreetAddress` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerAddressLocality` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerAddressRegion` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerPostalCode` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerAddressCountry` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerGeoLatitude` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericOwnerGeoLongitude` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `organizationOwnerDuns` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `organizationOwnerFounder` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `organizationOwnerFoundingDate` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `organizationOwnerFoundingLocation` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `organizationOwnerContactPoints` text COLLATE utf8_unicode_ci,
  `localBusinessPriceRange` varchar(10) COLLATE utf8_unicode_ci DEFAULT '$$$',
  `localBusinessOwnerOpeningHours` text COLLATE utf8_unicode_ci,
  `corporationOwnerTickerSymbol` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `restaurantOwnerServesCuisine` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `restaurantOwnerMenuUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `restaurantOwnerReservationsUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `personOwnerGender` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `personOwnerBirthPlace` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `twitterHandle` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `facebookHandle` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `facebookProfileId` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `facebookAppId` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `linkedInHandle` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `googlePlusHandle` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `youtubeHandle` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `youtubeChannelHandle` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `instagramHandle` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `pinterestHandle` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `githubHandle` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `vimeoHandle` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `wikipediaUrl` varchar(100) COLLATE utf8_unicode_ci DEFAULT '',
  `siteCreatorType` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `siteCreatorSubType` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `siteCreatorSpecificType` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorName` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorAlternateName` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorDescription` varchar(1024) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorTelephone` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorEmail` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorStreetAddress` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorAddressLocality` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorAddressRegion` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorPostalCode` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorAddressCountry` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorGeoLatitude` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorGeoLongitude` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `organizationCreatorDuns` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `organizationCreatorFounder` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `organizationCreatorFoundingDate` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `organizationCreatorFoundingLocation` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `organizationCreatorContactPoints` text COLLATE utf8_unicode_ci,
  `localBusinessCreatorOpeningHours` text COLLATE utf8_unicode_ci,
  `corporationCreatorTickerSymbol` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `restaurantCreatorServesCuisine` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `restaurantCreatorMenuUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `restaurantCreatorReservationsUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `personCreatorGender` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `personCreatorBirthPlace` varchar(255) COLLATE utf8_unicode_ci DEFAULT '',
  `genericCreatorHumansTxt` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_seomatic_settings`
--

INSERT INTO `craft_seomatic_settings` (`id`, `siteSeoImageId`, `siteSeoTwitterImageId`, `siteSeoFacebookImageId`, `genericOwnerImageId`, `genericCreatorImageId`, `locale`, `siteSeoName`, `siteSeoTitle`, `siteSeoTitleSeparator`, `siteSeoTitlePlacement`, `siteSeoDescription`, `siteSeoKeywords`, `siteSeoImageTransform`, `siteSeoFacebookImageTransform`, `siteSeoTwitterImageTransform`, `siteTwitterCardType`, `siteOpenGraphType`, `siteRobots`, `siteRobotsTxt`, `siteLinksSearchTargets`, `siteLinksQueryInput`, `googleSiteVerification`, `bingSiteVerification`, `googleAnalyticsUID`, `googleTagManagerID`, `googleAnalyticsSendPageview`, `googleAnalyticsAdvertising`, `googleAnalyticsEcommerce`, `googleAnalyticsEEcommerce`, `googleAnalyticsLinkAttribution`, `googleAnalyticsLinker`, `googleAnalyticsAnonymizeIp`, `siteOwnerType`, `siteOwnerSubType`, `siteOwnerSpecificType`, `genericOwnerName`, `genericOwnerAlternateName`, `genericOwnerDescription`, `genericOwnerUrl`, `genericOwnerTelephone`, `genericOwnerEmail`, `genericOwnerStreetAddress`, `genericOwnerAddressLocality`, `genericOwnerAddressRegion`, `genericOwnerPostalCode`, `genericOwnerAddressCountry`, `genericOwnerGeoLatitude`, `genericOwnerGeoLongitude`, `organizationOwnerDuns`, `organizationOwnerFounder`, `organizationOwnerFoundingDate`, `organizationOwnerFoundingLocation`, `organizationOwnerContactPoints`, `localBusinessPriceRange`, `localBusinessOwnerOpeningHours`, `corporationOwnerTickerSymbol`, `restaurantOwnerServesCuisine`, `restaurantOwnerMenuUrl`, `restaurantOwnerReservationsUrl`, `personOwnerGender`, `personOwnerBirthPlace`, `twitterHandle`, `facebookHandle`, `facebookProfileId`, `facebookAppId`, `linkedInHandle`, `googlePlusHandle`, `youtubeHandle`, `youtubeChannelHandle`, `instagramHandle`, `pinterestHandle`, `githubHandle`, `vimeoHandle`, `wikipediaUrl`, `siteCreatorType`, `siteCreatorSubType`, `siteCreatorSpecificType`, `genericCreatorName`, `genericCreatorAlternateName`, `genericCreatorDescription`, `genericCreatorUrl`, `genericCreatorTelephone`, `genericCreatorEmail`, `genericCreatorStreetAddress`, `genericCreatorAddressLocality`, `genericCreatorAddressRegion`, `genericCreatorPostalCode`, `genericCreatorAddressCountry`, `genericCreatorGeoLatitude`, `genericCreatorGeoLongitude`, `organizationCreatorDuns`, `organizationCreatorFounder`, `organizationCreatorFoundingDate`, `organizationCreatorFoundingLocation`, `organizationCreatorContactPoints`, `localBusinessCreatorOpeningHours`, `corporationCreatorTickerSymbol`, `restaurantCreatorServesCuisine`, `restaurantCreatorMenuUrl`, `restaurantCreatorReservationsUrl`, `personCreatorGender`, `personCreatorBirthPlace`, `genericCreatorHumansTxt`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, 'en_gb', 'Fantastec', 'fantastec sport fan engagement innovation', '|', 'after', 'fantastec sport innovating fan engagement.', 'default,global,comma-separated,keywords', '', '', '', 'summary', 'website', '', '# robots.txt for {{ siteUrl }}\r\n# For a multi-environment setup, see: https://nystudio107.com/blog/prevent-google-from-indexing-staging-sites\r\n\r\nSitemap: {{ siteUrl |trim(\'/\') }}/sitemap.xml\r\n\r\n{% if craft.config.devMode %}\r\n# devMode - disallow all\r\n\r\nUser-agent: *\r\nDisallow: /\r\n{% else %}\r\n# Live - Don\'t allow web crawlers to index Craft\r\n\r\nUser-agent: *\r\nDisallow: /craft/\r\n{% endif %}', '[]', '', '', '', '', '', 1, 0, 0, 0, 0, 0, 0, 'Organization', 'Corporation', '', 'Fantastec', '', '', 'http://localhost:8888/craftFantastec/public_html/', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '$$$', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Organization', 'Corporation', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '/* TEAM */\n\n{% if seomaticCreator.name is defined and seomaticCreator.name %}\nCreator: {{ seomaticCreator.name }}\n{% endif %}\n{% if seomaticCreator.url is defined and seomaticCreator.url %}\nURL: {{ seomaticCreator.url }}\n{% endif %}\n{% if seomaticCreator.description is defined and seomaticCreator.description %}\nDescription: {{ seomaticCreator.description }}\n{% endif %}\n\n/* THANKS */\n\nPixel & Tonic - https://pixelandtonic.com\n\n/* SITE */\n\nStandards: HTML5, CSS3\nComponents: Craft CMS, Yii, PHP, Javascript, SEOmatic', '2017-11-20 11:31:51', '2017-11-20 11:36:46', '2a0eeb0b-e5d9-42e8-9482-008df24001cf');

-- --------------------------------------------------------

--
-- Table structure for table `craft_sessions`
--

CREATE TABLE `craft_sessions` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `token` char(100) COLLATE utf8_unicode_ci NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_sessions`
--

INSERT INTO `craft_sessions` (`id`, `userId`, `token`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 1, '9728eb7f80e4b2e4f64ac5848759bfd8cf40482cczozMjoiT0FJWTRWOWxkU3dqNH5CV2lRZ01IVGJ5WERZTVRzRnMiOw==', '2017-11-14 10:47:55', '2017-11-14 10:47:55', '1e0ab45e-e30a-45e2-b256-f7d7f728ad4d'),
(5, 1, '6bc126ad0aa30e8e6fe1b2b1a8a3ef1dd99a1907czozMjoiUXhqQWFtcklTcHNVZWJlMG1PdFNaSTJxbGxMcXlZeHYiOw==', '2017-11-15 14:43:45', '2017-11-15 14:43:45', '76a2874b-245c-42b0-a1da-2d6f7edb4ed3'),
(7, 1, '751eb6f338e347c61e2f18a086ab0b190a6030d7czozMjoidGNZbFZwaGp+RmxrVDhjT2pPZGJROURzQnNLTzhkUlAiOw==', '2017-11-15 15:49:08', '2017-11-15 15:49:08', '791c11b4-03e3-4747-a4b3-9cc2eb032fc3'),
(9, 1, 'bc225d76ba74076f6d64ecd40e340fcdc0a6f790czozMjoiU0VNSkxLaHhHUn5+dG82OXo4X1FfWkdHRV9KRjhubFciOw==', '2017-11-16 16:16:32', '2017-11-16 16:16:32', '95198661-24dd-4b1a-b5c7-afc729955ac4'),
(10, 1, '06a11efaab0a8e83f3b3b2b6e79108aba4840dceczozMjoiYmtKYjZySU4wU1lndX5xfkhzUzYzdHhNVXJPZWs2ZjIiOw==', '2017-11-17 10:24:37', '2017-11-17 10:24:37', '122bec4f-1a1b-4165-abb5-20d6a6119f3c'),
(11, 1, '3269b9ab6e912fb205caf73af88e92e3509726deczozMjoiamtMZUdrTWNUTklOZEhWMHZ2dkdqcFY5QXZPN2VyNnIiOw==', '2017-11-20 10:07:02', '2017-11-20 10:07:02', 'b37e6052-bb66-43fc-b6d4-804fca4549d3'),
(12, 1, '0f79816eaccb5354792f48a65a21cf33def68d2dczozMjoiUnlIbzFffkxSNGk4NTgzbDRXODZVWHBYd1VXeEoxSUQiOw==', '2017-11-23 12:28:12', '2017-11-23 12:28:12', '4e4c8e89-06ca-476c-8521-92d4db679edc'),
(13, 1, '39bc6d5769fde199329c9370366d45b416b22238czozMjoiaF9CRGhXNUdsN1F5Y1hzd29sQmw2SmY4dUYwY2RDZVQiOw==', '2017-11-24 12:55:52', '2017-11-24 12:55:52', '7edf73ba-e376-4188-bf18-9bdadb6b143d'),
(14, 1, 'c9228811e85ffd5757e896a4c3b12996cf81f03aczozMjoiY35lb2taZndJdjZubjlUa0EwbUlrMWljQVRHWUpzWHoiOw==', '2017-11-24 15:22:55', '2017-11-24 15:22:55', '33bf3e78-f108-472f-b280-130b7f4598b3'),
(17, 1, '1689716de3f9b2387c4e923079af8bf8f909efa0czozMjoiTThLbUJKUDE3ZWdqN0FaVDh5NVNMOURwZmRpZUVNWVciOw==', '2017-11-24 16:56:54', '2017-11-24 16:56:54', '31abdda4-2838-4507-9027-dd2e0e70594b');

-- --------------------------------------------------------

--
-- Table structure for table `craft_shunnedmessages`
--

CREATE TABLE `craft_shunnedmessages` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `message` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `expiryDate` datetime DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_structureelements`
--

CREATE TABLE `craft_structureelements` (
  `id` int(11) NOT NULL,
  `structureId` int(11) NOT NULL,
  `elementId` int(11) DEFAULT NULL,
  `root` int(11) UNSIGNED DEFAULT NULL,
  `lft` int(11) UNSIGNED NOT NULL,
  `rgt` int(11) UNSIGNED NOT NULL,
  `level` smallint(6) UNSIGNED NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_structures`
--

CREATE TABLE `craft_structures` (
  `id` int(11) NOT NULL,
  `maxLevels` smallint(6) UNSIGNED DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_systemsettings`
--

CREATE TABLE `craft_systemsettings` (
  `id` int(11) NOT NULL,
  `category` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `settings` text COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_systemsettings`
--

INSERT INTO `craft_systemsettings` (`id`, `category`, `settings`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 'email', '{\"protocol\":\"php\",\"emailAddress\":\"damian.w@interstateteam.com\",\"senderName\":\"craft_fantastec\"}', '2017-11-14 10:47:55', '2017-11-14 10:47:55', '5ce7a9a3-c6a6-4586-9f90-eb7c1793b110');

-- --------------------------------------------------------

--
-- Table structure for table `craft_taggroups`
--

CREATE TABLE `craft_taggroups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `handle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fieldLayoutId` int(10) DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_taggroups`
--

INSERT INTO `craft_taggroups` (`id`, `name`, `handle`, `fieldLayoutId`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 'Default', 'default', 1, '2017-11-14 10:47:55', '2017-11-14 10:47:55', '0baa974a-0fbd-4043-a091-5f0fe5a7806a');

-- --------------------------------------------------------

--
-- Table structure for table `craft_tags`
--

CREATE TABLE `craft_tags` (
  `id` int(11) NOT NULL,
  `groupId` int(11) NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_tasks`
--

CREATE TABLE `craft_tasks` (
  `id` int(11) NOT NULL,
  `root` int(11) UNSIGNED DEFAULT NULL,
  `lft` int(11) UNSIGNED NOT NULL,
  `rgt` int(11) UNSIGNED NOT NULL,
  `level` smallint(6) UNSIGNED NOT NULL,
  `currentStep` int(11) UNSIGNED DEFAULT NULL,
  `totalSteps` int(11) UNSIGNED DEFAULT NULL,
  `status` enum('pending','error','running') COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `settings` mediumtext COLLATE utf8_unicode_ci,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_templatecachecriteria`
--

CREATE TABLE `craft_templatecachecriteria` (
  `id` int(11) NOT NULL,
  `cacheId` int(11) NOT NULL,
  `type` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `criteria` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_templatecacheelements`
--

CREATE TABLE `craft_templatecacheelements` (
  `cacheId` int(11) NOT NULL,
  `elementId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_templatecaches`
--

CREATE TABLE `craft_templatecaches` (
  `id` int(11) NOT NULL,
  `cacheKey` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `locale` char(12) COLLATE utf8_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `expiryDate` datetime NOT NULL,
  `body` mediumtext COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_tokens`
--

CREATE TABLE `craft_tokens` (
  `id` int(11) NOT NULL,
  `token` char(32) COLLATE utf8_unicode_ci NOT NULL,
  `route` text COLLATE utf8_unicode_ci,
  `usageLimit` tinyint(3) UNSIGNED DEFAULT NULL,
  `usageCount` tinyint(3) UNSIGNED DEFAULT NULL,
  `expiryDate` datetime NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_usergroups`
--

CREATE TABLE `craft_usergroups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `handle` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_usergroups_users`
--

CREATE TABLE `craft_usergroups_users` (
  `id` int(11) NOT NULL,
  `groupId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_userpermissions`
--

CREATE TABLE `craft_userpermissions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_userpermissions_usergroups`
--

CREATE TABLE `craft_userpermissions_usergroups` (
  `id` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  `groupId` int(11) NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_userpermissions_users`
--

CREATE TABLE `craft_userpermissions_users` (
  `id` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `craft_users`
--

CREATE TABLE `craft_users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `photo` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `firstName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastName` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` char(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `preferredLocale` char(12) COLLATE utf8_unicode_ci DEFAULT NULL,
  `weekStartDay` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `admin` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `client` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `locked` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `suspended` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `pending` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `archived` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `lastLoginDate` datetime DEFAULT NULL,
  `lastLoginAttemptIPAddress` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `invalidLoginWindowStart` datetime DEFAULT NULL,
  `invalidLoginCount` tinyint(4) UNSIGNED DEFAULT NULL,
  `lastInvalidLoginDate` datetime DEFAULT NULL,
  `lockoutDate` datetime DEFAULT NULL,
  `verificationCode` char(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `verificationCodeIssuedDate` datetime DEFAULT NULL,
  `unverifiedEmail` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `passwordResetRequired` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `lastPasswordChangeDate` datetime DEFAULT NULL,
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_users`
--

INSERT INTO `craft_users` (`id`, `username`, `photo`, `firstName`, `lastName`, `email`, `password`, `preferredLocale`, `weekStartDay`, `admin`, `client`, `locked`, `suspended`, `pending`, `archived`, `lastLoginDate`, `lastLoginAttemptIPAddress`, `invalidLoginWindowStart`, `invalidLoginCount`, `lastInvalidLoginDate`, `lockoutDate`, `verificationCode`, `verificationCodeIssuedDate`, `unverifiedEmail`, `passwordResetRequired`, `lastPasswordChangeDate`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 'damian.w@interstateteam.com', NULL, NULL, NULL, 'damian.w@interstateteam.com', '$2y$13$IFlF.pnxCSQwx94BEAIBXuDbSWE0i2dRcHKZoOAgcAqi1K8PhOs.6', NULL, 0, 1, 0, 0, 0, 0, 0, '2017-12-04 15:49:25', '::1', NULL, NULL, '2017-11-15 10:07:33', NULL, NULL, NULL, NULL, 0, '2017-11-15 10:10:48', '2017-11-14 10:47:52', '2017-12-04 15:49:25', '578d39df-e356-48fc-a3e1-dacc5c63d0cc');

-- --------------------------------------------------------

--
-- Table structure for table `craft_widgets`
--

CREATE TABLE `craft_widgets` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `sortOrder` smallint(6) UNSIGNED DEFAULT NULL,
  `colspan` tinyint(4) UNSIGNED DEFAULT NULL,
  `settings` text COLLATE utf8_unicode_ci,
  `enabled` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `dateCreated` datetime NOT NULL,
  `dateUpdated` datetime NOT NULL,
  `uid` char(36) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `craft_widgets`
--

INSERT INTO `craft_widgets` (`id`, `userId`, `type`, `sortOrder`, `colspan`, `settings`, `enabled`, `dateCreated`, `dateUpdated`, `uid`) VALUES
(1, 1, 'RecentEntries', 1, NULL, NULL, 1, '2017-11-14 10:47:59', '2017-11-14 10:47:59', '8886c317-c632-4685-b8e3-4b8307ad939a'),
(2, 1, 'GetHelp', 2, NULL, NULL, 1, '2017-11-14 10:47:59', '2017-11-14 10:47:59', 'e7f4e9fb-f573-4e42-9410-b0d925ee235f'),
(3, 1, 'Updates', 3, NULL, NULL, 1, '2017-11-14 10:47:59', '2017-11-14 10:47:59', '7d940164-3c5f-4ef6-b1dc-ffd0017dfd79'),
(4, 1, 'Feed', 4, NULL, '{\"url\":\"https:\\/\\/craftcms.com\\/news.rss\",\"title\":\"Craft News\"}', 1, '2017-11-14 10:47:59', '2017-11-14 10:47:59', '81046ce0-b3e3-4ca7-b583-280ae29986b4');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `craft_assetfiles`
--
ALTER TABLE `craft_assetfiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_assetfiles_filename_folderId_unq_idx` (`filename`,`folderId`),
  ADD KEY `craft_assetfiles_sourceId_fk` (`sourceId`),
  ADD KEY `craft_assetfiles_folderId_fk` (`folderId`);

--
-- Indexes for table `craft_assetfolders`
--
ALTER TABLE `craft_assetfolders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_assetfolders_name_parentId_sourceId_unq_idx` (`name`,`parentId`,`sourceId`),
  ADD KEY `craft_assetfolders_parentId_fk` (`parentId`),
  ADD KEY `craft_assetfolders_sourceId_fk` (`sourceId`);

--
-- Indexes for table `craft_assetindexdata`
--
ALTER TABLE `craft_assetindexdata`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_assetindexdata_sessionId_sourceId_offset_unq_idx` (`sessionId`,`sourceId`,`offset`),
  ADD KEY `craft_assetindexdata_sourceId_fk` (`sourceId`);

--
-- Indexes for table `craft_assetsources`
--
ALTER TABLE `craft_assetsources`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_assetsources_name_unq_idx` (`name`),
  ADD UNIQUE KEY `craft_assetsources_handle_unq_idx` (`handle`),
  ADD KEY `craft_assetsources_fieldLayoutId_fk` (`fieldLayoutId`);

--
-- Indexes for table `craft_assettransformindex`
--
ALTER TABLE `craft_assettransformindex`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_assettransformindex_sourceId_fileId_location_idx` (`sourceId`,`fileId`,`location`);

--
-- Indexes for table `craft_assettransforms`
--
ALTER TABLE `craft_assettransforms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_assettransforms_name_unq_idx` (`name`),
  ADD UNIQUE KEY `craft_assettransforms_handle_unq_idx` (`handle`);

--
-- Indexes for table `craft_categories`
--
ALTER TABLE `craft_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_categories_groupId_fk` (`groupId`);

--
-- Indexes for table `craft_categorygroups`
--
ALTER TABLE `craft_categorygroups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_categorygroups_name_unq_idx` (`name`),
  ADD UNIQUE KEY `craft_categorygroups_handle_unq_idx` (`handle`),
  ADD KEY `craft_categorygroups_structureId_fk` (`structureId`),
  ADD KEY `craft_categorygroups_fieldLayoutId_fk` (`fieldLayoutId`);

--
-- Indexes for table `craft_categorygroups_i18n`
--
ALTER TABLE `craft_categorygroups_i18n`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_categorygroups_i18n_groupId_locale_unq_idx` (`groupId`,`locale`),
  ADD KEY `craft_categorygroups_i18n_locale_fk` (`locale`);

--
-- Indexes for table `craft_content`
--
ALTER TABLE `craft_content`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_content_elementId_locale_unq_idx` (`elementId`,`locale`),
  ADD KEY `craft_content_title_idx` (`title`),
  ADD KEY `craft_content_locale_fk` (`locale`);

--
-- Indexes for table `craft_cpnav_layouts`
--
ALTER TABLE `craft_cpnav_layouts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `craft_cpnav_navs`
--
ALTER TABLE `craft_cpnav_navs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_cpnav_navs_layoutId_fk` (`layoutId`);

--
-- Indexes for table `craft_deprecationerrors`
--
ALTER TABLE `craft_deprecationerrors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_deprecationerrors_key_fingerprint_unq_idx` (`key`,`fingerprint`);

--
-- Indexes for table `craft_elementindexsettings`
--
ALTER TABLE `craft_elementindexsettings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_elementindexsettings_type_unq_idx` (`type`);

--
-- Indexes for table `craft_elements`
--
ALTER TABLE `craft_elements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_elements_type_idx` (`type`),
  ADD KEY `craft_elements_enabled_idx` (`enabled`),
  ADD KEY `craft_elements_archived_dateCreated_idx` (`archived`,`dateCreated`);

--
-- Indexes for table `craft_elements_i18n`
--
ALTER TABLE `craft_elements_i18n`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_elements_i18n_elementId_locale_unq_idx` (`elementId`,`locale`),
  ADD UNIQUE KEY `craft_elements_i18n_uri_locale_unq_idx` (`uri`,`locale`),
  ADD KEY `craft_elements_i18n_slug_locale_idx` (`slug`,`locale`),
  ADD KEY `craft_elements_i18n_enabled_idx` (`enabled`),
  ADD KEY `craft_elements_i18n_locale_fk` (`locale`);

--
-- Indexes for table `craft_emailmessages`
--
ALTER TABLE `craft_emailmessages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_emailmessages_key_locale_unq_idx` (`key`,`locale`),
  ADD KEY `craft_emailmessages_locale_fk` (`locale`);

--
-- Indexes for table `craft_entries`
--
ALTER TABLE `craft_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_entries_sectionId_idx` (`sectionId`),
  ADD KEY `craft_entries_typeId_idx` (`typeId`),
  ADD KEY `craft_entries_postDate_idx` (`postDate`),
  ADD KEY `craft_entries_expiryDate_idx` (`expiryDate`),
  ADD KEY `craft_entries_authorId_fk` (`authorId`);

--
-- Indexes for table `craft_entrydrafts`
--
ALTER TABLE `craft_entrydrafts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_entrydrafts_entryId_locale_idx` (`entryId`,`locale`),
  ADD KEY `craft_entrydrafts_sectionId_fk` (`sectionId`),
  ADD KEY `craft_entrydrafts_creatorId_fk` (`creatorId`),
  ADD KEY `craft_entrydrafts_locale_fk` (`locale`);

--
-- Indexes for table `craft_entrytypes`
--
ALTER TABLE `craft_entrytypes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_entrytypes_name_sectionId_unq_idx` (`name`,`sectionId`),
  ADD UNIQUE KEY `craft_entrytypes_handle_sectionId_unq_idx` (`handle`,`sectionId`),
  ADD KEY `craft_entrytypes_sectionId_fk` (`sectionId`),
  ADD KEY `craft_entrytypes_fieldLayoutId_fk` (`fieldLayoutId`);

--
-- Indexes for table `craft_entryversions`
--
ALTER TABLE `craft_entryversions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_entryversions_entryId_locale_idx` (`entryId`,`locale`),
  ADD KEY `craft_entryversions_sectionId_fk` (`sectionId`),
  ADD KEY `craft_entryversions_creatorId_fk` (`creatorId`),
  ADD KEY `craft_entryversions_locale_fk` (`locale`);

--
-- Indexes for table `craft_fieldgroups`
--
ALTER TABLE `craft_fieldgroups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_fieldgroups_name_unq_idx` (`name`);

--
-- Indexes for table `craft_fieldlayoutfields`
--
ALTER TABLE `craft_fieldlayoutfields`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_fieldlayoutfields_layoutId_fieldId_unq_idx` (`layoutId`,`fieldId`),
  ADD KEY `craft_fieldlayoutfields_sortOrder_idx` (`sortOrder`),
  ADD KEY `craft_fieldlayoutfields_tabId_fk` (`tabId`),
  ADD KEY `craft_fieldlayoutfields_fieldId_fk` (`fieldId`);

--
-- Indexes for table `craft_fieldlayouts`
--
ALTER TABLE `craft_fieldlayouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_fieldlayouts_type_idx` (`type`);

--
-- Indexes for table `craft_fieldlayouttabs`
--
ALTER TABLE `craft_fieldlayouttabs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_fieldlayouttabs_sortOrder_idx` (`sortOrder`),
  ADD KEY `craft_fieldlayouttabs_layoutId_fk` (`layoutId`);

--
-- Indexes for table `craft_fields`
--
ALTER TABLE `craft_fields`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_fields_handle_context_unq_idx` (`handle`,`context`),
  ADD KEY `craft_fields_context_idx` (`context`),
  ADD KEY `craft_fields_groupId_fk` (`groupId`);

--
-- Indexes for table `craft_globalsets`
--
ALTER TABLE `craft_globalsets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_globalsets_name_unq_idx` (`name`),
  ADD UNIQUE KEY `craft_globalsets_handle_unq_idx` (`handle`),
  ADD KEY `craft_globalsets_fieldLayoutId_fk` (`fieldLayoutId`);

--
-- Indexes for table `craft_info`
--
ALTER TABLE `craft_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `craft_locales`
--
ALTER TABLE `craft_locales`
  ADD PRIMARY KEY (`locale`),
  ADD KEY `craft_locales_sortOrder_idx` (`sortOrder`);

--
-- Indexes for table `craft_matrixblocks`
--
ALTER TABLE `craft_matrixblocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_matrixblocks_ownerId_idx` (`ownerId`),
  ADD KEY `craft_matrixblocks_fieldId_idx` (`fieldId`),
  ADD KEY `craft_matrixblocks_typeId_idx` (`typeId`),
  ADD KEY `craft_matrixblocks_sortOrder_idx` (`sortOrder`),
  ADD KEY `craft_matrixblocks_ownerLocale_fk` (`ownerLocale`);

--
-- Indexes for table `craft_matrixblocktypes`
--
ALTER TABLE `craft_matrixblocktypes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_matrixblocktypes_name_fieldId_unq_idx` (`name`,`fieldId`),
  ADD UNIQUE KEY `craft_matrixblocktypes_handle_fieldId_unq_idx` (`handle`,`fieldId`),
  ADD KEY `craft_matrixblocktypes_fieldId_fk` (`fieldId`),
  ADD KEY `craft_matrixblocktypes_fieldLayoutId_fk` (`fieldLayoutId`);

--
-- Indexes for table `craft_matrixcontent_cudatamatrix`
--
ALTER TABLE `craft_matrixcontent_cudatamatrix`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_matrixcontent_cudatamatrix_elementId_locale_unq_idx` (`elementId`,`locale`),
  ADD KEY `craft_matrixcontent_cudatamatrix_locale_fk` (`locale`);

--
-- Indexes for table `craft_matrixcontent_hwidatamatrix`
--
ALTER TABLE `craft_matrixcontent_hwidatamatrix`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_matrixcontent_hwidatamatrix_elementId_locale_unq_idx` (`elementId`,`locale`),
  ADD KEY `craft_matrixcontent_hwidatamatrix_locale_fk` (`locale`);

--
-- Indexes for table `craft_matrixcontent_imagineif`
--
ALTER TABLE `craft_matrixcontent_imagineif`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_matrixcontent_imagineif_elementId_locale_unq_idx` (`elementId`,`locale`),
  ADD KEY `craft_matrixcontent_imagineif_locale_idx` (`locale`);

--
-- Indexes for table `craft_matrixcontent_wwudatamatrix`
--
ALTER TABLE `craft_matrixcontent_wwudatamatrix`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_matrixcontent_wwudatamatrix_elementId_locale_unq_idx` (`elementId`,`locale`),
  ADD KEY `craft_matrixcontent_wwudatamatrix_locale_fk` (`locale`);

--
-- Indexes for table `craft_migrations`
--
ALTER TABLE `craft_migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_migrations_version_unq_idx` (`version`),
  ADD KEY `craft_migrations_pluginId_fk` (`pluginId`);

--
-- Indexes for table `craft_oauth_providers`
--
ALTER TABLE `craft_oauth_providers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_oauth_providers_class_unq_idx` (`class`);

--
-- Indexes for table `craft_oauth_tokens`
--
ALTER TABLE `craft_oauth_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `craft_plugins`
--
ALTER TABLE `craft_plugins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `craft_rackspaceaccess`
--
ALTER TABLE `craft_rackspaceaccess`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_rackspaceaccess_connectionKey_unq_idx` (`connectionKey`);

--
-- Indexes for table `craft_relations`
--
ALTER TABLE `craft_relations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_relations_fieldId_sourceId_sourceLocale_targetId_unq_idx` (`fieldId`,`sourceId`,`sourceLocale`,`targetId`),
  ADD KEY `craft_relations_sourceId_fk` (`sourceId`),
  ADD KEY `craft_relations_sourceLocale_fk` (`sourceLocale`),
  ADD KEY `craft_relations_targetId_fk` (`targetId`);

--
-- Indexes for table `craft_routes`
--
ALTER TABLE `craft_routes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_routes_locale_idx` (`locale`),
  ADD KEY `craft_routes_urlPattern_idx` (`urlPattern`);

--
-- Indexes for table `craft_searchindex`
--
ALTER TABLE `craft_searchindex`
  ADD PRIMARY KEY (`elementId`,`attribute`,`fieldId`,`locale`);
ALTER TABLE `craft_searchindex` ADD FULLTEXT KEY `craft_searchindex_keywords_idx` (`keywords`);

--
-- Indexes for table `craft_sections`
--
ALTER TABLE `craft_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_sections_name_unq_idx` (`name`),
  ADD UNIQUE KEY `craft_sections_handle_unq_idx` (`handle`),
  ADD KEY `craft_sections_structureId_fk` (`structureId`);

--
-- Indexes for table `craft_sections_i18n`
--
ALTER TABLE `craft_sections_i18n`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_sections_i18n_sectionId_locale_unq_idx` (`sectionId`,`locale`),
  ADD KEY `craft_sections_i18n_locale_fk` (`locale`);

--
-- Indexes for table `craft_seomatic_meta`
--
ALTER TABLE `craft_seomatic_meta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_seomatic_meta_seoImageId_fk` (`seoImageId`),
  ADD KEY `craft_seomatic_meta_seoTwitterImageId_fk` (`seoTwitterImageId`),
  ADD KEY `craft_seomatic_meta_seoFacebookImageId_fk` (`seoFacebookImageId`);

--
-- Indexes for table `craft_seomatic_settings`
--
ALTER TABLE `craft_seomatic_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_seomatic_settings_siteSeoImageId_fk` (`siteSeoImageId`),
  ADD KEY `craft_seomatic_settings_siteSeoTwitterImageId_fk` (`siteSeoTwitterImageId`),
  ADD KEY `craft_seomatic_settings_siteSeoFacebookImageId_fk` (`siteSeoFacebookImageId`),
  ADD KEY `craft_seomatic_settings_genericOwnerImageId_fk` (`genericOwnerImageId`),
  ADD KEY `craft_seomatic_settings_genericCreatorImageId_fk` (`genericCreatorImageId`);

--
-- Indexes for table `craft_sessions`
--
ALTER TABLE `craft_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_sessions_uid_idx` (`uid`),
  ADD KEY `craft_sessions_token_idx` (`token`),
  ADD KEY `craft_sessions_dateUpdated_idx` (`dateUpdated`),
  ADD KEY `craft_sessions_userId_fk` (`userId`);

--
-- Indexes for table `craft_shunnedmessages`
--
ALTER TABLE `craft_shunnedmessages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_shunnedmessages_userId_message_unq_idx` (`userId`,`message`);

--
-- Indexes for table `craft_structureelements`
--
ALTER TABLE `craft_structureelements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_structureelements_structureId_elementId_unq_idx` (`structureId`,`elementId`),
  ADD KEY `craft_structureelements_root_idx` (`root`),
  ADD KEY `craft_structureelements_lft_idx` (`lft`),
  ADD KEY `craft_structureelements_rgt_idx` (`rgt`),
  ADD KEY `craft_structureelements_level_idx` (`level`),
  ADD KEY `craft_structureelements_elementId_fk` (`elementId`);

--
-- Indexes for table `craft_structures`
--
ALTER TABLE `craft_structures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `craft_systemsettings`
--
ALTER TABLE `craft_systemsettings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_systemsettings_category_unq_idx` (`category`);

--
-- Indexes for table `craft_taggroups`
--
ALTER TABLE `craft_taggroups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_taggroups_name_unq_idx` (`name`),
  ADD UNIQUE KEY `craft_taggroups_handle_unq_idx` (`handle`),
  ADD KEY `craft_taggroups_fieldLayoutId_fk` (`fieldLayoutId`);

--
-- Indexes for table `craft_tags`
--
ALTER TABLE `craft_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_tags_groupId_fk` (`groupId`);

--
-- Indexes for table `craft_tasks`
--
ALTER TABLE `craft_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_tasks_root_idx` (`root`),
  ADD KEY `craft_tasks_lft_idx` (`lft`),
  ADD KEY `craft_tasks_rgt_idx` (`rgt`),
  ADD KEY `craft_tasks_level_idx` (`level`);

--
-- Indexes for table `craft_templatecachecriteria`
--
ALTER TABLE `craft_templatecachecriteria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_templatecachecriteria_cacheId_fk` (`cacheId`),
  ADD KEY `craft_templatecachecriteria_type_idx` (`type`);

--
-- Indexes for table `craft_templatecacheelements`
--
ALTER TABLE `craft_templatecacheelements`
  ADD KEY `craft_templatecacheelements_cacheId_fk` (`cacheId`),
  ADD KEY `craft_templatecacheelements_elementId_fk` (`elementId`);

--
-- Indexes for table `craft_templatecaches`
--
ALTER TABLE `craft_templatecaches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_templatecaches_expiryDate_cacheKey_locale_path_idx` (`expiryDate`,`cacheKey`,`locale`,`path`),
  ADD KEY `craft_templatecaches_locale_fk` (`locale`);

--
-- Indexes for table `craft_tokens`
--
ALTER TABLE `craft_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_tokens_token_unq_idx` (`token`),
  ADD KEY `craft_tokens_expiryDate_idx` (`expiryDate`);

--
-- Indexes for table `craft_usergroups`
--
ALTER TABLE `craft_usergroups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_usergroups_name_unq_idx` (`name`),
  ADD UNIQUE KEY `craft_usergroups_handle_unq_idx` (`handle`);

--
-- Indexes for table `craft_usergroups_users`
--
ALTER TABLE `craft_usergroups_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_usergroups_users_groupId_userId_unq_idx` (`groupId`,`userId`),
  ADD KEY `craft_usergroups_users_userId_fk` (`userId`);

--
-- Indexes for table `craft_userpermissions`
--
ALTER TABLE `craft_userpermissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_userpermissions_name_unq_idx` (`name`);

--
-- Indexes for table `craft_userpermissions_usergroups`
--
ALTER TABLE `craft_userpermissions_usergroups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_userpermissions_usergroups_permissionId_groupId_unq_idx` (`permissionId`,`groupId`),
  ADD KEY `craft_userpermissions_usergroups_groupId_fk` (`groupId`);

--
-- Indexes for table `craft_userpermissions_users`
--
ALTER TABLE `craft_userpermissions_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_userpermissions_users_permissionId_userId_unq_idx` (`permissionId`,`userId`),
  ADD KEY `craft_userpermissions_users_userId_fk` (`userId`);

--
-- Indexes for table `craft_users`
--
ALTER TABLE `craft_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `craft_users_username_unq_idx` (`username`),
  ADD UNIQUE KEY `craft_users_email_unq_idx` (`email`),
  ADD KEY `craft_users_verificationCode_idx` (`verificationCode`),
  ADD KEY `craft_users_uid_idx` (`uid`),
  ADD KEY `craft_users_preferredLocale_fk` (`preferredLocale`);

--
-- Indexes for table `craft_widgets`
--
ALTER TABLE `craft_widgets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `craft_widgets_userId_fk` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `craft_assetfolders`
--
ALTER TABLE `craft_assetfolders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `craft_assetindexdata`
--
ALTER TABLE `craft_assetindexdata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `craft_assetsources`
--
ALTER TABLE `craft_assetsources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `craft_assettransformindex`
--
ALTER TABLE `craft_assettransformindex`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_assettransforms`
--
ALTER TABLE `craft_assettransforms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_categorygroups`
--
ALTER TABLE `craft_categorygroups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_categorygroups_i18n`
--
ALTER TABLE `craft_categorygroups_i18n`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_content`
--
ALTER TABLE `craft_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `craft_cpnav_layouts`
--
ALTER TABLE `craft_cpnav_layouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `craft_cpnav_navs`
--
ALTER TABLE `craft_cpnav_navs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `craft_deprecationerrors`
--
ALTER TABLE `craft_deprecationerrors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_elementindexsettings`
--
ALTER TABLE `craft_elementindexsettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `craft_elements`
--
ALTER TABLE `craft_elements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `craft_elements_i18n`
--
ALTER TABLE `craft_elements_i18n`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `craft_emailmessages`
--
ALTER TABLE `craft_emailmessages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_entrydrafts`
--
ALTER TABLE `craft_entrydrafts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_entrytypes`
--
ALTER TABLE `craft_entrytypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `craft_entryversions`
--
ALTER TABLE `craft_entryversions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `craft_fieldgroups`
--
ALTER TABLE `craft_fieldgroups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `craft_fieldlayoutfields`
--
ALTER TABLE `craft_fieldlayoutfields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=152;

--
-- AUTO_INCREMENT for table `craft_fieldlayouts`
--
ALTER TABLE `craft_fieldlayouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `craft_fieldlayouttabs`
--
ALTER TABLE `craft_fieldlayouttabs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `craft_fields`
--
ALTER TABLE `craft_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `craft_info`
--
ALTER TABLE `craft_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `craft_matrixblocktypes`
--
ALTER TABLE `craft_matrixblocktypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `craft_matrixcontent_cudatamatrix`
--
ALTER TABLE `craft_matrixcontent_cudatamatrix`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `craft_matrixcontent_hwidatamatrix`
--
ALTER TABLE `craft_matrixcontent_hwidatamatrix`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `craft_matrixcontent_imagineif`
--
ALTER TABLE `craft_matrixcontent_imagineif`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `craft_matrixcontent_wwudatamatrix`
--
ALTER TABLE `craft_matrixcontent_wwudatamatrix`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `craft_migrations`
--
ALTER TABLE `craft_migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `craft_oauth_providers`
--
ALTER TABLE `craft_oauth_providers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `craft_oauth_tokens`
--
ALTER TABLE `craft_oauth_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `craft_plugins`
--
ALTER TABLE `craft_plugins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `craft_rackspaceaccess`
--
ALTER TABLE `craft_rackspaceaccess`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_relations`
--
ALTER TABLE `craft_relations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `craft_routes`
--
ALTER TABLE `craft_routes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_sections`
--
ALTER TABLE `craft_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `craft_sections_i18n`
--
ALTER TABLE `craft_sections_i18n`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `craft_seomatic_settings`
--
ALTER TABLE `craft_seomatic_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `craft_sessions`
--
ALTER TABLE `craft_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `craft_shunnedmessages`
--
ALTER TABLE `craft_shunnedmessages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_structureelements`
--
ALTER TABLE `craft_structureelements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_structures`
--
ALTER TABLE `craft_structures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_systemsettings`
--
ALTER TABLE `craft_systemsettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `craft_taggroups`
--
ALTER TABLE `craft_taggroups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `craft_tasks`
--
ALTER TABLE `craft_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_templatecachecriteria`
--
ALTER TABLE `craft_templatecachecriteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_templatecaches`
--
ALTER TABLE `craft_templatecaches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_tokens`
--
ALTER TABLE `craft_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_usergroups`
--
ALTER TABLE `craft_usergroups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_usergroups_users`
--
ALTER TABLE `craft_usergroups_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_userpermissions`
--
ALTER TABLE `craft_userpermissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_userpermissions_usergroups`
--
ALTER TABLE `craft_userpermissions_usergroups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_userpermissions_users`
--
ALTER TABLE `craft_userpermissions_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `craft_widgets`
--
ALTER TABLE `craft_widgets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `craft_assetfiles`
--
ALTER TABLE `craft_assetfiles`
  ADD CONSTRAINT `craft_assetfiles_folderId_fk` FOREIGN KEY (`folderId`) REFERENCES `craft_assetfolders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_assetfiles_id_fk` FOREIGN KEY (`id`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_assetfiles_sourceId_fk` FOREIGN KEY (`sourceId`) REFERENCES `craft_assetsources` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_assetfolders`
--
ALTER TABLE `craft_assetfolders`
  ADD CONSTRAINT `craft_assetfolders_parentId_fk` FOREIGN KEY (`parentId`) REFERENCES `craft_assetfolders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_assetfolders_sourceId_fk` FOREIGN KEY (`sourceId`) REFERENCES `craft_assetsources` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_assetindexdata`
--
ALTER TABLE `craft_assetindexdata`
  ADD CONSTRAINT `craft_assetindexdata_sourceId_fk` FOREIGN KEY (`sourceId`) REFERENCES `craft_assetsources` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_assetsources`
--
ALTER TABLE `craft_assetsources`
  ADD CONSTRAINT `craft_assetsources_fieldLayoutId_fk` FOREIGN KEY (`fieldLayoutId`) REFERENCES `craft_fieldlayouts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `craft_categories`
--
ALTER TABLE `craft_categories`
  ADD CONSTRAINT `craft_categories_groupId_fk` FOREIGN KEY (`groupId`) REFERENCES `craft_categorygroups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_categories_id_fk` FOREIGN KEY (`id`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_categorygroups`
--
ALTER TABLE `craft_categorygroups`
  ADD CONSTRAINT `craft_categorygroups_fieldLayoutId_fk` FOREIGN KEY (`fieldLayoutId`) REFERENCES `craft_fieldlayouts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `craft_categorygroups_structureId_fk` FOREIGN KEY (`structureId`) REFERENCES `craft_structures` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_categorygroups_i18n`
--
ALTER TABLE `craft_categorygroups_i18n`
  ADD CONSTRAINT `craft_categorygroups_i18n_groupId_fk` FOREIGN KEY (`groupId`) REFERENCES `craft_categorygroups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_categorygroups_i18n_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `craft_content`
--
ALTER TABLE `craft_content`
  ADD CONSTRAINT `craft_content_elementId_fk` FOREIGN KEY (`elementId`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_content_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `craft_cpnav_navs`
--
ALTER TABLE `craft_cpnav_navs`
  ADD CONSTRAINT `craft_cpnav_navs_layoutId_fk` FOREIGN KEY (`layoutId`) REFERENCES `craft_cpnav_layouts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `craft_elements_i18n`
--
ALTER TABLE `craft_elements_i18n`
  ADD CONSTRAINT `craft_elements_i18n_elementId_fk` FOREIGN KEY (`elementId`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_elements_i18n_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `craft_emailmessages`
--
ALTER TABLE `craft_emailmessages`
  ADD CONSTRAINT `craft_emailmessages_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `craft_entries`
--
ALTER TABLE `craft_entries`
  ADD CONSTRAINT `craft_entries_authorId_fk` FOREIGN KEY (`authorId`) REFERENCES `craft_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_entries_id_fk` FOREIGN KEY (`id`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_entries_sectionId_fk` FOREIGN KEY (`sectionId`) REFERENCES `craft_sections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_entries_typeId_fk` FOREIGN KEY (`typeId`) REFERENCES `craft_entrytypes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_entrydrafts`
--
ALTER TABLE `craft_entrydrafts`
  ADD CONSTRAINT `craft_entrydrafts_creatorId_fk` FOREIGN KEY (`creatorId`) REFERENCES `craft_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_entrydrafts_entryId_fk` FOREIGN KEY (`entryId`) REFERENCES `craft_entries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_entrydrafts_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `craft_entrydrafts_sectionId_fk` FOREIGN KEY (`sectionId`) REFERENCES `craft_sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_entrytypes`
--
ALTER TABLE `craft_entrytypes`
  ADD CONSTRAINT `craft_entrytypes_fieldLayoutId_fk` FOREIGN KEY (`fieldLayoutId`) REFERENCES `craft_fieldlayouts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `craft_entrytypes_sectionId_fk` FOREIGN KEY (`sectionId`) REFERENCES `craft_sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_entryversions`
--
ALTER TABLE `craft_entryversions`
  ADD CONSTRAINT `craft_entryversions_creatorId_fk` FOREIGN KEY (`creatorId`) REFERENCES `craft_users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `craft_entryversions_entryId_fk` FOREIGN KEY (`entryId`) REFERENCES `craft_entries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_entryversions_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `craft_entryversions_sectionId_fk` FOREIGN KEY (`sectionId`) REFERENCES `craft_sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_fieldlayoutfields`
--
ALTER TABLE `craft_fieldlayoutfields`
  ADD CONSTRAINT `craft_fieldlayoutfields_fieldId_fk` FOREIGN KEY (`fieldId`) REFERENCES `craft_fields` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_fieldlayoutfields_layoutId_fk` FOREIGN KEY (`layoutId`) REFERENCES `craft_fieldlayouts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_fieldlayoutfields_tabId_fk` FOREIGN KEY (`tabId`) REFERENCES `craft_fieldlayouttabs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_fieldlayouttabs`
--
ALTER TABLE `craft_fieldlayouttabs`
  ADD CONSTRAINT `craft_fieldlayouttabs_layoutId_fk` FOREIGN KEY (`layoutId`) REFERENCES `craft_fieldlayouts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_fields`
--
ALTER TABLE `craft_fields`
  ADD CONSTRAINT `craft_fields_groupId_fk` FOREIGN KEY (`groupId`) REFERENCES `craft_fieldgroups` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_globalsets`
--
ALTER TABLE `craft_globalsets`
  ADD CONSTRAINT `craft_globalsets_fieldLayoutId_fk` FOREIGN KEY (`fieldLayoutId`) REFERENCES `craft_fieldlayouts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `craft_globalsets_id_fk` FOREIGN KEY (`id`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_matrixblocks`
--
ALTER TABLE `craft_matrixblocks`
  ADD CONSTRAINT `craft_matrixblocks_fieldId_fk` FOREIGN KEY (`fieldId`) REFERENCES `craft_fields` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_matrixblocks_id_fk` FOREIGN KEY (`id`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_matrixblocks_ownerId_fk` FOREIGN KEY (`ownerId`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_matrixblocks_ownerLocale_fk` FOREIGN KEY (`ownerLocale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `craft_matrixblocks_typeId_fk` FOREIGN KEY (`typeId`) REFERENCES `craft_matrixblocktypes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_matrixblocktypes`
--
ALTER TABLE `craft_matrixblocktypes`
  ADD CONSTRAINT `craft_matrixblocktypes_fieldId_fk` FOREIGN KEY (`fieldId`) REFERENCES `craft_fields` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_matrixblocktypes_fieldLayoutId_fk` FOREIGN KEY (`fieldLayoutId`) REFERENCES `craft_fieldlayouts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `craft_matrixcontent_cudatamatrix`
--
ALTER TABLE `craft_matrixcontent_cudatamatrix`
  ADD CONSTRAINT `craft_matrixcontent_cudatamatrix_elementId_fk` FOREIGN KEY (`elementId`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_matrixcontent_cudatamatrix_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `craft_matrixcontent_hwidatamatrix`
--
ALTER TABLE `craft_matrixcontent_hwidatamatrix`
  ADD CONSTRAINT `craft_matrixcontent_hwidatamatrix_elementId_fk` FOREIGN KEY (`elementId`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_matrixcontent_hwidatamatrix_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `craft_matrixcontent_imagineif`
--
ALTER TABLE `craft_matrixcontent_imagineif`
  ADD CONSTRAINT `craft_matrixcontent_imagineif_elementId_fk` FOREIGN KEY (`elementId`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_matrixcontent_imagineif_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `craft_matrixcontent_wwudatamatrix`
--
ALTER TABLE `craft_matrixcontent_wwudatamatrix`
  ADD CONSTRAINT `craft_matrixcontent_wwudatamatrix_elementId_fk` FOREIGN KEY (`elementId`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_matrixcontent_wwudatamatrix_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `craft_migrations`
--
ALTER TABLE `craft_migrations`
  ADD CONSTRAINT `craft_migrations_pluginId_fk` FOREIGN KEY (`pluginId`) REFERENCES `craft_plugins` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_relations`
--
ALTER TABLE `craft_relations`
  ADD CONSTRAINT `craft_relations_fieldId_fk` FOREIGN KEY (`fieldId`) REFERENCES `craft_fields` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_relations_sourceId_fk` FOREIGN KEY (`sourceId`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_relations_sourceLocale_fk` FOREIGN KEY (`sourceLocale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `craft_relations_targetId_fk` FOREIGN KEY (`targetId`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_routes`
--
ALTER TABLE `craft_routes`
  ADD CONSTRAINT `craft_routes_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `craft_sections`
--
ALTER TABLE `craft_sections`
  ADD CONSTRAINT `craft_sections_structureId_fk` FOREIGN KEY (`structureId`) REFERENCES `craft_structures` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `craft_sections_i18n`
--
ALTER TABLE `craft_sections_i18n`
  ADD CONSTRAINT `craft_sections_i18n_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `craft_sections_i18n_sectionId_fk` FOREIGN KEY (`sectionId`) REFERENCES `craft_sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_seomatic_meta`
--
ALTER TABLE `craft_seomatic_meta`
  ADD CONSTRAINT `craft_seomatic_meta_id_fk` FOREIGN KEY (`id`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_seomatic_meta_seoFacebookImageId_fk` FOREIGN KEY (`seoFacebookImageId`) REFERENCES `craft_assetfiles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `craft_seomatic_meta_seoImageId_fk` FOREIGN KEY (`seoImageId`) REFERENCES `craft_assetfiles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `craft_seomatic_meta_seoTwitterImageId_fk` FOREIGN KEY (`seoTwitterImageId`) REFERENCES `craft_assetfiles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `craft_seomatic_settings`
--
ALTER TABLE `craft_seomatic_settings`
  ADD CONSTRAINT `craft_seomatic_settings_genericCreatorImageId_fk` FOREIGN KEY (`genericCreatorImageId`) REFERENCES `craft_assetfiles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `craft_seomatic_settings_genericOwnerImageId_fk` FOREIGN KEY (`genericOwnerImageId`) REFERENCES `craft_assetfiles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `craft_seomatic_settings_siteSeoFacebookImageId_fk` FOREIGN KEY (`siteSeoFacebookImageId`) REFERENCES `craft_assetfiles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `craft_seomatic_settings_siteSeoImageId_fk` FOREIGN KEY (`siteSeoImageId`) REFERENCES `craft_assetfiles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `craft_seomatic_settings_siteSeoTwitterImageId_fk` FOREIGN KEY (`siteSeoTwitterImageId`) REFERENCES `craft_assetfiles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `craft_sessions`
--
ALTER TABLE `craft_sessions`
  ADD CONSTRAINT `craft_sessions_userId_fk` FOREIGN KEY (`userId`) REFERENCES `craft_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_shunnedmessages`
--
ALTER TABLE `craft_shunnedmessages`
  ADD CONSTRAINT `craft_shunnedmessages_userId_fk` FOREIGN KEY (`userId`) REFERENCES `craft_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_structureelements`
--
ALTER TABLE `craft_structureelements`
  ADD CONSTRAINT `craft_structureelements_elementId_fk` FOREIGN KEY (`elementId`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_structureelements_structureId_fk` FOREIGN KEY (`structureId`) REFERENCES `craft_structures` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_taggroups`
--
ALTER TABLE `craft_taggroups`
  ADD CONSTRAINT `craft_taggroups_fieldLayoutId_fk` FOREIGN KEY (`fieldLayoutId`) REFERENCES `craft_fieldlayouts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `craft_tags`
--
ALTER TABLE `craft_tags`
  ADD CONSTRAINT `craft_tags_groupId_fk` FOREIGN KEY (`groupId`) REFERENCES `craft_taggroups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_tags_id_fk` FOREIGN KEY (`id`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_templatecachecriteria`
--
ALTER TABLE `craft_templatecachecriteria`
  ADD CONSTRAINT `craft_templatecachecriteria_cacheId_fk` FOREIGN KEY (`cacheId`) REFERENCES `craft_templatecaches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_templatecacheelements`
--
ALTER TABLE `craft_templatecacheelements`
  ADD CONSTRAINT `craft_templatecacheelements_cacheId_fk` FOREIGN KEY (`cacheId`) REFERENCES `craft_templatecaches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_templatecacheelements_elementId_fk` FOREIGN KEY (`elementId`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_templatecaches`
--
ALTER TABLE `craft_templatecaches`
  ADD CONSTRAINT `craft_templatecaches_locale_fk` FOREIGN KEY (`locale`) REFERENCES `craft_locales` (`locale`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `craft_usergroups_users`
--
ALTER TABLE `craft_usergroups_users`
  ADD CONSTRAINT `craft_usergroups_users_groupId_fk` FOREIGN KEY (`groupId`) REFERENCES `craft_usergroups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_usergroups_users_userId_fk` FOREIGN KEY (`userId`) REFERENCES `craft_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_userpermissions_usergroups`
--
ALTER TABLE `craft_userpermissions_usergroups`
  ADD CONSTRAINT `craft_userpermissions_usergroups_groupId_fk` FOREIGN KEY (`groupId`) REFERENCES `craft_usergroups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_userpermissions_usergroups_permissionId_fk` FOREIGN KEY (`permissionId`) REFERENCES `craft_userpermissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_userpermissions_users`
--
ALTER TABLE `craft_userpermissions_users`
  ADD CONSTRAINT `craft_userpermissions_users_permissionId_fk` FOREIGN KEY (`permissionId`) REFERENCES `craft_userpermissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_userpermissions_users_userId_fk` FOREIGN KEY (`userId`) REFERENCES `craft_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `craft_users`
--
ALTER TABLE `craft_users`
  ADD CONSTRAINT `craft_users_id_fk` FOREIGN KEY (`id`) REFERENCES `craft_elements` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `craft_users_preferredLocale_fk` FOREIGN KEY (`preferredLocale`) REFERENCES `craft_locales` (`locale`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `craft_widgets`
--
ALTER TABLE `craft_widgets`
  ADD CONSTRAINT `craft_widgets_userId_fk` FOREIGN KEY (`userId`) REFERENCES `craft_users` (`id`) ON DELETE CASCADE;
