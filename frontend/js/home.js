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

function formatarData(dataStr) {
  const date = new Date(dataStr);
  return date.toLocaleDateString();
}
