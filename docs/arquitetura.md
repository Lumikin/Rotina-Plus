# Guia de Arquitetura

Como o Rotina Plus é estruturado, como uma requisição percorre o sistema e por que ele foi construído assim.

---

## 1. Visão geral

O Rotina Plus é um gerenciador de tarefas com pontuação: o usuário cria tarefas com prioridade e prazo, e recebe pontos ao concluí-las. Existem três partes de código — aplicação web, API e banco — mais um aplicativo mobile ainda não integrado.

## 2. Stack

| Camada | Tecnologia | Versão |
| :--- | :--- | :--- |
| Frontend | React + Vite | 19.2 / 8.x |
| Roteamento | React Router (`react-router-dom` 7.x; há também `react-router` 8.x sem uso evidente) | 7.18 |
| Estilo | Bootstrap | 5.3 |
| HTTP | axios | — |
| Backend | Express (ESM, `"type": "module"`) | 5.x |
| Banco | MariaDB / MySQL, driver `mysql2` | — |
| Autenticação | `jsonwebtoken` + `bcrypt` | — |
| E-mail | `nodemailer` via SMTP do Gmail | — |
| Mobile | Expo / React Native (não integrado) | SDK 54 |
| Runtime | Node.js | 25.x |

Não há TypeScript em lugar nenhum: todo o código é JavaScript/JSX puro.

## 3. Organização do código

```mermaid
flowchart TD
  subgraph root["Rotina-Plus/"]
    sql["rotinaplus.sql<br/><i>dump autoritativo do schema</i>"]
    docs["docs/"]
  end

  subgraph api["api/ — Express"]
    server["server.js<br/><i>bootstrap + CORS</i>"]
    subgraph src["src/"]
      cfg["config/<br/>Databse.js · Nodemailer.js"]
      rts["routes/<br/>router.js · *.routes.js"]
      ctl["controller/<br/>auth · user · task"]
      mid["middlewares/<br/>auth.middleware.js"]
      mdl["model/<br/>Users · Tasks"]
      rep["repositories/<br/>user · tasks · auth"]
      enu["enum/database.enum.js"]
    end
  end

  subgraph fe["frontend/ — React"]
    fep["pages/"]
    feh["hooks/"]
    fes["services/"]
    fec["components/"]
  end

  mob["mobile/ — Expo<br/><i>template não integrado</i>"]

  server --> rts --> ctl
  ctl --> rep
  ctl --> mdl
  rep --> cfg
  cfg -.-> db[("MySQL")]
  fep --> feh --> fes -.->|HTTP| rts
```

### Responsabilidade de cada pasta (API)

| Pasta | Responsabilidade | Pode importar de |
| :--- | :--- | :--- |
| `routes/` | Declara método, caminho e middlewares. Não contém lógica. | `controller`, `middlewares` |
| `controller/` | Valida entrada, orquestra a regra de negócio, monta a resposta HTTP. | `model`, `repositories`, `config` |
| `model/` | Classes de domínio com campos privados e métodos estáticos de fábrica. | nada (folha) |
| `repositories/` | SQL puro. É a **única** camada que conhece tabela e coluna. | `config` |
| `config/` | Pool de conexões e transporter de e-mail. Singleton. | — |
| `middlewares/` | Intercepta a requisição antes do controller (autenticação). | — |
| `enum/` | Constantes que espelham ENUMs do banco. | — |

Os repositories são objetos literais exportados, não classes. Os controllers também.

## 4. Camadas da API

O caminho de uma requisição é sempre o mesmo:

```mermaid
sequenceDiagram
  autonumber
  participant C as Cliente (axios)
  participant R as Rotas
  participant M as Middleware
  participant CT as Controller
  participant RE as Repository
  participant DB as MySQL

  C->>R: GET /api/tasks/:userId<br/>Authorization: Bearer <jwt>
  R->>M: authMiddleware
  M->>M: jwt.verify(token, JWT_SECRET)
  alt token ausente / inválido / expirado
    M-->>C: 401
  else token válido
    M->>CT: req.user = payload
    CT->>RE: listarUserTask(userId)
    RE->>DB: SELECT ... WHERE userId = ?
    DB-->>RE: rows
    RE-->>CT: rows
    CT-->>C: 200 { result: [...] }
  end
```

Regras que o código respeita hoje:

1. **Só o repository escreve SQL.** Nenhum controller monta query.
2. **O controller devolve status HTTP.** Erros de regra de negócio viram `400`; recurso ausente, `404`; exceção não tratada, `500`.
3. **O middleware não conhece regra de negócio.** Ele só valida o token e injeta `req.user`.

## 5. Autenticação

### 5.1 Sessão

O login valida a senha com `bcrypt.compare` e devolve um **JWT de 2 horas** com o payload `{ userId, email }`. O frontend guarda esse token em `localStorage["token"]` e um interceptor do axios o injeta como `Authorization: Bearer` em toda requisição que **não** seja `/auth/*`.

```mermaid
sequenceDiagram
  autonumber
  participant U as Usuário
  participant F as Login.jsx
  participant H as useLogin
  participant S as authService
  participant A as POST /auth/login
  participant DB as MySQL

  U->>F: e-mail + senha
  F->>H: login(email, senha)
  H->>S: loginUser()
  S->>A: { email, senha }
  A->>DB: SELECT * FROM usuarios WHERE email = ?
  DB-->>A: user
  A->>A: bcrypt.compare(senha, password_hash)
  A->>A: jwt.sign({ userId, email }, 2h)
  A-->>S: 200 { message, token }
  S->>S: localStorage.setItem("token", token)
  S-->>H: { success: true }
  H-->>F: navigate("/dashboard")
```

A proteção de rota no frontend (`ProtectedRoute` em `App.jsx`) verifica **apenas se existe um token no `localStorage`** — não valida expiração. Um token expirado deixa o usuário passar pela tela e só recebe `401` na primeira chamada à API.

### 5.2 Tokens de link (verificação de conta e redefinição de senha)

Os dois fluxos por e-mail seguem o mesmo padrão, e **não exigem alteração no banco**: o token é um JWT assinado com a mesma chave, e seu SHA-256 é gravado na tabela `autenticacao` para garantir uso único.

| Fluxo | Claim | Validade | Rota que consome |
| :--- | :--- | :--- | :--- |
| Verificação de conta | `verificacaoConta` | 24 h | `POST /auth/verify` |
| Redefinição de senha | `resetSenha` | 1 h | `POST /auth/reset-password` |

**Claim de separação.** Por usar o mesmo `JWT_SECRET`, um token de link poderia ser aceito como token de sessão. Por isso `auth.middleware.js` rejeita explicitamente qualquer token que carregue `verificacaoConta` ou `resetSenha`:

```mermaid
flowchart TD
  req["Requisição com<br/>Authorization: Bearer"] --> verify{"jwt.verify<br/>passou?"}
  verify -->|não| e401["401 Token inválido / expirado"]
  verify -->|sim| chk{"Carrega claim<br/>verificacaoConta ou resetSenha?"}
  chk -->|sim| e401
  chk -->|não| ok["req.user = payload<br/>next()"]
```

**Uso único sem coluna nova.** O token só é considerado consumido se o `UPDATE` realmente alterar a linha:

```mermaid
flowchart LR
  a["validarCodigo sha-256 do token"] --> b{"affectedRows === 0?"}
  b -->|"sim: já usado"| r["400 já utilizado"]
  b -->|"não: consumido agora"| s["200 sucesso"]
```

Esse detalhe depende de a linha estar com `isvalid = 1`. Como a tabela `autenticacao` não tem coluna que diferencie a finalidade do token, **`invalidarCodigos(userId)` não pode ser usado para revogar tokens**: ele invalidaria também o token de outro fluxo do mesmo usuário. Ver [Limitações conhecidas](#12-limitações-conhecidas).

## 6. Frontend

### 6.1 Separação de responsabilidades

```mermaid
flowchart TD
  page["pages/*.jsx<br/><i>tela e estado de UI</i>"]
  hook["hooks/*.jsx<br/><i>orquestra chamada + loading/error/success</i>"]
  svc["services/*.js<br/><i>axios + normalização de erro</i>"]
  api["api_rotinaplus<br/><i>instância única, interceptor</i>"]

  page --> hook --> svc --> api
```

O padrão é sempre o mesmo: a **página** cuida só de render, o **hook** cuida de `loading`/`error`/`success`, e o **service** faz a chamada HTTP e converte exceção em `{ success, message }`. Nenhuma página chama axios diretamente.

`isAuthenticated()` e `logout()` vivem no service de autenticação, mas o interceptor lê o `localStorage` direto para evitar import circular — os dois precisam concordar com a chave `"token"`.

### 6.2 Rotas

| Rota | Tela | Acesso |
| :--- | :--- | :--- |
| `/` | Home (landing) | público |
| `/login` | Login | público |
| `/register` | Cadastro (2 etapas) | público |
| `/verificar-email` | Resultado da verificação | público |
| `/esqueci-senha` | Solicitar redefinição | público |
| `/redefinir-senha` | Formulário de nova senha | público |
| `/dashboard` | Lista de tarefas | exige token |
| `*` | Redireciona para `/` | — |

## 7. Configuração

Variáveis lidas por `dotenv` a partir de `api/.env`. `.env.example` traz o modelo.

| Variável | Usada em | Observação |
| :--- | :--- | :--- |
| `PORT` | `server.js` | padrão de desenvolvimento: `8080` |
| `FRONTEND_URL` | controller de auth | monta o link dos botões do e-mail |
| `DB_HOST` `DB_USER` `DB_PASSWORD` `DB_DATABASE` `DB_PORT` | `config/Databse.js` | — |
| `JWT_SECRET` | login e verificação de token | assina sessão e tokens de link |
| `EMAIL_USER` `EMAIL_PASS` | `config/Nodemailer.js` | credenciais SMTP do Gmail |
| `SALT` | — | **declarada e nunca usada**; o `saltRounds` é fixo em `10` |

**CORS e URL da API são fixos no código.** `server.js:11` libera apenas `http://localhost:5173`, e `services/api.js:4` aponta para `http://localhost:8080`. Não há indireção por ambiente — para deploy em outro host é preciso editar código, não variáveis.

**Comunicação com Gmail.** O projeto usa SMTP do Gmail, que exige *App Password* (a senha normal da conta não funciona) e tem limite de envios por dia.

## 8. Decisões técnicas

**JWT stateless para a sessão.** Evita armazenamento de sessão no servidor e permite escalar horizontalmente sem estado compartilhado. O custo é que não existe revogação: um token emitido continua válido até expirar, mesmo após troca de senha.

**Token de link como JWT, não valor aleatório.** Um token opaco exigiria uma coluna indexável para ser encontrado no banco. Como a tabela `autenticacao` só tem `hashCode`, guardar o SHA-256 e procurar por ele funciona; o bcrypt resolveria a comparação mas não a busca.

**`UUID()` gerado no SQL.** Os repositories usam `UUID()` do próprio banco em vez de gerar no JavaScript. Isso evita uma dependência e mantém o ID no mesmo formato em toda a aplicação.

**Sem ORM.** SQL escrito à mão nos repositories. Com quatro tabelas o custo é baixo e o/schema fica explícito.

**`char(36)` em vez de `BINARY(16)`.** Legível em dumps e no console do MySQL ao custo de espaço.

## 9. Como rodar

```bash
# 1) Banco — criar o schema
mysql -u root -p < rotinaplus.sql

# 2) API
cd api
npm install
cp .env.example .env   # preencher as variáveis
node src/server.js     # http://localhost:8080
```

```bash
# 3) Frontend
cd frontend
npm install
npm run dev            # http://localhost:5173
```

Rode o MySQL antes da API: o pool é criado na importação de `config/Databse.js`, e sem o banco acessível o processo falha ao subir.

> **Atenção:** o script `npm start` da API invoca `nodemon`, que **não está em `package.json`**. Use `node src/server.js`, ou instale o `nodemon` como dependência de desenvolvimento.

## 10. Onde o mobile se encaixa

`mobile/` é o template do Expo, sem integração. `components/login-forms.js` tem um `TODO` explícito de integração com o serviço de autenticação e importa `@expo/vector-icons`, que não está em `package.json` — ou seja, o componente não compila como está. O guia de arquitetura considera o mobile como consumidor futuro da mesma API descrita em [api.md](./api.md); nenhuma rota nova é necessária do lado do backend para conectá-lo.

## 11. Fluxo de dados de uma tarefa

```mermaid
sequenceDiagram
  autonumber
  participant U as Usuário
  participant D as Dashboard.jsx
  participant TS as taskService
  participant A as POST /api/tasks
  participant CT as task.controller
  participant M as Task model
  participant R as tasks.repositorie
  participant DB as MySQL

  U->>D: preenche nova tarefa
  D->>TS: criarTask({...})
  TS->>A: POST /api/tasks
  A->>CT: criarTask(req, res)
  CT->>M: Task.criar({...})
  M-->>CT: instância de Task
  CT->>R: criarTask(task)
  R->>DB: INSERT INTO tarefas (UUID(), userId, ...)
  DB-->>R: ok
  R-->>CT: ok
  CT-->>TS: 201 { result }
  TS-->>D: { success: true }
```

Ao concluir, `PUT /api/tasks/:UUID/concluir` muda o `status` para `Concluida` e credita os pontos em `pontos`, que alimenta o ranking.

## 12. Limitações conhecidas

Documentadas aqui para não se perderem no código:

- **`GET /api/users` não exige autenticação.** As rotas importam `authMiddleware` e `authAdmin` mas não os aplicam, então a lista de usuários — incluindo e-mails — está pública.
- **`authAdmin` e `authUser` nunca são usados.** Ambos verificam uma claim `role` que o login não emite, então mesmo se fossem aplicados rejeitariam todo mundo.
- **Sessões não são revogáveis.** Trocar a senha não invalida JWT já emitido (2 h de janela). Recuperar a conta também deixa sessões antigas válidas.
- **Pedidos repetidos de redefinição acumulam tokens válidos.** Sem coluna de finalidade, não dá para revogar o anterior sem afetar o outro fluxo.
- **`/auth/forgot-password` responde `404` para e-mail inexistente**, o que confirma se um e-mail está cadastrado.
- **Envio de e-mail engole falha.** No cadastro e na redefinição uma falha de SMTP resulta em `500`, e o usuário já foi gravado — restando uma conta sem forma de verificar pela tela.
- **Sem teste automatizado** em nenhuma das três partes.
- **Erro de lint pré-existente** em `frontend/src/pages/Dashboard.jsx` (`react-hooks/set-state-in-effect`), na linha que chama `carregar()` dentro do `useEffect`.
- **`api/src/view/autenticacao.html` está órfão.** O e-mail é montado inline no controller; esse template não é importado por lugar nenhum.