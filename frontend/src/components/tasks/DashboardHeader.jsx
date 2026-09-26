export default function DashboardHeader({ loading, onRefresh }) {
  return (
    <header className="tasks-header">
      <div>
        <h1>Tarefas</h1>
        <p className="tasks-subtitle">
          Acompanhe as tarefas cadastradas e a sua lista pessoal.
        </p>
      </div>
      <button
        className="refresh-button"
        type="button"
        onClick={onRefresh}
        disabled={loading}
      >
        {loading ? "Atualizando..." : "Atualizar"}
      </button>
    </header>
  );
}
