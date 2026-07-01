import "./styles.css";

const form = document.querySelector("#loginForm");
const message = document.querySelector("#loginMessage");

// Login simples para manter o fluxo de navegacao do prototipo.
// A validacao real de usuario ainda pode ser conectada ao backend.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  message.textContent = "Login realizado com sucesso.";
  message.className = "message success";

  // Depois do login, envia o usuario para o painel principal.
  window.location.href = "/app.html";
});
