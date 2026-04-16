# 🗄️ Modelo de Dados

Este documento apresenta o modelo de dados do sistema, com foco nas entidades e seus relacionamentos.

## 📦 Entidade: Produto

![Entidade Produto](./produto.png)

### 📌 Descrição
Representa os produtos disponíveis para venda.

### 🧾 Atributos
| Tipo | Nome | Atributos |
| :--- | :---: | ---: |
| INT | clienteId | NN AI PK |
| VARCHAR(64)| Nome | NN |
| VARCHAR(255)| Email | NN |

## 👤 Entidade: Cliente

![Entidade Cliente](./cliente.png)

### 📌 Descrição
Representa os clientes do sistema.

### 🧾 Atributos
- id (PK)
- nome
- email
- telefone

## 🧾 Entidade: Venda

![Entidade Venda](./venda.png)

### 📌 Descrição
Representa uma transação de compra realizada por um cliente.

### 🧾 Atributos
- id (PK)
- cliente_id (FK)
- data
- valor_total

## 🔗 Relacionamento: Venda x ItensVenda

![Relacionamento Venda Itens](./venda-itens.png)

### 📌 Descrição
Uma venda pode conter vários itens.

### 🧾 Estrutura (ItensVenda)
- id (PK)
- venda_id (FK)
- produto_id (FK)
- quantidade
- preco_unitario