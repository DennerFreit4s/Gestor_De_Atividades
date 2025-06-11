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