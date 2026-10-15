import { useNavigate } from "react-router-dom";

function formatarData(data) {
  if (!data) return "Sem prazo";
  const [ano, mes, dia] = String(data).slice(0, 10).split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "Sem prazo";
}

export default function AlertaTarefasAtrasadas({ tarefas, onVerTarefas, onFechar }) {
  if (!tarefas || tarefas.length === 0) return null;

  const navigate = useNavigate();

  return (
    <section className="alerta-atrasadas" role="alert" aria-label="Tarefas atrasadas">
      <div className="alerta-conteudo">
        <div className="alerta-icone">⚠️</div>
        <div className="alerta-texto">
          <strong className="alerta-titulo">Tarefas atrasadas</strong>
          <p className="alerta-mensagem">
            Você tem {tarefas.length} tarefa{tarefas.length > 1 ? "s" : ""} com prazo vencido.
          </p>
        </div>
        <ul className="alerta-lista">
          {tarefas.slice(0, 5).map((t) => (
            <li key={t.UUID} className="alerta-item">
              <span className="alerta-nome">{t.nome}</span>
              <span className="alerta-prazo">prazo {formatarData(t.dataTarefa)}</span>
            </li>
          ))}
          {tarefas.length > 5 && (
            <li className="alerta-item alerta-mais">
              + {tarefas.length - 5} outra{tarefas.length - 5 > 1 ? "s" : ""} atrasada(s)
            </li>
          )}
        </ul>
        <div className="alerta-acoes">
          <button
            className="alerta-botao"
            type="button"
            onClick={() => {
              onVerTarefas();
              navigate("/dashboard", { replace: true });
            }}
          >
            Ver tarefas
          </button>
          <button className="alerta-fechar" type="button" onClick={onFechar} aria-label="Fechar alerta">
            ✕
          </button>
        </div>
      </div>
    </section>
  );
}
