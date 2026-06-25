CREATE DATABASE IF NOT EXISTS `rotinaplus`
;
USE `rotinaplus`;

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes` (
  `ClienteID` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(64) NOT NULL,
  `email` varchar(255) NOT NULL,
  `Data_Nascimento` date NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`ClienteID`),
  UNIQUE KEY `email` (`email`)
);
--
-- Table structure for table `clientes_log`
--
DROP TABLE IF EXISTS `clientes_log`;
CREATE TABLE `clientes_log` (
  `LogID` int NOT NULL AUTO_INCREMENT,
  `ClienteID` int NOT NULL,
  `Data_Login` datetime NOT NULL,
  PRIMARY KEY (`LogID`),
  KEY `fk_log_cliente` (`ClienteID`),
  CONSTRAINT `fk_log_cliente` FOREIGN KEY (`ClienteID`) REFERENCES `clientes` (`ClienteID`) ON DELETE RESTRICT ON UPDATE RESTRICT
);
/*!40101 SET character_set_client = @saved_cs_client */
;
--
-- Table structure for table `pontos`
--
DROP TABLE IF EXISTS `pontos`;
CREATE TABLE `pontos` (
  `PontoID` int NOT NULL AUTO_INCREMENT,
  `ClienteID` int NOT NULL,
  `TarefaID` int NOT NULL,
  `Pontos` int NOT NULL,
  `DataRegistro` date NOT NULL,
  PRIMARY KEY (`PontoID`),
  KEY `fk_pontos_cliente` (`ClienteID`),
  KEY `fk_pontos_tarefa` (`TarefaID`),
  CONSTRAINT `fk_pontos_cliente` FOREIGN KEY (`ClienteID`) REFERENCES `clientes` (`ClienteID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_pontos_tarefa` FOREIGN KEY (`TarefaID`) REFERENCES `tarefas` (`tarefaID`) ON DELETE RESTRICT ON UPDATE RESTRICT
);
--
-- Table structure for table `tarefas`
--
DROP TABLE IF EXISTS `tarefas`;

CREATE TABLE `tarefas` (
  `tarefaID` int NOT NULL AUTO_INCREMENT,
  `ClienteID` int NOT NULL,
  `Nome` varchar(64) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `DataTarefa` datetime NOT NULL,
  `DataCad` datetime NOT NULL,
  `Prioridade` enum('Baixa', 'Media', 'Alta') NOT NULL,
  `Status` enum('Pendente', 'Em andamento', 'Concluida') NOT NULL,
  PRIMARY KEY (`tarefaID`),
  KEY `fk_tarefa_cliente` (`ClienteID`),
  CONSTRAINT `fk_tarefa_cliente` FOREIGN KEY (`ClienteID`) REFERENCES `clientes` (`ClienteID`) ON DELETE RESTRICT ON UPDATE RESTRICT
);