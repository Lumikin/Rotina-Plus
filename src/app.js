// import "./styles.css";

// const app = document.querySelector("#app");
// const storageKey = "rotina-plus-tasks";



// const getStoredTasks = () => {
//   const savedTasks = localStorage.getItem(storageKey);
//   return savedTasks ? JSON.parse(savedTasks) : defaultTasks;
// };

// let tasks = getStoredTasks();

// const saveTasks = () => {
//   localStorage.setItem(storageKey, JSON.stringify(tasks));
// };

// const getPriorityPoints = (priority) => {
//   const points = {
//     Alta: 20,
//     Media: 12,
//     Baixa: 8,
//   };

//   return points[priority] || 10;
// };

// const getStats = () => {
//   const doneTasks = tasks.filter((task) => task.done);
//   const totalPoints = doneTasks.reduce((total, task) => total + getPriorityPoints(task.priority), 0);
//   const progress = tasks.length ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

//   return {
//     done: doneTasks.length,
//     total: tasks.length,
//     points: totalPoints,
//     progress,
//   };
// };

// const getTaskLabel = (task) => {
//   const status = task.done ? "Concluída" : "Pendente";
//   return `${task.time || "Sem horário"} · ${task.priority} · ${status}`;
// };

// const render = () => {
//   const stats = getStats();
//   const today = new Intl.DateTimeFormat("pt-BR", {
//     weekday: "long",
//     day: "2-digit",
//     month: "long",
//   }).format(new Date());

//   app.innerHTML = `
//     <section class="app-shell">
//       <aside class="sidebar" aria-label="Menu principal">
//         <a class="sidebar-brand" href="/app.html" aria-label="Rotina Plus">
//           <img src="/logo.png" alt="Logo Rotina Plus" />
//         </a>

//         <nav class="sidebar-nav">
//           <a class="active" href="/app.html">Início</a>
//           <a href="#tarefas">Tarefas</a>
//           <a href="#progresso">Progresso</a>
//           <a href="/login.html">Sair</a>
//         </nav>
//       </aside>

//       <section class="dashboard">
//         <header class="dashboard-header">
//           <div>
//             <p class="eyebrow">Painel principal</p>
//             <h1>Olá, seja bem-vindo.</h1>
//             <p class="intro">${today}. Cadastre tarefas, marque o que concluiu e acompanhe seus pontos.</p>
//           </div>
//         </header>

//         <section class="stats-grid" id="progresso" aria-label="Resumo do progresso">
//           <article class="stat-card">
//             <span>Pontos</span>
//             <strong>${stats.points}</strong>
//             <small>Calculados pelas tarefas concluídas</small>
//           </article>
//           <article class="stat-card">
//             <span>Progresso</span>
//             <strong>${stats.progress}%</strong>
//             <small>${stats.done} de ${stats.total} tarefas</small>
//           </article>
//           <article class="stat-card">
//             <span>Meta</span>
//             <strong>${stats.done >= 3 ? "Batida" : "Em curso"}</strong>
//             <small>Conclua 3 tarefas no dia</small>
//           </article>
//         </section>

//         <section class="dashboard-grid">
//           <article class="task-panel" id="tarefas">
//             <div class="section-heading">
//               <div>
//                 <p class="eyebrow">Hoje</p>
//                 <h2>Tarefas da rotina</h2>
//               </div>
//               <span class="task-count">${stats.total} ${stats.total === 1 ? "tarefa" : "tarefas"}</span>
//             </div>

//             <form class="task-form" id="taskForm">
//               <label class="field">
//                 <span>Nome da tarefa</span>
//                 <input name="name" type="text" maxlength="64" placeholder="Ex.: Beber água" required />
//               </label>

//               <label class="field">
//                 <span>Horário</span>
//                 <input name="time" type="time" required />
//               </label>

//               <label class="field">
//                 <span>Prioridade</span>
//                 <select name="priority" required>
//                   <option value="Baixa">Baixa</option>
//                   <option value="Media" selected>Media</option>
//                   <option value="Alta">Alta</option>
//                 </select>
//               </label>

//               <button class="primary-button" type="submit">Adicionar</button>
//             </form>

//             <div class="task-list" id="taskList">
//               ${
//                 tasks.length
//                   ? tasks
//                       .map(
//                         (task) => `
//                           <div class="task-item ${task.done ? "is-done" : ""}">
//                             <label>
//                               <input type="checkbox" data-action="toggle" data-id="${task.id}" ${task.done ? "checked" : ""} />
//                               <span>
//                                 <strong>${task.name}</strong>
//                                 <small>${getTaskLabel(task)}</small>
//                               </span>
//                             </label>
//                             <button class="icon-button" type="button" data-action="delete" data-id="${task.id}" aria-label="Excluir tarefa">Excluir</button>
//                           </div>
//                         `
//                       )
//                       .join("")
//                   : `<p class="empty-state">Nenhuma tarefa cadastrada para hoje.</p>`
//               }
//             </div>
//           </article>

//           <article class="focus-panel">
//             <p class="eyebrow">Foco</p>
//             <h2>Meta do dia</h2>
//             <p>Concluir pelo menos 3 tarefas para manter sua sequência e ganhar pontos extras.</p>
//             <div class="progress-track" aria-label="Progresso da meta">
//               <span style="width: ${Math.min(stats.progress, 100)}%"></span>
//             </div>
//             <small>${stats.progress}% concluído</small>
//           </article>
//         </section>
//       </section>
//     </section>
//   `;

//   bindEvents();
// };

// const bindEvents = () => {
//   const form = document.querySelector("#taskForm");
//   const taskList = document.querySelector("#taskList");

//   form.addEventListener("submit", (event) => {
//     event.preventDefault();

//     const formData = new FormData(form);
//     const name = formData.get("name").trim();
//     const time = formData.get("time");
//     const priority = formData.get("priority");

//     if (!form.checkValidity()) {
//       form.reportValidity();
//       return;
//     }

//     tasks = [
//       ...tasks,
//       {
//         id: crypto.randomUUID(),
//         name,
//         time,
//         priority,
//         done: false,
//       },
//     ];

//     saveTasks();
//     render();
//   });

//   taskList.addEventListener("click", (event) => {
//     const target = event.target;
//     const action = target.dataset.action;
//     const id = target.dataset.id;

//     if (!action || !id) {
//       return;
//     }

//     if (action === "toggle") {
//       tasks = tasks.map((task) => (task.id === id ? { ...task, done: target.checked } : task));
//     }

//     if (action === "delete") {
//       tasks = tasks.filter((task) => task.id !== id);
//     }

//     saveTasks();
//     render();
//   });
// };

// saveTasks();
// render();
