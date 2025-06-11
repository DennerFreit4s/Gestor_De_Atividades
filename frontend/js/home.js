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

document
  .getElementById("formAtividade")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    const form = e.target;
    const formData = {
      title: form.title.value,
      description: form.description.value,
      due_date: form.due_date.value,
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
      location.reload();
    } else {
      alert("Erro ao salvar atividade.");
    }
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
                
                <button class="btn-deletar" data-id="${
                  tarefa.id
                }">Deletar</button>
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

  // Função para deletar tarefa
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
        
        // Recarrega as tarefas após exclusão
        carregarTarefas();
        
        return data;
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        alert("Erro ao deletar tarefa");
        throw error;
    }
}

function abrirModalEditar(tarefaId, tarefaTitle, tarefaDescription, tarefaDueDate, tarefaStatus) {
  // Exibe o modal
  document.getElementById('modal-editar').classList.remove('hidden');

  // Preenche o formulário com os dados da tarefa
  document.getElementById('editar-id').value = tarefaId;
  document.getElementById('editar-titulo').value = tarefaTitle;
  document.getElementById('editar-descricao').value = tarefaDescription;
  document.getElementById('editar-prazo').value = tarefaDueDate.split(' ')[0];
  document.getElementById('editar-status').value = tarefaStatus;

  
}

function fecharModalEditar() {
  document.getElementById("modal-editar").classList.add("hidden");
}

document.getElementById("fechar-modal").addEventListener("click", fecharModalEditar)

document.getElementById('formEditar').addEventListener('submit', async (e) => {
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
    const response = await fetch(`http://localhost/trabalhoPHP/gestor_de_atividades/backend/tasks/?taskId=${tarefaId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosAtualizados)
      }
    );
    
    const data = await response.json();
    console.log('Tarefa atualizada:', data);
    fecharModalEditar();
    carregarTarefas(); // Recarrega as tarefas para mostrar as alterações
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao atualizar tarefa');
  }
});

// Modal de confirmação de deletar
function abrirModalDeletar(tarefaId) {
    const modal = document.getElementById("modal-deletar");
    const confirmarBtn = document.getElementById("confirmar-delecao");
    const cancelarBtn = document.getElementById("cancelar-delecao");
    modal.classList.remove('hidden');
    
    // Armazena o ID da tarefa no botão de confirmação
    document.getElementById('confirmar-delecao').dataset.id = tarefaId;
    
    // Configura o evento de clique fora do modal
    window.onclick = function(event) {
        if (event.target === modal) {
            fecharModalDeletar();
        }
    }
    // Armazena o ID da tarefa no botão de confirmação
    confirmarBtn.dataset.id = tarefaId;
    
    // Mostra o modal
    modal.style.display = "block";
    
    // Evento de confirmação
    confirmarBtn.onclick = async () => {
        try {
            await deletarTarefa(tarefaId);
            modal.style.display = "none";
        } catch (error) {
            // O erro já foi tratado na função deletarTarefa
        }
    };
    
    // Evento de cancelamento
    cancelarBtn.onclick = () => {
        modal.style.display = "none";
    };
    
    // Fechar modal ao clicar no X ou fora
    modal.querySelector(".close").onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

// Atualização do event listener para os botões deletar
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

function abrirModalDeletar(tarefaId) {
  console.log(`Abrir modal de confirmação para deletar tarefa ID: ${tarefaId}`);
  document.getElementById("modal-deletar").style.display = "block";
  document.getElementById("confirmar-delecao").dataset.id = tarefaId;
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
                body: JSON.stringify({  // Corrigido: precisa usar JSON.stringify
                    title: tarefaTitle,
                    description: tarefaDescription,
                    due_date: tarefaDueDate,
                    status: "completed"
                })
            }
        );

        const data = await response.json();
        console.log("Tarefa marcada como concluída:", data);
        
        // Recarrega as tarefas após conclusão
        carregarTarefas();
        
        return data; // Retorna os dados da resposta se necessário
    } catch (error) {
        console.error("Erro ao marcar tarefa como concluída:", error);
        // Você pode adicionar aqui um feedback visual para o usuário
        alert("Erro ao marcar tarefa como concluída");
        throw error; // Rejeita a promise para tratamento adicional se necessário
    }
}

// Função auxiliar para formatar a data
function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR");
}

// Função para carregar as tarefas
async function carregarTarefas() {
  const token = localStorage.getItem("authToken");

  const res = await fetch(
    "http://localhost/trabalhoPHP/gestor_de_atividades/backend/tasks",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const atividades = await res.json();

  criarCardsTarefas(atividades);
}

// Inicializa a página
document.addEventListener("DOMContentLoaded", carregarTarefas);
