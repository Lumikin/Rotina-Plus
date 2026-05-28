import "./styles.css";

const form = document.querySelector("#loginForm");
const message = document.querySelector("#loginMessage");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  message.textContent = "Login recebido. Integração com o backend ainda precisa ser conectada.";
  message.className = "message success";
});
