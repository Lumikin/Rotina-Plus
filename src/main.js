import "./styles.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <section class="cadastro-page">
    <div class="brand-panel" aria-label="Rotina Plus">
      <img class="brand-logo" src="/logo.png" alt="Logo Rotina Plus" />
      <div>
        <p class="eyebrow">Rotina Plus</p>
        <h1>Crie sua conta</h1>
        <p class="intro">
          Organize sua rotina, acompanhe seus hábitos e transforme constância em progresso.
        </p>
      </div>
      <ul class="benefits" aria-label="Benefícios">
        <li>Controle de tarefas diárias</li>
        <li>Acompanhamento de pontos</li>
        <li>Histórico para visualizar evolução</li>
      </ul>
    </div>

    <form class="signup-card" id="signupForm" novalidate>
      <div class="form-header">
        <p class="eyebrow">Cadastro</p>
        <h2>Dados do usuário</h2>
      </div>

      <label class="field">
        <span>Nome completo</span>
        <input id="nome" name="nome" type="text" maxlength="64" autocomplete="name" required />
      </label>

      <label class="field">
        <span>E-mail</span>
        <input id="email" name="email" type="email" autocomplete="email" required />
      </label>

      <label class="field">
        <span>Data de nascimento</span>
        <input id="dataNascimento" name="dataNascimento" type="date" required />
      </label>

      <label class="field">
        <span>Senha</span>
        <input id="senha" name="senha" type="password" minlength="6" autocomplete="new-password" required />
      </label>

      <label class="field">
        <span>Confirmar senha</span>
        <input id="confirmarSenha" name="confirmarSenha" type="password" minlength="6" autocomplete="new-password" required />
      </label>

      <p class="message" id="message" role="status" aria-live="polite"></p>

      <button class="primary-button" type="submit">Cadastrar</button>
      <p class="login-hint">
        Já tem uma conta?
        <a href="/login.html">Entre para continuar sua rotina.</a>
      </p>
    </form>
  </section>
`;

const form = document.querySelector("#signupForm");
const message = document.querySelector("#message");
const button = form.querySelector("button");

const showMessage = (text, type) => {
  message.textContent = text;
  message.className = `message ${type}`;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const nome = formData.get("nome").trim();
  const email = formData.get("email").trim();
  const dataNascimento = formData.get("dataNascimento");
  const senha = formData.get("senha");
  const confirmarSenha = formData.get("confirmarSenha");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (senha !== confirmarSenha) {
    showMessage("As senhas precisam ser iguais.", "error");
    return;
  }

  button.disabled = true;
  button.textContent = "Cadastrando...";
  showMessage("", "");

  try {
    const response = await fetch("http://localhost:3000/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, dataNascimento, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Não foi possível concluir o cadastro.");
    }

    form.reset();
    showMessage("Cadastro realizado com sucesso.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    button.disabled = false;
    button.textContent = "Cadastrar";
  }
});
