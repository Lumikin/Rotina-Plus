export default function TaskModal({
  aberto,
  modo,
  form,
  editForm,
  tarefaId,
  criando,
  salvandoId,
  onClose,
  onChangeCriacao,
  onChangeEdicao,
  onSubmit,
  onSubmitEdicao,
  PRIORIDADES,
  RECORRENCIAS,
  STATUS,
}) {
  if (!aberto) return null;

  const isCriacao = modo === "criar";

  return (
    <div className="task-modal-backdrop" onClick={onClose}>
      <div className="task-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <form
          className="task-edit-form modal-form"
          onSubmit={isCriacao ? onSubmit : (e) => onSubmitEdicao(e, tarefaId)}
        >
          <header className="modal-header">
            <h2>{isCriacao ? "Adicionar tarefa" : "Editar tarefa"}</h2>
            <button type="button" className="close-button" onClick={onClose} aria-label="Fechar modal">
              ✖
            </button>
          </header>

          <div className="modal-content">
            <div className="modal-section">
              <label htmlFor="task-name" className="task-label">Nome da tarefa</label>
              <input
                id="task-name"
                className="task-form-input"
                value={isCriacao ? form.nome : editForm.nome}
                onChange={(e) =>
                  isCriacao
                    ? onChangeCriacao({ ...form, nome: e.target.value })
                    : onChangeEdicao({ ...editForm, nome: e.target.value })
                }
                minLength={3}
                maxLength={64}
                required
              />
            </div>

            <div className="modal-section">
              <label htmlFor="task-desc" className="task-label">Descrição</label>
              <input
                id="task-desc"
                className="task-form-input"
                value={isCriacao ? form.descricao : editForm.descricao}
                onChange={(e) =>
                  isCriacao
                    ? onChangeCriacao({ ...form, descricao: e.target.value })
                    : onChangeEdicao({ ...editForm, descricao: e.target.value })
                }
                maxLength={255}
              />
            </div>

            <div className="modal-section">
              <label htmlFor="task-date" className="task-label">Data da tarefa</label>
              <input
                id="task-date"
                className="task-form-input"
                type="date"
                value={isCriacao ? form.dataTarefa : editForm.dataTarefa}
                onChange={(e) =>
                  isCriacao
                    ? onChangeCriacao({ ...form, dataTarefa: e.target.value })
                    : onChangeEdicao({ ...editForm, dataTarefa: e.target.value })
                }
                required
              />
            </div>

            <div className="modal-section">
              <label htmlFor="task-prioridade" className="task-label">Prioridade</label>
              <select
                id="task-prioridade"
                className="task-form-input"
                value={isCriacao ? form.prioridade : editForm.prioridade}
                onChange={(e) =>
                  isCriacao
                    ? onChangeCriacao({ ...form, prioridade: e.target.value })
                    : onChangeEdicao({ ...editForm, prioridade: e.target.value })
                }
              >
                {PRIORIDADES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="modal-section">
              <label htmlFor="task-recorrencia" className="task-label">Recorrência</label>
              <select
                id="task-recorrencia"
                className="task-form-input"
                value={isCriacao ? form.recorrencia : editForm.recorrencia}
                onChange={(e) =>
                  isCriacao
                    ? onChangeCriacao({ ...form, recorrencia: e.target.value })
                    : onChangeEdicao({ ...editForm, recorrencia: e.target.value })
                }
                title="Recorrência: cria a próxima ocorrência ao concluir"
              >
                {RECORRENCIAS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {!isCriacao && (
              <div className="modal-section">
                <label htmlFor="task-status" className="task-label">Status</label>
                <select
                  id="task-status"
                  className="task-form-input"
                  value={editForm.status}
                  onChange={(e) => onChangeEdicao({ ...editForm, status: e.target.value })}
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button className="refresh-button" type="submit" disabled={criando || salvandoId !== null}>
              {criando || salvandoId !== null
                ? "Salvando..."
                : isCriacao
                  ? "Adicionar tarefa"
                  : "Salvar alterações"}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
