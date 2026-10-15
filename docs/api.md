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
- **Descrição:** Cria uma nova conta de usuário, criptografa a senha e envia um e-mail com um **botão para verificar a conta**. O link aponta para `FRONTEND_URL/verificar-email?token=<jwt>`, vale por 24 horas e só pode ser usado uma vez.

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

### 1.3. Confirmar Verificação de E-mail
- **Método:** `POST`
- **Rota:** `/auth/verify`
- **Descrição:** Consome o token do link enviado no cadastro. O link aponta para `FRONTEND_URL/verificar-email?token=<jwt>` e a tela chama esta rota automaticamente. O token vale por **24 horas** e só pode ser usado uma vez.
- **Quem chama:** a tela `/verificar-email` do frontend. Não é chamada diretamente pelo usuário.
- **Body (JSON):**
  ```json
  {
    "token": "token_jwt_recebido_na_query_do_link"
  }
  ```
- **Retornos (Status Codes):**
  - `200 OK`: Token válido e ainda não utilizado.
    ```json
    {
      "message": "Conta verificada com sucesso!"
    }
    ```
  - `400 Bad Request`: Token ausente, inválido, expirado, de outro fluxo (`resetSenha`) ou já utilizado. Todos retornam `{ "message": "..." }` com o motivo:
    | Mensagem | Causa |
    | :--- | :--- |
    | `Token de verificação é obrigatório.` | Corpo sem `token`. |
    | `Link de verificação expirado. Crie a conta novamente.` | Passaram as 24 h. |
    | `Link de verificação inválido.` | Assinatura não confere, ou o token é de redefinição de senha. |
    | `Este link de verificação já foi utilizado.` | Token já consumido antes. |
  - `500 Internal Server Error`: Erro interno no servidor.

> **Sem estado no banco:** não existe coluna de conta verificada. Consumir o token é o único registro de que a verificação aconteceu — não há como consultar o status de verificação de um usuário, e o login não é bloqueado para contas não verificadas.

### 1.4. Solicitar Redefinição de Senha
- **Método:** `POST`
- **Rota:** `/auth/forgot-password`
- **Descrição:** Envia um e-mail com um botão para redefinir a senha. O link aponta para `FRONTEND_URL/redefinir-senha?token=<jwt>`, vale por 1 hora e só pode ser usado uma vez.
- **Body (JSON):**
  ```json
  {
    "email": "usuario@email.com"
  }
  ```
- **Retornos (Status Codes):**
  - `200 OK`: E-mail enviado.
    ```json
    {
      "message": "Enviamos um e-mail com o link para redefinir sua senha."
    }
    ```
  - `400 Bad Request`: E-mail não informado.
  - `404 Not Found`: Nenhum usuário com esse e-mail.
  - `500 Internal Server Error`: Erro interno no servidor.

### 1.5. Redefinir Senha
- **Método:** `POST`
- **Rota:** `/auth/reset-password`
- **Descrição:** Troca a senha usando o token do link. Não exige a senha atual — o acesso é autorizado pelo link do e-mail.
- **Body (JSON):**
  ```json
  {
    "token": "token_jwt_recebido_na_query_do_link",
    "novaSenha": "nova_senha_segura",
    "confirmarSenha": "nova_senha_segura"
  }
  ```
- **Retornos (Status Codes):**
  - `200 OK`: Senha alterada.
    ```json
    {
      "message": "Senha alterada com sucesso"
    }
    ```
  - `400 Bad Request`: Campos faltando, senhas diferentes, senha menor que 4 caracteres, token ausente/inválido/expirado ou já utilizado.
    ```json
    {
      "message": "Este link de redefinição já foi utilizado."
    }
    ```
  - `500 Internal Server Error`: Erro interno no servidor.

### 1.6. Alterar Senha (autenticado)
- **Método:** `PUT`
- **Rota:** `/auth/alterar-senha`
- **Descrição:** Troca a senha de quem já está logado, exigindo a senha atual. Diferente da [1.5](#15-redefinir-senha), esta rota **exige `Authorization: Bearer <token de sessão>`** e usa `req.user.userId` como alvo.
- **Body (JSON):**
  ```json
  {
    "senhaAtual": "senha_atual",
    "novaSenha": "nova_senha_segura",
    "confirmarSenha": "nova_senha_segura"
  }
  ```
- **Retornos (Status Codes):**
  - `200 OK`: Senha alterada.
    ```json
    {
      "message": "Senha alterada com sucesso"
    }
    ```
  - `400 Bad Request`: Campos faltando, `novaSenha` ≠ `confirmarSenha`, senha nova menor que 4 caracteres, `senhaAtual` incorreta.
  - `401 Unauthorized`: Token ausente, inválido ou expirado.
  - `404 Not Found`: Nenhum usuário com o `userId` do token.
  - `500 Internal Server Error`: Erro interno no servidor.

> **Sessões antigas continuam válidas.** Trocar a senha não invalida JWTs já emitidos: sessões abertas em outros dispositivos seguem funcionando por até 2 horas.

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
  - `404 Not Found`: Caso nenhuma tarefa se encontre registrada, nenhuma atividade poderá ser executada.
    ```json
    {
      "message": "Nenhuma tarefa se encontra registrada."
    }
    ```
  - `500 Internal Server Error`: Caso algum erro venha a ocorrer no servidor.
    ```json
    {
      "message": "Erro no servidor",
      "error": "Detalhe do erro"
    }
    ```

### 3.2. Listar Tarefas por Usuário (`userId`)
- **Método:** `GET`
- **Rota:** `/api/tasks/:userId`
- **Descrição:** Retorna as tarefas que se encontram associadas a um usuário específico.

- **Body:** Nenhum (`GET`)
- **Retornos (Status Codes):**
  - `200 OK`: Apresenta as tarefas vinculadas ao usuário, ou informa caso nenhuma se encontre registrada.
    ```json
    {
      "response": [ ... ]
    }
    ```
    ou
    ```json
    {
      "message": "Nenhuma tarefa se encontra registrada para este usuário."
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
- **Descrição:** Registra uma nova tarefa, vinculando-a ao usuário designado.

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
  - `201 Created`: A tarefa foi devidamente registrada.
    ```json
    {
      "message": "Tarefa criada com sucesso",
      "result": { ... }
    }
    ```
  - `400 Bad Request`: Há campos obrigatórios por preencher, status ou a prioridade informados não são válidos.
    ```json
    {
      "message": "Todos os campos são obrigatórios"
    }
    ```
    ou
    ```json
    {
      "message": "Status inválido"
    }
    ```
    ou
    ```json
    {
      "message": "Prioridade inválida"
    }
    ```
  - `500 Internal Server Error`: Erro no servidor.
    ```json
    {
      "message": "Erro no servidor",
      "error": "Detalhes do erro"
    }
    ```

### 3.4. Atualizar Tarefa
- **Método:** `PUT`
- **Rota:** `/api/tasks/:id`
- **Descrição:** Atualiza as informações de uma tarefa previamente cadastrada no sistema

- **Body (JSON):** Campos opcionais destinados à atualização específica das informações cadastradas.
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
  - `200 OK`: Caso a atualização dos dados da tarefa seja concluída com sucesso.
    ```json
    {
      "message": "Tarefa atualizada com sucesso",
      "result": { ... }
    }
    ```
  - `400 Bad Request`: Caso o identificador correspondente à tarefa não seja fornecido.
    ```json
    {
      "message": "ID da tarefa é obrigatório"
    }
    ```
  - `404 Not Found`: Na ausência de uma tarefa correspondente ao identificador informado.
    ```json
    {
      "message": "Tarefa não encontrada"
    }
    ```
  - `500 Internal Server Error`: Erro no servidor.
    ```json
    {
      "message": "Erro no servidor",
      "error": "Detalhes do erro"
    }
    ```

### 3.5. Deletar Tarefa
- **Método:** `DELETE`
- **Rota:** `/api/tasks/:id`
- **Descrição:** Remove a tarefa mediante o seu respectivo identificador.

- **Body:** Nenhum (`DELETE`)
- **Retornos (Status Codes):**
  - `200 OK`: Tarefa deletada com sucesso.
    ```json
    {
      "message": "Tarefa deletada com sucesso",
      "result": { ... }
    }
    ```
  - `400 Bad Request`: Caso o identificador correspondente à tarefa não seja fornecido.
    ```json
    {
      "message": "ID da tarefa é obrigatório"
    }
    ```
  - `404 Not Found`: Na ausência de uma tarefa correspondente ao identificador informado.
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

### 3.6. Concluir Tarefa
- **Método:** `PUT`
- **Rota:** `/api/tasks/:UUID/concluir`
- **Descrição:** **Alterna** o status entre `Concluida` e `Em andamento`. Ao concluir, credita os pontos conforme a prioridade; ao reabrir, remove a credição. É a única rota que mexe em `pontos`.
- **Atenção:** o parâmetro chama-se `UUID` (maiúsculas) na rota, mas `atualizarTask` e `deletarTask` usam `id`. É apenas nomenclatura — o valor é o `UUID` da tarefa nos três casos.
- **Body:** Nenhum (`PUT` sem corpo)
- **Retornos (Status Codes):**
  - `200 OK`: Status alternado com sucesso.
    ```json
    {
      "message": "Tarefa concluída com sucesso",
      "result": { "affectedRows": 1 }
    }
    ```
  - `400 Bad Request`: Sem `UUID` na rota.
    ```json
    {
      "message": "ID da tarefa é obrigatório"
    }
    ```
  - `404 Not Found`: Nenhuma tarefa com esse `UUID`.
    ```json
    {
      "message": "Tarefa não encontrada"
    }
    ```
  - `500 Internal Server Error`: Erro no servidor.

- **Pontos creditados por prioridade:**

  | Prioridade | Pontos |
  | :--- | ---: |
  | Baixa | 5 |
  | Media | 10 |
  | Alta | 20 |

- **Diferença em relação à [3.4](#34-atualizar-tarefa):** `PUT /api/tasks/:id` com `status: "Concluida"` **altera só o `status` e não credita pontos**. Para pontuar, é preciso usar esta rota. Alterar a prioridade de uma tarefa já concluída também não recalcula os pontos já creditados.

### 3.7. Obter Pontos do Usuário
- **Método:** `GET`
- **Rota:** `/api/tasks/pontos/:userId`
- **Descrição:** Retorna a **soma** dos pontos das tarefas concluídas do usuário. É o que alimenta o "Pontos totais" no painel.
- **Parâmetros de rota:**
  | Nome | Tipo | Obrigatório | Descrição |
  | :--- | :--- | :--- | :--- |
  | `userId` | string | sim | `UUID` do usuário. |
- **Body:** Nenhum (`GET`)
- **Retornos (Status Codes):**
  - `200 OK`:
    ```json
    {
      "message": "Pontos obtidos com sucesso",
      "totalPontos": 30
    }
    ```
    Retorna `0` — nunca `null` — quando o usuário não tem tarefas concluídas.
  - `400 Bad Request`: Sem `userId` na rota.
    ```json
    {
      "message": "ID do usuário é obrigatório"
    }
    ```
  - `500 Internal Server Error`: Erro no servidor.

### 3.8. Obter Ofensiva do Usuário
- **Método:** `GET`
- **Rota:** `/api/tasks/ofensiva/:userId`
- **Descrição:** Conta **quantos dias distintos** o usuário concluiu ao menos uma tarefa — um indicador de constância, não de pontuação.
- **Parâmetros de rota:**
  | Nome | Tipo | Obrigatório | Descrição |
  | :--- | :--- | :--- | :--- |
  | `userId` | string | sim | `UUID` do usuário. |
- **Body:** Nenhum (`GET`)
- **Retornos (Status Codes):**
  - `200 OK`:
    ```json
    {
      "message": "Ofensiva obtida com sucesso",
      "totalDias": 5
    }
    ```
  - `400 Bad Request`: Sem `userId` na rota.
    ```json
    {
      "message": "ID do usuário é obrigatório"
    }
    ```
  - `500 Internal Server Error`: Erro no servidor.

- **Como é calculado:** `COUNT(DISTINCT dataTarefa)` sobre as tarefas com `status = 'Concluida'`. Como `dataTarefa` é `datetime`, a contagem só equivale a "dias do calendário" porque o frontend sempre envia `YYYY-MM-DD` (o MySQL grava `00:00:00`). Se algum dia a coluna passar a guardar um horário real, a mesma tarefa em horas diferentes contou como dias distintos.
- **Sem consumidor:** nenhuma tela do frontend chama esta rota. O repositório também tem `listarRanking`, mas ele **não é exposto por nenhuma rota**.

---

## Notas gerais

**Autentização.** Apenas `PUT /auth/alterar-senha` exige `Authorization: Bearer`. Todas as rotas de `/api/users` e `/api/tasks` são **públicas** — `GET /api/users` devolve a lista de usuários, incluindo e-mails, sem qualquer credencial. As rotas importam `authMiddleware`/`authAdmin` mas não os aplicam.

**Erros.** Todos os controllers seguem o mesmo formato: `{ "message": "..." }`, com `error` acrescentado nos `500`. Não há formato de erro padronizado por código — o texto da mensagem é a única forma de o cliente diferenciar as causas.

**Identificadores.** Todas as chaves são `UUID` em `char(36)`, geradas por `UUID()` no próprio SQL do `INSERT`. Não há `id` numérico em nenhuma tabela.

**Ausência de recurso vs. erro.** Listagens que não encontram nada devolvem `404` (`GET /api/tasks/` com o banco vazio), enquanto listagens por usuário devolvem `200` com `result: []`.