## Rotas

### Usuários

Todas as rotas estão disponíveis em `/api/users`

---

#### `GET /`

Retorna todos os usuários cadastrados.

**Resposta `200 OK`** — com usuários:

```json
{
  "result": [
    {
      "id": 1,
      "nome": "joaosilva",
      "email": "joao@email.com"
    }
  ]
}
```

**Resposta `200 OK`** — nenhum usuário cadastrado:

```json
{
  "message": "Nao existe usuarios cadastrados"
}
```

**Resposta `500 Internal Server Error`:**

```json
{
  "message": "Ocorreu um erro no servidor",
  "error": "<detalhe do erro>"
}
```

---

#### `GET /:id`

Retorna os dados de um usuário pelo ID.

**Resposta `200 OK`:**

```json
{
  "result": { "id": 1, "nome": "joaosilva", "email": "joao@email.com" }
}
```

**Resposta `404 Not Found`** — ID inválido ou usuário não encontrado:

```json
{
  "message": "Id invalido"
}
```

```json
{
  "message": "Usuario nao encontrado"
}
```

**Resposta `500 Internal Server Error`:** igual à rota acima.

---

#### `PUT /:id`

Altera os dados do usuário pelo ID. Aceita atualização parcial — campos não enviados mantêm o valor atual.

> ⚠️ Se `senha` for enviada, ela não pode ser igual à senha atual, e precisa ter no mínimo 4 caracteres.

**Body** (todos os campos opcionais, mas ao menos um é obrigatório):

```json
{
  "nome": "novoNome",
  "email": "novo@email.com",
  "senha": "novaSenha123"
}
```

**Resposta `200 OK`:**

```json
{
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 0,
    "info": "Rows matched: 1  Changed: 1  Warnings: 0",
    "serverStatus": 2,
    "warningStatus": 0,
    "changedRows": 1
  }
}
```

**Resposta `400 Bad Request`:**

```json
{ "message": "Id invalido" }
```

```json
{ "message": "A senha deve ter no minimo 4 caracteres" }
```

```json
{ "message": "Pelo menos um campo é obrigatório para atualização" }
```

```json
{ "message": "A senha não pode ser a mesma que a atual" }
```

**Resposta `404 Not Found`:**

```json
{ "message": "Usuario nao encontrado" }
```

**Resposta `500 Internal Server Error`:** igual às rotas acima.

---

#### `DELETE /:id`

Remove um usuário pelo ID.

**Resposta `201 Created`:**

```json
{
  "message": "usuario deletado!",
  "result": {}
}
```

> Nota interna: por convenção REST, exclusão bem-sucedida normalmente retorna `200` ou `204`, não `201`. Motivo do `201` aqui: a definir.

**Resposta `404 Not Found`:**

```json
{ "message": "Usuário não encontrado" }
```

**Resposta `500 Internal Server Error`:** igual às rotas acima.
