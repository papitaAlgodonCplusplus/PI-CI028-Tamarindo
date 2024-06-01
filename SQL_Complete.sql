-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: hotel
-- ------------------------------------------------------
-- Server version	8.0.36

DROP SCHEMA hotel;
CREATE SCHEMA hotel;usersusersimagesimagesroomsroomsimagesimages
USE hotel;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card` (
  `paymentid` int NOT NULL AUTO_INCREMENT,
  `card_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`paymentid`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card`
--

LOCK TABLES `card` WRITE;
/*!40000 ALTER TABLE `card` DISABLE KEYS */;
INSERT INTO `card` VALUES (1,'Mastercard'),(2,'Mastercard'),(3,'Mastercard'),(4,'Mastercard'),(5,'Mastercard'),(6,'Mastercard'),(7,'Mastercard'),(8,'Mastercard'),(9,'Mastercard'),(10,'Mastercard'),(11,'Mastercard'),(12,'Mastercard'),(13,'Mastercard'),(14,'Mastercard'),(15,'Mastercard'),(16,'Mastercard'),(17,'Mastercard'),(18,'Mastercard'),(19,'Mastercard'),(20,'Mastercard'),(21,'Mastercard'),(22,'Mastercard'),(23,'Mastercard'),(24,'Mastercard');
/*!40000 ALTER TABLE `card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cash`
--

DROP TABLE IF EXISTS `cash`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash` (
  `paymentid` int NOT NULL AUTO_INCREMENT,
  `change_amount` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`paymentid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash`
--

LOCK TABLES `cash` WRITE;
/*!40000 ALTER TABLE `cash` DISABLE KEYS */;
/*!40000 ALTER TABLE `cash` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `categoryid` int NOT NULL AUTO_INCREMENT,
  `class_name` varchar(50) NOT NULL,
  `price` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`categoryid`),
  UNIQUE KEY `class_name` (`class_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Deluxe',700000);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `imageid` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `filepath` varchar(255) NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `room_id` int DEFAULT NULL,
  PRIMARY KEY (`imageid`),
  KEY `rooms_imgs_ibfk_1` (`room_id`),
  CONSTRAINT `rooms_imgs_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`roomid`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (94,'1717188738312-Screenshot2024-05-27163855.png','client/public/upload/1717188738312-Screenshot2024-05-27163855.png','2024-05-31 20:52:18',NULL),(95,'1717195137299-Capturadepantalla2024-05-31121238.png','client/public/upload/1717195137299-Capturadepantalla2024-05-31121238.png','2024-05-31 22:38:57',40),(96,'1717195137300-Capturadepantalla2024-05-31131512.png','client/public/upload/1717195137300-Capturadepantalla2024-05-31131512.png','2024-05-31 22:38:57',40);
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `paymentid` int NOT NULL AUTO_INCREMENT,
  `price` float NOT NULL DEFAULT '0',
  `id_method` int DEFAULT NULL,
  PRIMARY KEY (`paymentid`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (7,1400000,1),(8,1400000,1),(9,1400000,1),(10,700000,1),(11,700000,1),(12,700000,1),(13,700000,1),(14,700000,1),(15,700000,1),(16,700000,1),(17,700000,1),(18,700000,1),(19,700000,1),(20,700000,1),(21,700000,1),(22,700000,1),(23,700000,1),(24,700000,1),(25,700000,1),(26,700000,1),(27,700000,1),(28,700000,1),(29,700000,1),(30,700000,1),(31,700000,1),(32,700000,1),(33,700000,1);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `reservationid` int NOT NULL AUTO_INCREMENT,
  `check_in` datetime NOT NULL,
  `check_out` datetime NOT NULL,
  `user_id` int DEFAULT NULL,
  `payment_id` int DEFAULT NULL,
  `id_room` int DEFAULT NULL,
  PRIMARY KEY (`reservationid`),
  UNIQUE KEY `payment_id` (`payment_id`),
  KEY `user_id` (`user_id`),
  KEY `reservations_ibfk_3` (`id_room`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`),
  CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`paymentid`),
  CONSTRAINT `reservations_ibfk_3` FOREIGN KEY (`id_room`) REFERENCES `rooms` (`roomid`),
  CONSTRAINT `check_datetime_order` CHECK ((`check_in` < `check_out`))
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (27,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,20,40),(28,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,21,40),(29,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,22,40),(30,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,23,40),(31,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,24,40),(32,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,25,40),(33,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,26,40),(34,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,27,40),(35,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,28,40),(36,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,29,40),(37,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,30,40),(38,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,31,40),(39,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,32,40),(40,'2024-12-11 07:00:00','2024-12-29 18:00:00',23,33,40);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `roomid` int NOT NULL AUTO_INCREMENT,
  `description` text,
  `title` varchar(50) DEFAULT NULL,
  `type_of_room` int DEFAULT NULL,
  PRIMARY KEY (`roomid`),
  KEY `rooms_ibfk_1` (`type_of_room`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`type_of_room`) REFERENCES `categories` (`categoryid`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (40,'F','Room 1',1);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `serviceid` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(50) NOT NULL,
  `service_price` float NOT NULL DEFAULT '0',
  `image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`serviceid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services_log`
--

DROP TABLE IF EXISTS `services_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_log` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `reservation_id` int NOT NULL,
  PRIMARY KEY (`service_id`),
  KEY `reservationid` (`reservation_id`),
  CONSTRAINT `services_log_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`serviceid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services_log`
--

LOCK TABLES `services_log` WRITE;
/*!40000 ALTER TABLE `services_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `services_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `paymentid` int NOT NULL AUTO_INCREMENT,
  `bank` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`paymentid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `rol` varchar(50) DEFAULT NULL,
  `imageid` int DEFAULT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `email` (`email`),
  KEY `users_imgs_ibfk_1` (`imageid`),
  CONSTRAINT `users_imgs_ibfk_1` FOREIGN KEY (`imageid`) REFERENCES `images` (`imageid`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (22,'Meow','ing','alexquesada22@gmail.com','$2a$10$OodAdby50BrNIzGgOTdVNerx9J1r.Wkrj.cNcOdeXr4EokY8lB.Ku','client',94),(23,'Alex','Q','alexquesada20@gmail.com','$2a$10$OodAdby50BrNIzGgOTdVNerx9J1r.Wkrj.cNcOdeXr4EokY8lB.Ku','admin',94);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'hotel'
--

--
-- Dumping routines for database 'hotel'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-01 10:00:34
