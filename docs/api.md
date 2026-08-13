# Documentação do Backend - Rotina-Plus

Esta documentação detalha as rotas do backend da API do projeto **Rotina-Plus**, especificando os endpoints, métodos HTTP, corpos de requisição (`Body`) esperados e os códigos de status de retorno (`Status Codes`).

---

## Sumário
1. [Autenticação (`/auth`)](#1-autenticação-auth)
2. [Usuários (`/api/users`)](#2-usuários-apiusers)
3. [Tarefas (`/api/tasks`)](#3-tarefas-apitasks)

---

## 1. Autenticação (`/auth`)

Prefixo base: `/auth`

### 1.1. Login
- **Método:** `POST`
- **Rota:** `/auth/login`
- **Descrição:** Autentica o usuário no sistema com base no e-mail e senha, retornando um token JWT.
- **Body (JSON):**
  ```json
  {
    "email": "usuario@email.com",
    "senha": "sua_senha"
  }
  ```
- **Retornos (Status Codes):**
  - `200 OK`: Login efetuado com sucesso.
    ```json
    {
      "message": "Bem vindo(a) Nome do Usuário!",
      "token": "jwt_access_token_aqui"
    }
    ```
  - `400 Bad Request`: E-mail ou senha não informados, ou senha incorreta.
    ```json
    {
      "message": "Informe o email e a senha"
    }
    ```
    ou
    ```json
    {
      "message": "Senha inválida."
    }
    ```
  - `404 Not Found`: Usuário não encontrado com o e-mail fornecido.
    ```json
    {
      "message": "Usuário não encontrado"
    }
    ```
  - `500 Internal Server Error`: Erro interno no servidor.
    ```json
    {
      "message": "Ocorreu um erro no servidor",
      "error": "detalhes do erro"
    }
    ```

### 1.2. Registro de Usuário
- **Método:** `POST`
- **Rota:** `/auth/register`
- **Descrição:** Cria uma nova conta de usuário, criptografa a senha e dispara e-mail de verificação.
- **Body (JSON):**
  ```json
  {
    "nome": "Nome Completo",
    "email": "usuario@email.com",
    "senha": "senha_segura",
    "dataNascimento": "YYYY-MM-DD"
  }
  ```
- **Retornos (Status Codes):**
  - `201 Created`: Usuário criado com sucesso.
    ```json
    {
      "message": "Usuario criado com sucesso",
      "result": { ... }
    }
    ```
  - `400 Bad Request`: Campos obrigatórios faltando, tamanho de nome ou senha inválidos, ou e-mail já cadastrado.
    ```json
    {
      "message": "Todos os campos sao obrigatorios"
    }
    ```
    ou
    ```json
    {
      "message": "A senha deve ter no minimo 4 caracteres"
    }
    ```
    ou
    ```json
    {
      "message": "O nome deve ter no minimo 4 caracteres"
    }
    ```
    ou
    ```json
    {
      "message": "Email ja cadastrado"
    }
    ```
  - `500 Internal Server Error`: Erro interno no servidor.
    ```json
    {
      "message": "Ocorreu um erro no servidor",
      "error": "detalhes do erro"
    }
    ```

---

## 2. Usuários (`/api/users`)

Prefixo base: `/api/users`  
*(Nota: Rotas podem exigir autenticação via middleware dependendo da implementação.)*

### 2.1. Listar Todos os Usuários
- **Método:** `GET`
- **Rota:** `/api/users/`
- **Descrição:** Retorna a lista de todos os usuários cadastrados.
- **Body:** Nenhum (`GET`)
- **Retornos (Status Codes):**
  - `200 OK`: Lista retornada com sucesso (ou aviso se não houver usuários).
    ```json
    {
      "result": [ ... ]
    }
    ```
    ou se vazios:
    ```json
    {
      "message": "Nao existe usuarios cadastrados"
    }
    ```
  - `500 Internal Server Error`: Erro interno no servidor.
    ```json
    {
      "message": "Ocorreu um erro no servidor",
      "error": "detalhes do erro"
    }
    ```

### 2.2. Buscar Usuário por ID
- **Método:** `GET`
- **Rota:** `/api/users/:id`
- **Descrição:** Busca um usuário específico pelo seu identificador único.
- **Body:** Nenhum (`GET`)
- **Retornos (Status Codes):**
  - `200 OK`: Usuário encontrado.
    ```json
    {
      "result": [ { ... } ]
    }
    ```
  - `404 Not Found`: ID inválido ou usuário não encontrado.
    ```json
    {
      "message": "Id invalido"
    }
    ```
    ou
    ```json
    {
      "message": "Usuario nao encontrado"
    }
    ```
  - `500 Internal Server Error`: Erro interno no servidor.
    ```json
    {
      "message": "Ocorreu um erro no servidor",
      "error": "detalhes do erro"
    }
    ```

### 2.3. Atualizar Usuário
- **Método:** `PUT`
- **Rota:** `/api/users/:id`
- **Descrição:** Atualiza dados de um usuário existente (nome, e-mail e/ou senha).
- **Body (JSON):** (Pelo menos um dos campos abaixo é obrigatório)
  ```json
  {
    "nome": "Novo Nome",
    "email": "novo@email.com",
    "senha": "nova_senha"
  }
  ```
- **Retornos (Status Codes):**
  - `200 OK`: Usuário atualizado com sucesso.
    ```json
    {
      "result": { ... }
    }
    ```
  - `400 Bad Request`: ID inválido, senha muito curta (< 4 caracteres), senha igual à anterior, ou nenhum campo informado para atualização.
    ```json
    {
      "message": "Id invalido"
    }
    ```
  - `404 Not Found`: Usuário não encontrado.
    ```json
    {
      "message": "Usuario nao encontrado"
    }
    ```
  - `500 Internal Server Error`: Erro interno no servidor.
    ```json
    {
      "message": "Ocorreu um erro no servidor",
      "error": "detalhes do erro"
    }
    ```

### 2.4. Deletar Usuário
- **Método:** `DELETE`
- **Rota:** `/api/users/:id`
- **Descrição:** Remove um usuário do sistema pelo ID.
- **Body:** Nenhum (`DELETE`)
- **Retornos (Status Codes):**
  - `200 OK`: Usuário deletado com sucesso.
    ```json
    {
      "message": "usuario deletado!",
      "result": { ... }
    }
    ```
  - `404 Not Found`: Usuário não encontrado.
    ```json
    {
      "message": "Usuário não encontrado"
    }
    ```
  - `500 Internal Server Error`: Erro interno no servidor.
    ```json
    {
      "message": "Ocorreu um erro no servidor",
      "error": "detalhes do erro"
    }
    ```

---

## 3. Tarefas (`/api/tasks`)

Prefixo base: `/api/tasks`

### 3.1. Listar Todas as Tarefas
- **Método:** `GET`
- **Rota:** `/api/tasks/`
- **Descrição:** Retorna todas as tarefas cadastradas no sistema.
- **Body:** Nenhum (`GET`)
- **Retornos (Status Codes):**
  - `200 OK`: Tarefas listadas com sucesso.
    ```json
    {
      "message": "Tarefas Listadas:",
      "result": [ ... ]
    }
    ```
  - `404 Not Found`: Nenhuma tarefa encontrada.
    ```json
    {
      "message": "Nenhuma tarefa encontrada"
    }
    ```
  - `500 Internal Server Error`: Erro no servidor.
    ```json
    {
      "message": "Erro no servidor",
      "error": "detalhes do erro"
    }
    ```

### 3.2. Listar Tarefas por Usuário (`userId`)
- **Método:** `GET`
- **Rota:** `/api/tasks/:userId`
- **Descrição:** Retorna as tarefas associadas a um usuário específico.
- **Body:** Nenhum (`GET`)
- **Retornos (Status Codes):**
  - `200 OK`: Lista de tarefas do usuário (ou mensagem se não houver tarefas).
    ```json
    {
      "response": [ ... ]
    }
    ```
    ou
    ```json
    {
      "message": "Não foi encontrada tarefas desse usuario"
    }
    ```
  - `500 Internal Server Error`: Erro ao buscar tarefas.
    ```json
    {
      "message": "Erro ao buscar tarefas"
    }
    ```

### 3.3. Criar Tarefa
- **Método:** `POST`
- **Rota:** `/api/tasks/`
- **Descrição:** Cria uma nova tarefa associada a um usuário.
- **Body (JSON):**
  ```json
  {
    "userId": 1,
    "nome": "Nome da Tarefa",
    "descricao": "Descrição detalhada da tarefa",
    "dataTarefa": "YYYY-MM-DD",
    "prioridade": "baixa", // valores aceitos: baixa, media, alta
    "status": "pendente"   // valores aceitos: pendente, emAndamento, concluida
  }
  ```
- **Retornos (Status Codes):**
  - `201 Created`: Tarefa criada com sucesso.
    ```json
    {
      "message": "Tarefa criada com sucesso",
      "result": { ... }
    }
    ```
  - `400 Bad Request`: Campos obrigatórios faltando, status ou prioridade inválidos.
    ```json
    {
      "message": "Todos os campos são obrigatórios"
    }
    ```
    ou
    ```json
    {
      "message": "status inválido"
    }
    ```
    ou
    ```json
    {
      "message": "prioridade inválido"
    }
    ```
  - `500 Internal Server Error`: Erro no servidor.
    ```json
    {
      "message": "Erro no servidor",
      "error": "detalhes do erro"
    }
    ```

### 3.4. Atualizar Tarefa
- **Método:** `PUT`
- **Rota:** `/api/tasks/:id`
- **Descrição:** Atualiza os dados de uma tarefa existente.
- **Body (JSON):** (Campos opcionais/parciais para atualização)
  ```json
  {
    "nome": "Nome Atualizado",
    "descricao": "Nova descrição",
    "dataTarefa": "YYYY-MM-DD",
    "prioridade": "alta",
    "status": "concluida"
  }
  ```
- **Retornos (Status Codes):**
  - `200 OK`: Tarefa atualizada com sucesso.
    ```json
    {
      "message": "Tarefa atualizada com sucesso",
      "result": { ... }
    }
    ```
  - `400 Bad Request`: ID da tarefa não informado.
    ```json
    {
      "message": "ID da tarefa é obrigatório"
    }
    ```
  - `404 Not Found`: Tarefa não encontrada.
    ```json
    {
      "message": "Tarefa não encontrada"
    }
    ```
  - `500 Internal Server Error`: Erro no servidor.
    ```json
    {
      "message": "Erro no servidor",
      "error": "detalhes do erro"
    }
    ```

### 3.5. Deletar Tarefa
- **Método:** `DELETE`
- **Rota:** `/api/tasks/:id`
- **Descrição:** Remove uma tarefa pelo seu ID.
- **Body:** Nenhum (`DELETE`)
- **Retornos (Status Codes):**
  - `200 OK`: Tarefa deletada com sucesso.
    ```json
    {
      "message": "Tarefa deletada com sucesso",
      "result": { ... }
    }
    ```
  - `400 Bad Request`: ID da tarefa não informado.
    ```json
    {
      "message": "ID da tarefa é obrigatório"
    }
    ```
  - `404 Not Found`: Tarefa não encontrada.
    ```json
    {
      "message": "Tarefa não encontrada"
    }
    ```
  - `500 Internal Server Error`: Erro no servidor.
    ```json
    {
      "message": "Erro no servidor",
      "error": "detalhes do erro"
    }
    ```
