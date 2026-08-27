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
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(4px)",
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
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "20px",
    fontWeight: "700",
    color: "#0F172A", // Azul Escuro
  },
  subtitle: {
    fontSize: "14px",
    color: "#475569",
    marginBottom: "20px",
  },
  emailText: {
    color: "#0bc2d7", // Ciano vibrante
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #CBD5E1",
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
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  cancelBtn: {
    backgroundColor: "#64748B",
    color: "#ffffff",
  },
  confirmBtn: {
    backgroundColor: "#0bc2d7", 
    color: "#0F172A", 
  },
};