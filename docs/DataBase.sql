  CREATE DATABASE IF NOT EXISTS `rotinaplus` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

  USE `rotinaplus`;

  --
  -- Table structure for table `autentication`
  --
  DROP TABLE IF EXISTS `autentication`;

  CREATE TABLE
    `autentication` (
      `id` int NOT NULL AUTO_INCREMENT,
      `userId` int NOT NULL,
      `token` varchar(255) NOT NULL,
      `isvalid` tinyint (1) NOT NULL DEFAULT '0',
      `expiration_date` datetime NOT NULL,
      `dataCad` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`, `userId`),
      UNIQUE KEY `token_UNIQUE` (`token`),
      KEY `fk_ClienteID_idCliente_idx` (`userId`)
    );

  --
  -- Table structure for table `clientes_log`
  --
  DROP TABLE IF EXISTS `clientes_log`;

  CREATE TABLE
    `clientes_log` (
      `LogID` int NOT NULL AUTO_INCREMENT,
      `ClienteID` int NOT NULL,
      `Data_Login` datetime NOT NULL,
      PRIMARY KEY (`LogID`),
      KEY `fk_log_cliente` (`ClienteID`),
      CONSTRAINT `fk_log_cliente` FOREIGN KEY (`ClienteID`) REFERENCES `users` (`userId`) ON DELETE RESTRICT ON UPDATE RESTRICT
    );

  --
  -- Table structure for table `pontos`
  --
  DROP TABLE IF EXISTS `pontos`;

  CREATE TABLE
    `pontos` (
      `PontoID` int NOT NULL AUTO_INCREMENT,
      `ClienteID` int NOT NULL,
      `TarefaID` int NOT NULL,
      `Pontos` int NOT NULL,
      `DataRegistro` date NOT NULL,
      PRIMARY KEY (`PontoID`),
      KEY `fk_pontos_cliente` (`ClienteID`),
      KEY `fk_pontos_tarefa` (`TarefaID`),
      CONSTRAINT `fk_pontos_cliente` FOREIGN KEY (`ClienteID`) REFERENCES `users` (`userId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
      CONSTRAINT `fk_pontos_tarefa` FOREIGN KEY (`TarefaID`) REFERENCES `tarefas` (`tarefaId`) ON DELETE RESTRICT ON UPDATE RESTRICT
    );

  --
  -- Table structure for table `tarefas`
  --
  DROP TABLE IF EXISTS `tarefas`;

  CREATE TABLE
    `tarefas` (
      `tarefaId` int NOT NULL AUTO_INCREMENT,
      `userId` int NOT NULL,
      `nome` varchar(64) NOT NULL,
      `descricao` varchar(255) NOT NULL,
      `dataTarefa` datetime NOT NULL,
      `Prioridade` enum ('Baixa', 'Media', 'Alta') NOT NULL,
      `Status` enum ('Pendente', 'Em andamento', 'Concluida') NOT NULL,
      `DataCad` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`tarefaId`),
      KEY `fk_tarefa_cliente` (`userId`),
      CONSTRAINT `fk_tarefa_cliente` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE RESTRICT ON UPDATE RESTRICT
    );

  --
  -- Table structure for table `users`
  --
  DROP TABLE IF EXISTS `users`;

  CREATE TABLE
    `users` (
      `userId` int NOT NULL AUTO_INCREMENT,
      `nome` varchar(64) NOT NULL,
      `email` varchar(255) NOT NULL,
      `dataNascimento` date NOT NULL,
      `password_hash` varchar(255) NOT NULL,
      PRIMARY KEY (`userId`),
      UNIQUE KEY `email` (`email`)
    );