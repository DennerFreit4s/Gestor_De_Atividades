function toggleModal(id, show = true) {
  const modal = document.getElementById(id);
  if (!modal) return;

  if (show) {
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
  }
}

function abrirModal() {
  toggleModal("modal-atividade", true);
}

function fecharModal() {
  toggleModal("modal-atividade", false);
}

function abrirModalEditar(tarefaId, titulo, descricao, data, status) {
  toggleModal("modal-editar", true);

  document.getElementById('editar-id').value = tarefaId;
  document.getElementById('editar-titulo').value = titulo;
  document.getElementById('editar-descricao').value = descricao;
  document.getElementById('editar-prazo').value = data.split(' ')[0];
  document.getElementById('editar-status').value = status;
}

function fecharModalEditar() {
  toggleModal("modal-editar", false);
}

function abrirModalDeletar(tarefaId) {
  const modal = document.getElementById("modal-deletar");
  const confirmarBtn = document.getElementById("confirmar-delecao");
  const cancelarBtn = document.getElementById("cancelar-delecao");

  toggleModal("modal-deletar", true);
  confirmarBtn.dataset.id = tarefaId;

  const fechar = () => toggleModal("modal-deletar", false);

  confirmarBtn.onclick = async () => {
    try {
      await deletarTarefa(tarefaId);
      fechar();
    } catch (error) {
      // erro tratado em deletarTarefa
    }
  };

  cancelarBtn.onclick = fechar;
  modal.querySelector(".close").onclick = fechar;

  window.onclick = (event) => {
    if (event.target === modal) {
      fechar();
    }
  };
}

function fecharModalDeletar() {
  toggleModal("modal-deletar", false);
}
