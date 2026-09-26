import {
  STATUS_OPCOES,
  formatTaskDate,
  getStatusClass,
  getStatusLabel,
} from "../../utils/taskHelpers";
import TaskEditForm from "./TaskEditForm";

export default function TaskCard({
  task,
  isSaving,
  isEditing,
  editForm,
  onStatusChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditFieldChange,
  onDelete,
}) {
  const status = task.status ?? "Pendente";

  if (isEditing) {
    return (
      <article className="task-item">
        <TaskEditForm
          formData={editForm}
          isSaving={isSaving}
          onFieldChange={onEditFieldChange}
          onSubmit={(e) => onSaveEdit(e, task.UUID)}
          onCancel={onCancelEdit}
        />
      </article>
    );
  }

  return (
    <article className="task-item">
      <div className="task-main">
        <div className="task-title-row">
          <h2>{task.nome}</h2>
          <span className={`status-badge ${getStatusClass(status)}`}>
            {getStatusLabel(status)}
          </span>
        </div>
        <p>{task.descricao || "Sem descrição."}</p>
      </div>

      <dl className="task-details">
        <div>
          <dt>Prioridade</dt>
          <dd>{task.prioridade ?? "Sem prioridade"}</dd>
        </div>
        <div>
          <dt>Prazo</dt>
          <dd>{formatTaskDate(task.dataTarefa)}</dd>
        </div>
      </dl>

      <div className="task-actions">
        <select
          value={status}
          disabled={isSaving}
          onChange={(e) => onStatusChange(task.UUID, e.target.value, status)}
        >
          {STATUS_OPCOES.map((opcao) => (
            <option key={opcao} value={opcao}>
              {getStatusLabel(opcao)}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="edit-button"
          disabled={isSaving}
          onClick={() => onStartEdit(task)}
        >
          Editar
        </button>
        <button
          type="button"
          className="delete-button"
          disabled={isSaving}
          onClick={() => onDelete(task.UUID)}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}
