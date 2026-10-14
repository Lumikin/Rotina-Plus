import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, Medal, Crown } from "lucide-react";
import Navbar from "../components/Navbar";
import { logout, getUserId } from "../services/authService";
import { obterRanking } from "../services/taskService";
import { useNomeUsuario } from "../hooks/useNomeUsuario";
import "./Ranking.css";

function Posicao({ pos }) {
  if (pos === 1) return <Crown size={22} aria-label="1º lugar" style={{ color: "#C9A227" }} />;
  if (pos === 2) return <Medal size={22} aria-label="2º lugar" style={{ color: "#8A8F98" }} />;
  if (pos === 3) return <Medal size={22} aria-label="3º lugar" style={{ color: "#B0703C" }} />;
  return <span className="ranking-pos-num">#{pos}</span>;
}

export default function Ranking() {
  const navigate = useNavigate();
  const [userId] = useState(getUserId);
  const [nomeUsuario] = useNomeUsuario(userId);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setLoading(true);
    setErro("");
    try {
      const dados = await obterRanking();
      setRanking(Array.isArray(dados) ? dados : []);
    } catch {
      setErro("Não foi possível carregar o ranking.");
    }
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  function sair() {
    logout();
    navigate("/login", { replace: true });
  }

  const minhaPosicao = ranking.findIndex((u) => u.UUID === userId) + 1;

  return (
    <>
      <Navbar nomeUsuario={nomeUsuario} onSair={sair} />
      <main className="ranking-page">
        <section className="ranking-shell">
          <header className="ranking-header">
            <div>
              <h1 className="d-flex align-items-center gap-2">
                <Trophy size={28} aria-hidden="true" /> Ranking global
              </h1>
              <p className="ranking-subtitle">
                Pontos somados de todas as tarefas concluídas.
              </p>
            </div>
            <button
              className="refresh-button"
              type="button"
              onClick={carregar}
              disabled={loading}
            >
              {loading ? "Atualizando..." : "Atualizar"}
            </button>
          </header>

          {minhaPosicao > 0 && (
            <div className="ranking-mine">
              Sua posição: <strong>{minhaPosicao}º</strong> de {ranking.length}
            </div>
          )}

          {erro && <div className="ranking-error">{erro}</div>}
          {loading && <div className="ranking-state">Carregando ranking...</div>}

          {!loading && !erro && ranking.length === 0 && (
            <div className="ranking-state">Nenhum usuário no ranking ainda.</div>
          )}

          {!loading && ranking.length > 0 && (
            <ol className="ranking-list">
              {ranking.map((u, i) => {
                const pos = i + 1;
                const souEu = u.UUID === userId;
                return (
                  <li
                    key={u.UUID}
                    className={`ranking-item${souEu ? " is-me" : ""}${pos <= 3 ? " is-top" : ""}`}
                  >
                    <span className="ranking-pos"><Posicao pos={pos} /></span>
                    <span className="ranking-name">
                      {u.nome}
                      {souEu && <em className="ranking-you"> (você)</em>}
                    </span>
                    <strong className="ranking-points">
                      {Number(u.totalPontos) || 0} pts
                    </strong>
                  </li>
                );
              })}
            </ol>
          )}

          <Link to="/dashboard" className="ranking-back">
            ← Voltar às tarefas
          </Link>
        </section>
      </main>
    </>
  );
}
