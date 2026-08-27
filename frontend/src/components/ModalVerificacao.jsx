import React, { useState } from "react";

export default function ModalVerificacao({ visible, email, onClose, onConfirm }) {
  const [codigo, setCodigo] = useState("");

  if (!visible) return null;

  function handleConfirmar() {
    onConfirm(codigo);
    setCodigo("");
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h3 style={styles.title}>Código de Verificação</h3>
        <p style={styles.subtitle}>
          Enviamos um código para: <br />
          <strong style={styles.emailText}>{email || "seu e-mail"}</strong>
        </p>

        <input
          type="text"
          placeholder="Digite o código"
          maxLength={6}
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          style={styles.input}
        />

        <div style={styles.buttonContainer}>
          <button style={{ ...styles.button, ...styles.cancelBtn }} onClick={onClose}>
            Cancelar
          </button>
          <button style={{ ...styles.button, ...styles.confirmBtn }} onClick={handleConfirmar}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(3px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "28px 24px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "360px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    fontFamily: "inherit",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "20px",
    fontWeight: "700",
    color: "#00c3f8", 
  },
  subtitle: {
    fontSize: "14px",
    color: "#6c757d",
    marginBottom: "20px",
    lineHeight: "1.4",
  },
  emailText: {
    color: "#00c3f8", 
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ced4da",
    textAlign: "center",
    boxSizing: "border-box",
    marginBottom: "20px",
    outline: "none",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  button: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  cancelBtn: {
    backgroundColor: "#6c757d",
    color: "#ffffff",
  },
  confirmBtn: {
    backgroundColor: "#00c3f8", 
    color: "#ffffff",
  },
};