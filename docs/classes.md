# Diagrama de Classes

Esse documento mostra as principais classes do sistema e os relacionamentos entre elas.

---

# Classe: Clientes

## Descrição
Essa classe representa os clientes cadastrados no sistema.

## Atributos
- clienteID : number
- nome : string
- email : string
- data_Nascimento : date
- password_hash : string

## Métodos
- cadastrarCliente()
- atualizarCliente()
- login()

```mermaid
classDiagram

class Clientes {
  +number clienteID
  +string nome
  +string email
  +date data_Nascimento
  +string password_hash

  +cadastrarCliente()
  +atualizarCliente()
  +login()
}
```

---

# Classe: Tarefas

## Descrição
Essa classe representa as tarefas criadas pelos clientes.

## Atributos
- tarefaID : number
- nome : string
- descricao : string
- dataTarefa : datetime
- dataCad : datetime
- prioridade : enum
- clienteID : number
- status : enum

## Métodos
- criarTarefa()
- editarTarefa()
- excluirTarefa()

```mermaid
classDiagram

class Tarefas {
  +number tarefaID
  +string nome
  +string descricao
  +datetime dataTarefa
  +datetime dataCad
  +enum prioridade
  +number clienteID
  +enum status

  +criarTarefa()
  +editarTarefa()
  +excluirTarefa()
}
```

---

# Classe: Pontos

## Descrição
Essa classe guarda os pontos que o cliente ganhou ao completar tarefas.

## Atributos
- pontoID : number
- clienteID : number
- tarefaID : number
- pontos : number
- dataRegistro : date

## Métodos
- adicionarPontos()
- mostrarPontos()

```mermaid
classDiagram

class Pontos {
  +number pontoID
  +number clienteID
  +number tarefaID
  +number pontos
  +date dataRegistro

  +adicionarPontos()
  +mostrarPontos()
}
```

---

# Classe: Clientes_Log

## Descrição
Essa classe salva o histórico de login dos clientes.

## Atributos
- logID : number
- clienteID : number
- data_Login : datetime

## Métodos
- registrarLogin()

```mermaid
classDiagram

class Clientes_Log {
  +number logID
  +number clienteID
  +datetime data_Login

  +registrarLogin()
}
```

---

# Relacionamentos

## Clientes e Tarefas

Um cliente pode ter várias tarefas.

```mermaid
classDiagram

Clientes "1" --> "*" Tarefas : possui
```

---

## Clientes e Pontos

Um cliente pode ter vários registros de pontos.

```mermaid
classDiagram

Clientes "1" --> "*" Pontos : ganha
```

---

## Tarefas e Pontos

Uma tarefa pode gerar pontos.

```mermaid
classDiagram

Tarefas "1" --> "*" Pontos : gera
```

---

## Clientes e Clientes_Log

Um cliente pode ter vários registros de login.

```mermaid
classDiagram

Clientes "1" --> "*" Clientes_Log : registra
```

---

# Diagrama Completo

```mermaid
classDiagram

class Clientes {
  +number clienteID
  +string nome
  +string email
  +date data_Nascimento
  +string password_hash

  +cadastrarCliente()
  +atualizarCliente()
  +login()
}

class Tarefas {
  +number tarefaID
  +string nome
  +string descricao
  +datetime dataTarefa
  +datetime dataCad
  +enum prioridade
  +number clienteID
  +enum status

  +criarTarefa()
  +editarTarefa()
  +excluirTarefa()
}

class Pontos {
  +number pontoID
  +number clienteID
  +number tarefaID
  +number pontos
  +date dataRegistro

  +adicionarPontos()
  +mostrarPontos()
}

class Clientes_Log {
  +number logID
  +number clienteID
  +datetime data_Login

  +registrarLogin()
}

Clientes "1" --> "*" Tarefas : possui
Clientes "1" --> "*" Pontos : ganha
Tarefas "1" --> "*" Pontos : gera
Clientes "1" --> "*" Clientes_Log : registra
```