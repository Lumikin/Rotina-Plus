import { PRIORIDADES, STATUS_OPCOES, STATUS_LABEL } from "../../utils/taskHelpers";

export default function TaskEditForm({ formData, isSaving, onFieldChange, onSubmit, onCancel }) {
  return (
    <form className="task-edit-form" onSubmit={onSubmit}>
      <input
        className="task-form-input"
        type="text"
        placeholder="Nome da tarefa"
        value={formData.nome}
        onChange={(e) => onFieldChange("nome", e.target.value)}
        required
        minLength={3}
        maxLength={64}
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
      <select
        className="task-form-input"
        value={formData.status}
        onChange={(e) => onFieldChange("status", e.target.value)}
      >
        {STATUS_OPCOES.map((opcao) => (
          <option key={opcao} value={opcao}>
            {STATUS_LABEL[opcao]}
          </option>
        ))}
      </select>
      <div className="task-actions">
        <button className="refresh-button" type="submit" disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          className="cancel-button"
          disabled={isSaving}
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
