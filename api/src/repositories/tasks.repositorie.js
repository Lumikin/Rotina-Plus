import { connection } from "../config/Databse.js";
import { statusEnum } from "../enum/database.enum.js";

const PONTOS_POR_PRIORIDADE = {
  baixa: 5,
  media: 10,
  alta: 20,
};

// Coluna dataConclusao: guarda QUANDO a tarefa foi concluída.
// O streak (ofensiva) conta dias distintos de conclusão, não o prazo (dataTarefa).
let _colunaDataConclusaoGarantida = false;

function hojeKey() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

async function garantirColunaDataConclusao() {
  if (_colunaDataConclusaoGarantida) return;
  try {
    const [cols] = await connection.execute(
      `SELECT COUNT(*) AS total FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tarefas' AND COLUMN_NAME = 'dataConclusao'`
    );
    if (!cols[0] || Number(cols[0].total) === 0) {
      await connection.execute(`ALTER TABLE tarefas ADD COLUMN dataConclusao DATETIME NULL DEFAULT NULL`);
    }
    // Backfill: concluídas antigas sem dataConclusao herdam o prazo.
    await connection.execute(
      `UPDATE tarefas SET dataConclusao = dataTarefa WHERE status = 'Concluida' AND dataConclusao IS NULL`
    );
    _colunaDataConclusaoGarantida = true;
  } catch (e) {
    // Se a migration falhar, não derruba a API — loga e tenta de novo na próxima chamada.
    console.error("Falha ao garantir coluna dataConclusao:", e.message);
  }
}

// Regra: tarefa atrasada (prazo antes de hoje) e não concluída vira Pendente.
async function marcarAtrasadasComoPendentes() {
  const sql = `UPDATE tarefas SET status = 'Pendente' WHERE DATE(dataTarefa) < CURDATE() AND status != 'Concluida' AND status != 'Pendente'`;
  await connection.execute(sql);
}

function aplicarStatusAtraso(dataTarefa, status) {
  if (!dataTarefa || status === "Concluida") return status;
  const chave = String(dataTarefa).slice(0, 10);
  return chave < hojeKey() ? "Pendente" : status;
}

// Recorrência: só recria quando a tarefa é concluída.
// diaria = +1 dia, semanal = +7 dias, mensal = +1 mês (mesmo dia).
// dataTarefa pode vir do MySQL como Date ou como string "YYYY-MM-DD...".
function extrairBaseRecorrencia(dataTarefa) {
  if (dataTarefa instanceof Date && !Number.isNaN(dataTarefa.getTime())) {
    return new Date(dataTarefa.getFullYear(), dataTarefa.getMonth(), dataTarefa.getDate(), 12, 0, 0);
  }
  const s = String(dataTarefa ?? "");
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
  const d = new Date(dataTarefa);
  if (!Number.isNaN(d.getTime())) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
  }
  return null;
}

function calcularProximaData(dataTarefa, recorrencia) {
  const base = extrairBaseRecorrencia(dataTarefa);
  if (!base) return null;
  if (recorrencia === "diaria") base.setDate(base.getDate() + 1);
  else if (recorrencia === "semanal") base.setDate(base.getDate() + 7);
  else if (recorrencia === "mensal") base.setMonth(base.getMonth() + 1);
  else return null;
  const m = String(base.getMonth() + 1).padStart(2, "0");
  const dia = String(base.getDate()).padStart(2, "0");
  return `${base.getFullYear()}-${m}-${dia}`;
}

async function criarProximaOcorrencia(tarefa) {
  const recorrencia = tarefa?.recorrencia ?? "nenhuma";
  if (!recorrencia || recorrencia === "nenhuma") return null;
  const proximaData = calcularProximaData(tarefa.dataTarefa, recorrencia);
  if (!proximaData) return null;
  const sql = `INSERT INTO tarefas (UUID, userId, nome, descricao, dataTarefa, prioridade, status, recorrencia) VALUES (UUID(), ?, ?, ?, ?, ?, 'Em andamento', ?)`;
  const values = [tarefa.userId, tarefa.nome, tarefa.descricao ?? "", proximaData, tarefa.prioridade, recorrencia];
  await connection.execute(sql, values);
  const [rows] = await connection.execute(
    `SELECT * FROM tarefas WHERE userId = ? AND nome = ? AND DATE(dataTarefa) = ? ORDER BY DataCad DESC LIMIT 1`,
    [tarefa.userId, tarefa.nome, proximaData]
  );
  return rows[0] ?? { dataTarefa: proximaData, recorrencia };
}

const tasksRepositories = {
  // Garante a coluna dataConclusao (usada pelo streak). Chamada no boot.
  garantirEstrutura: async () => {
    await garantirColunaDataConclusao();
  },

  // Troca para Pendente todas as tarefas atrasadas e não concluídas.
  // Chame ela sempre antes de listar.
  atualizarTarefasAtrasadas: async () => {
    await marcarAtrasadasComoPendentes();
  },

  listarTasks: async () => {
    const sql = `SELECT * FROM tarefas;`;
    const [rows] = await connection.execute(sql);
    return rows;
  },

  // Streak: dias distintos em que o usuário CONCLUIU ao menos uma tarefa.
  // Usa DATE(dataConclusao) — dia real da conclusão, não o prazo (dataTarefa).
  // DISTINCT evita contar várias tarefas concluídas no mesmo dia mais de uma vez.
  obterOfensiva: async (userId) => {
    await garantirColunaDataConclusao();
    const sql = `
      SELECT COUNT(*) AS totalDias
      FROM (
        SELECT DISTINCT DATE(dataConclusao)
        FROM tarefas
        WHERE userId = ? AND status = 'Concluida' AND dataConclusao IS NOT NULL
      ) AS dias;
    `;
    
    const [rows] = await connection.execute(sql, [userId]);
    return rows[0]?.totalDias || 0;
  },

  listarUserTask: async userId => {
    const sql = `SELECT * FROM tarefas WHERE userId = ?;`;
    const values = [userId];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  listarTask: async tarefaUUID => {
    const sql = `SELECT * FROM tarefas WHERE UUID = ?;`;
    const values = [tarefaUUID];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  criarTask: async task => {
    await garantirColunaDataConclusao();
    const statusFinal = aplicarStatusAtraso(task.dataTarefa, task.status);
    const recorrenciaFinal = task.recorrencia ?? "nenhuma";
    // Criada já concluída => streak conta hoje.
    const dataConclusaoFinal = statusFinal === "Concluida" ? new Date() : null;
    const sql = `INSERT INTO tarefas (UUID, userId, nome, descricao, dataTarefa, prioridade, status, recorrencia, dataConclusao) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [task.userId, task.nome, task.descricao, task.dataTarefa, task.prioridade, statusFinal, recorrenciaFinal, dataConclusaoFinal];

    const [rows] = await connection.execute(sql, values);
    if (statusFinal === "Concluida") {
      const [criada] = await connection.execute(
        `SELECT UUID FROM tarefas WHERE userId = ? AND nome = ? ORDER BY DataCad DESC LIMIT 1`,
        [task.userId, task.nome]
      );
      if (criada[0]?.UUID) {
        const pontos = PONTOS_POR_PRIORIDADE[String(task.prioridade ?? "").toLowerCase()] ?? 0;
        await tasksRepositories.adicionarPontos(task.userId, criada[0].UUID, pontos);
      }
    }
    return rows;
  },

  atualizarTask: async (id, task) => {
    await garantirColunaDataConclusao();
    const [tarefaAtual] = await connection.execute(`SELECT status, prioridade, userId, nome, descricao, dataTarefa, recorrencia, dataConclusao FROM tarefas WHERE UUID = ?`, [id]);

    if (tarefaAtual.length === 0) {
      throw new Error("Tarefa nao encontrada");
    }

    const statusAnterior = tarefaAtual[0]?.status;
    const statusFinal = aplicarStatusAtraso(task.dataTarefa, task.status);
    // Mantém recorrência atual se o update não enviar o campo.
    const recorrenciaFinal = task.recorrencia ?? tarefaAtual[0]?.recorrencia ?? "nenhuma";
    const virouConcluida = statusAnterior !== "Concluida" && statusFinal === "Concluida";
    const deixouConcluida = statusAnterior === "Concluida" && statusFinal !== "Concluida";
    if (virouConcluida) {
      const pontos = PONTOS_POR_PRIORIDADE[task.prioridade?.toLowerCase()] ?? 0;
      await tasksRepositories.adicionarPontos(tarefaAtual[0].userId, id, pontos);
    }

    // dataConclusao: preenche com NOW() ao concluir, limpa ao desconcluir.
    let dataConclusaoSQL = `dataConclusao = dataConclusao`;
    if (virouConcluida) dataConclusaoSQL = `dataConclusao = NOW()`;
    else if (deixouConcluida) dataConclusaoSQL = `dataConclusao = NULL`;
    else if (statusFinal === "Concluida" && !tarefaAtual[0]?.dataConclusao) dataConclusaoSQL = `dataConclusao = NOW()`;

    const sql = `UPDATE tarefas SET nome = ?, descricao = ?, dataTarefa = ?, prioridade = ?, status = ?, recorrencia = ?, ${dataConclusaoSQL} WHERE UUID = ?`;
    const values = [task.nome, task.descricao, task.dataTarefa, task.prioridade, statusFinal, recorrenciaFinal, id];
    const [rows] = await connection.execute(sql, values);

    // Recorrência via PUT: se acabou de concluir, gera a próxima ocorrência.
    let proximaTarefa = null;
    if (statusAnterior !== "Concluida" && statusFinal === "Concluida") {
      proximaTarefa = await criarProximaOcorrencia({
        userId: tarefaAtual[0].userId,
        nome: task.nome,
        descricao: task.descricao,
        dataTarefa: task.dataTarefa,
        prioridade: task.prioridade,
        recorrencia: recorrenciaFinal,
      });
    }
    return { ...rows, proximaTarefa };
  },

  concluirTask: async idTask => {
    await garantirColunaDataConclusao();
    const [tarefaAtual] = await connection.execute(`SELECT status, prioridade, userId, nome, descricao, dataTarefa, recorrencia FROM tarefas WHERE UUID = ?`,[idTask]);

    if (tarefaAtual.length === 0) {
      throw new Error("Tarefa nao encontrada");
    }

    const statusAnterior = tarefaAtual[0]?.status;
    const novoStatus = statusAnterior === "Concluida" ? "Em andamento" : "Concluida";

    let proximaTarefa = null;
    if (novoStatus === "Concluida") {
      const prioridade = tarefaAtual[0]?.prioridade;
      const pontos = PONTOS_POR_PRIORIDADE[prioridade?.toLowerCase()] ?? 0;
      await tasksRepositories.adicionarPontos(tarefaAtual[0].userId, idTask, pontos);
      // Recorrência: concluiu -> cria a próxima ocorrência com a nova data.
      proximaTarefa = await criarProximaOcorrencia(tarefaAtual[0]);
    } else {
      await tasksRepositories.removerPontos(idTask);
    }

    // Concluiu => dataConclusao = NOW() (streak conta este dia).
    // Desconcluiu (Voltar) => dataConclusao = NULL (remove o dia se era o único).
    const sql = novoStatus === "Concluida"
      ? `UPDATE tarefas SET status = ?, dataConclusao = NOW() WHERE UUID = ?`
      : `UPDATE tarefas SET status = ?, dataConclusao = NULL WHERE UUID = ?`;
    const [rows] = await connection.execute(sql, [novoStatus, idTask]);
    return { ...rows, proximaTarefa };
  },

  deletarTask: async id => {
    await connection.execute(`DELETE FROM pontos WHERE tarefaId = ?`, [id]);
    const sql = `DELETE FROM tarefas WHERE UUID = ?`;
    const [rows] = await connection.execute(sql, [id]);
    return rows;
  },

  adicionarPontos: async (userId, tarefaId, pontos) => {
    const sql = `INSERT INTO pontos (UUID, tarefaId, pontos, dataCad) VALUES (UUID(), ?, ?, NOW())`;
    const values = [tarefaId, pontos];
    const [rows] = await connection.execute(sql, values);
    return rows;
  },

  removerPontos: async tarefaId => {
    const sql = `DELETE FROM pontos WHERE tarefaId = ?`;
    const [rows] = await connection.execute(sql, [tarefaId]);
    return rows;
  },

  listarRanking: async () => {
    const sql = `
      SELECT u.UUID, u.nome, COALESCE(SUM(p.pontos), 0) AS totalPontos
      FROM usuarios u
      LEFT JOIN tarefas t ON t.userId = u.UUID
      LEFT JOIN pontos p ON p.tarefaId = t.UUID
      GROUP BY u.UUID, u.nome
      ORDER BY totalPontos DESC;
    `;
    const [rows] = await connection.execute(sql);
    return rows;
  },

  obterPontosUsuario: async userId => {
    const sql = `
      SELECT COALESCE(SUM(p.pontos), 0) AS totalPontos
      FROM tarefas t
      LEFT JOIN pontos p ON p.tarefaId = t.UUID
      WHERE t.userId = ?;
    `;
    const [rows] = await connection.execute(sql, [userId]);
    return rows[0]?.totalPontos ?? 0;
  }
};

export default tasksRepositories;