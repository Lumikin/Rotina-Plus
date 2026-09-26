import { VIEWS } from "../../utils/taskHelpers";

const TABS = [
  { id: VIEWS.MINE, label: "Minhas tarefas" },
  { id: VIEWS.ALL, label: "Todas as tarefas" },
];

export default function TasksToolbar({ activeView, taskCount, onViewChange }) {
  return (
    <div className="tasks-toolbar">
      <div className="tasks-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeView === tab.id ? "task-tab active" : "task-tab"}
            onClick={() => onViewChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <span className="task-count">
        {taskCount} {taskCount === 1 ? "tarefa" : "tarefas"}
      </span>
    </div>
  );
}
