export function hojeKey() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

export function formatarDataBR(data) {
  if (!data) return "Sem prazo";
  const [ano, mes, dia] = String(data).slice(0, 10).split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "Sem prazo";
}

export function toInputDate(data) {
  if (!data) return "";
  return String(data).slice(0, 10);
}
