import TaskCard from "./TaskCard";

export function TasksFeedback({ message, variant = "state" }) {
  return <div className={`tasks-${variant}`}>{message}</div>;
}

export default function TaskList({
  tasks,
  savingId,
  editingId,
  editForm,
  handlers,
}) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.UUID}
          task={task}
          isSaving={savingId === task.UUID}
          isEditing={editingId === task.UUID}
          editForm={editForm}
          onStatusChange={handlers.onStatusChange}
          onStartEdit={handlers.onStartEdit}
          onSaveEdit={handlers.onSaveEdit}
          onCancelEdit={handlers.onCancelEdit}
          onEditFieldChange={handlers.onEditFieldChange}
          onDelete={handlers.onDelete}
        />
      ))}
    </div>
  );
}
