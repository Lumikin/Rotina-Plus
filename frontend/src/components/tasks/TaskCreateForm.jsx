import { PRIORIDADES } from "../../utils/taskHelpers";

export default function TaskCreateForm({ formData, creating, onFieldChange, onSubmit }) {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <input
        className="task-form-input"
        type="text"
        placeholder="Nome da tarefa"
        value={formData.nome}
        onChange={(e) => onFieldChange("nome", e.target.value)}
        minLength={3}
        maxLength={64}
        required
      />
      <input
        className="task-form-input"
        type="text"
        placeholder="Descrição"
        value={formData.descricao}
        onChange={(e) => onFieldChange("descricao", e.target.value)}
        maxLength={255}
      />
      <input
        className="task-form-input"
        type="date"
        value={formData.dataTarefa}
        onChange={(e) => onFieldChange("dataTarefa", e.target.value)}
        required
      />
      <select
        className="task-form-input"
        value={formData.prioridade}
        onChange={(e) => onFieldChange("prioridade", e.target.value)}
      >
        {PRIORIDADES.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      <button className="refresh-button" type="submit" disabled={creating}>
        {creating ? "Salvando..." : "Adicionar tarefa"}
      </button>
    </form>
  );
}
