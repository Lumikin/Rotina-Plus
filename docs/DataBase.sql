CREATE DATABASE IF NOT EXISTS `rotinaplus-uuid` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `rotinaplus-uuid`;

-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: rotinaplus-uuid
-- ------------------------------------------------------
-- Server version	8.0.45
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
-- Table structure for table `autenticacao`
--
DROP TABLE IF EXISTS `autenticacao`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `autenticacao` (
    `UUID` char(36) NOT NULL,
    `userId` char(36) NOT NULL,
    `hashCode` varchar(255) NOT NULL,
    `isvalid` tinyint (1) NOT NULL DEFAULT '0',
    `expirationDate` datetime NOT NULL,
    `dataCad` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`UUID`, `userId`),
    KEY `user_UUID_idx` (`userId`),
    CONSTRAINT `user_UUID_autentication` FOREIGN KEY (`userId`) REFERENCES `usuarios` (`UUID`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pontos`
--
DROP TABLE IF EXISTS `pontos`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `pontos` (
    `UUID` char(36) NOT NULL,
    `tarefaId` char(36) NOT NULL,
    `pontos` int NOT NULL,
    `dataCad` varchar(45) NOT NULL,
    PRIMARY KEY (`UUID`, `tarefaId`),
    KEY `tarefa_UUID_pontos_idx` (`tarefaId`),
    CONSTRAINT `tarefa_UUID_pontos` FOREIGN KEY (`tarefaId`) REFERENCES `tarefas` (`UUID`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tarefas`
--
DROP TABLE IF EXISTS `tarefas`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `tarefas` (
    `UUID` char(36) NOT NULL,
    `userId` char(36) NOT NULL,
    `nome` varchar(64) NOT NULL,
    `descricao` varchar(255) NOT NULL,
    `dataTarefa` datetime NOT NULL,
    `prioridade` enum ('Baixa', 'Media', 'Alta') NOT NULL,
    `status` enum ('Pendente', 'Em andamento', 'Concluida') NOT NULL,
    `DataCad` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`UUID`, `userId`),
    KEY `user_UUID_idx` (`userId`),
    CONSTRAINT `user_UUID_tarefas` FOREIGN KEY (`userId`) REFERENCES `usuarios` (`UUID`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--
DROP TABLE IF EXISTS `usuarios`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `usuarios` (
    `UUID` char(36) NOT NULL,
    `nome` varchar(64) NOT NULL,
    `email` varchar(255) NOT NULL,
    `dataNascimento` date NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    PRIMARY KEY (`UUID`),
    UNIQUE KEY `email` (`email`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-10 13:13:08