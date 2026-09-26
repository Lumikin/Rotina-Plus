import { useMemo } from "react";
import { useTasks } from "../hooks/useTasks";
import { VIEWS } from "../utils/taskHelpers";
import DashboardHeader from "../components/tasks/DashboardHeader";
import TaskCreateForm from "../components/tasks/TaskCreateForm";
import TasksToolbar from "../components/tasks/TasksToolbar";
import TaskList, { TasksFeedback } from "../components/tasks/TaskList";
import "./Dashboard.css";

function shouldShowEmptyState({ loading, loadError, tasks, activeView, userId }) {
  if (loading || loadError || tasks.length > 0) return false;
  return activeView === VIEWS.ALL || (activeView === VIEWS.MINE && Boolean(userId));
}

export default function Dashboard() {
  const {
    userId,
    activeView,
    setActiveView,
    isMineView,
    tasks,
    loading,
    loadError,
    actionError,
    creating,
    savingId,
    editingId,
    createForm,
    editForm,
    loadTasks,
    updateCreateField,
    updateEditField,
    createNewTask,
    changeTaskStatus,
    startEditing,
    cancelEditing,
    saveEditing,
    deleteTask,
  } = useTasks();

  const cardHandlers = useMemo(
    () => ({
      onStatusChange: changeTaskStatus,
      onStartEdit: startEditing,
      onSaveEdit: saveEditing,
      onCancelEdit: cancelEditing,
      onEditFieldChange: updateEditField,
      onDelete: deleteTask,
    }),
    [changeTaskStatus, startEditing, saveEditing, cancelEditing, updateEditField, deleteTask]
  );

  const showLoginNotice = !userId && isMineView && !loading;
  const showEmptyState = shouldShowEmptyState({
    loading,
    loadError,
    tasks,
    activeView,
    userId,
  });

  return (
    <main className="tasks-page">
      <section className="tasks-shell">
        <DashboardHeader loading={loading} onRefresh={loadTasks} />

        {userId && (
          <TaskCreateForm
            formData={createForm}
            creating={creating}
            onFieldChange={updateCreateField}
            onSubmit={createNewTask}
          />
        )}

        <TasksToolbar
          activeView={activeView}
          taskCount={tasks.length}
          onViewChange={setActiveView}
        />

        {showLoginNotice && (
          <TasksFeedback
            variant="notice"
            message="Faça login para visualizar as tarefas vinculadas à sua conta."
          />
        )}

        {loadError && <TasksFeedback variant="error" message={loadError} />}
        {actionError && (
          <div className="tasks-error" role="alert">
            {actionError}
          </div>
        )}

        {loading ? (
          <TasksFeedback message="Carregando tarefas..." />
        ) : tasks.length > 0 ? (
          <TaskList
            tasks={tasks}
            savingId={savingId}
            editingId={editingId}
            editForm={editForm}
            handlers={cardHandlers}
          />
        ) : (
          showEmptyState && (
            <TasksFeedback message="Nenhuma tarefa cadastrada ainda." />
          )
        )}
      </section>
    </main>
  );
}
