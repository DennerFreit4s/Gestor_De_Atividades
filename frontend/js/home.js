function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "login.html";
}

function abrirModal() {
  document.getElementById("modalAtividade").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modalAtividade").classList.add("hidden");
}

function fecharModalDeletar() {
  document.getElementById("modal-deletar").classList.add("hidden");
}

// Função para carregar conteúdo via AJAX dentro do main
function carregarPagina(url) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Erro ao carregar conteúdo');
      return res.text();
    })
    .then(html => {
      document.getElementById('conteudo-principal').innerHTML = html;

      if (url === 'atividades.html') {
        inicializarHome();
      }
    })
    .catch(err => {
      console.error(err);
      alert('Erro ao carregar a página');
    });
}

function inicializarHome() {
  carregarTarefas();

  // Listener para criar tarefa
  const formCriar = document.getElementById("formAtividade");
  if (formCriar) {
    formCriar.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("authToken");
      const formData = {
        title: formCriar.title.value,
        description: formCriar.description.value,
        due_date: formCriar.due_date.value,
      };

      const res = await fetch(
        "http://localhost/trabalhoPHP/gestor_de_atividades/backend/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        fecharModal();
        formCriar.reset();
        await carregarTarefas();
      } else {
        alert("Erro ao salvar atividade.");
      }
    });
  }

  // Listener para editar tarefa
  const formEditar = document.getElementById("formEditar");
  if (formEditar) {
    formEditar.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = localStorage.getItem('authToken');
      const tarefaId = document.getElementById('editar-id').value;

      const dadosAtualizados = {
        title: document.getElementById('editar-titulo').value,
        description: document.getElementById('editar-descricao').value,
        due_date: document.getElementById('editar-prazo').value,
        status: document.getElementById('editar-status').value
      };

      try {
        const response = await fetch(`http://localhost/trabalhoPHP/gestor_de_atividades/backend/tasks/?taskId=${tarefaId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(dadosAtualizados)
        });

        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        await response.json();
        fecharModalEditar();
        await carregarTarefas();
      } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        alert('Erro ao atualizar tarefa');
      }
    });
  }
}

document.getElementById('linkHome').addEventListener('click', function(e) {
  e.preventDefault();
  carregarPagina('atividades.html');
});

document.getElementById('linkCreditos').addEventListener('click', function(e) {
  e.preventDefault();
  carregarPagina('creditos.html');
});

// Quando a página inicial carrega, já carregamos o conteúdo home
document.addEventListener('DOMContentLoaded', () => {
  carregarPagina('atividades.html');
});

// Função principal para criar os cards
function criarCardsTarefas(dadosApi) {
  const atrasadoContainer = document.getElementById("atrasado");
  const abertoContainer = document.getElementById("aberto");
  const concluidoContainer = document.getElementById("concluido");

  atrasadoContainer.innerHTML = "";
  abertoContainer.innerHTML = "";
  concluidoContainer.innerHTML = "";

  const hoje = new Date();

  dadosApi.data.forEach((tarefa) => {
    const card = document.createElement("div");
    card.className = "card-tarefa";
    card.dataset.id = tarefa.id;

    const dataTarefa = new Date(tarefa.due_date);
    const estaAtrasada = dataTarefa < hoje && tarefa.status !== "completed";
    const estaConcluida = tarefa.status.toLowerCase() === "completed";

    if (estaAtrasada) card.classList.add("atrasada");
    if (estaConcluida) card.classList.add("concluida");

    card.innerHTML = `
            <h3>${tarefa.title}</h3>
            <p>${tarefa.description}</p>
            <div class="card-meta">
                <span>Prazo: ${formatarData(tarefa.due_date)}</span>
                ${
                  estaAtrasada
                    ? '<span class="status-atraso">ATRASADA</span>'
                    : ""
                }
            </div>
            <div class="card-actions">
                <button class="btn-editar" 
                data-id="${tarefa.id}"
                data-title="${tarefa.title}"
                data-description="${tarefa.description}"
                data-due_date="${tarefa.due_date}"
                data-status="${tarefa.status}">Editar</button>
                
                <button class="btn-deletar" data-id="${tarefa.id}">Deletar</button>
                ${
                  !estaConcluida
                    ? `<button class="btn-concluir" 
                data-id="${tarefa.id}"
                data-title="${tarefa.title}"
                data-description="${tarefa.description}"
                data-due_date="${tarefa.due_date}">Concluir</button>`
                    : ""
                }
            </div>
            <hr class="card-separator">
        `;

    if (estaConcluida) {
      concluidoContainer.appendChild(card);
    } else if (estaAtrasada) {
      atrasadoContainer.appendChild(card);
    } else {
      abertoContainer.appendChild(card);
    }
  });

  // Adiciona event listeners aos botões
  adicionarEventListeners();
}

// Função para adicionar eventos aos botões
function adicionarEventListeners() {
  // Botão Editar
  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tarefaId = e.target.dataset.id;
      const tarefaTitle = e.target.dataset.title;
      const tarefaDescription = e.target.dataset.description;
      const tarefaDueDate = e.target.dataset.due_date;
      const tarefaStatus = e.target.dataset.status;

      abrirModalEditar(
        tarefaId,
        tarefaTitle,
        tarefaDescription,
        tarefaDueDate,
        tarefaStatus
      );
    });
  });

  // Botões Deletar
  document.querySelectorAll(".btn-deletar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest('.card-tarefa');
      const tarefaId = card.dataset.id;
      abrirModalDeletar(tarefaId);
    });
  });

  // Botão Concluir
  document.querySelectorAll(".btn-concluir").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tarefaId = e.target.dataset.id;
      const tarefaTitle = e.target.dataset.title;
      const tarefaDescription = e.target.dataset.description;
      const tarefaDueDate = e.target.dataset.due_date;

      marcarComoConcluido(
        tarefaId,
        tarefaTitle,
        tarefaDescription,
        tarefaDueDate
      );
    });
  });
}

// Função para abrir modal de edição
function abrirModalEditar(tarefaId, tarefaTitle, tarefaDescription, tarefaDueDate, tarefaStatus) {
  document.getElementById('modal-editar').classList.remove('hidden');

  document.getElementById('editar-id').value = tarefaId;
  document.getElementById('editar-titulo').value = tarefaTitle;
  document.getElementById('editar-descricao').value = tarefaDescription;
  document.getElementById('editar-prazo').value = tarefaDueDate.split(' ')[0];
  document.getElementById('editar-status').value = tarefaStatus;
}

function fecharModalEditar() {
  document.getElementById("modal-editar").classList.add("hidden");
}

document.getElementById("fechar-modal").addEventListener("click", fecharModalEditar);

// Modal de confirmação de deletar
function abrirModalDeletar(tarefaId) {
  const modal = document.getElementById("modal-deletar");
  const confirmarBtn = document.getElementById("confirmar-delecao");
  const cancelarBtn = document.getElementById("cancelar-delecao");
  modal.classList.remove('hidden');

  document.getElementById('confirmar-delecao').dataset.id = tarefaId;

  modal.style.display = "block";

  confirmarBtn.onclick = async () => {
    try {
      await deletarTarefa(tarefaId);
      modal.style.display = "none";
    } catch (error) {
      // erro já tratado na função deletarTarefa
    }
  };

  cancelarBtn.onclick = () => {
    modal.style.display = "none";
  };

  modal.querySelector(".close").onclick = () => modal.style.display = "none";

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

async function deletarTarefa(tarefaId) {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `http://localhost/trabalhoPHP/gestor_de_atividades/backend/tasks/?taskId=${tarefaId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Tarefa deletada:", data);

    carregarTarefas();

    return data;
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    alert("Erro ao deletar tarefa");
    throw error;
  }
}

async function marcarComoConcluido(tarefaId, tarefaTitle, tarefaDescription, tarefaDueDate) {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `http://localhost/trabalhoPHP/gestor_de_atividades/backend/tasks/?taskId=${tarefaId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: tarefaTitle,
          description: tarefaDescription,
          due_date: tarefaDueDate,
          status: "completed"
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Tarefa marcada como concluída:", data);

    carregarTarefas();

    return data;
  } catch (error) {
    console.error("Erro ao concluir tarefa:", error);
    alert("Erro ao concluir tarefa");
    throw error;
  }
}

async function carregarTarefas() {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      "http://localhost/trabalhoPHP/gestor_de_atividades/backend/tasks",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const dadosApi = await response.json();
    criarCardsTarefas(dadosApi);
  } catch (error) {
    console.error("Erro ao carregar tarefas:", error);
    alert("Erro ao carregar tarefas");
  }
}

function formatarData(dataStr) {
  const date = new Date(dataStr);
  return date.toLocaleDateString();
}
