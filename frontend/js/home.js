document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("cardsContainer");
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost/backend/atividades.php", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const atividades = await res.json();
  container.innerHTML = "";

  atividades.forEach(atividade => {
    const card = document.createElement("div");
    card.classList.add("card");

    const dueDate = new Date(atividade.due_date);
    const now = new Date();
    if (atividade.status === "open" && dueDate < now) {
      card.classList.add("atrasada");
    }

    card.innerHTML = `
      <h3>${atividade.title}</h3>
      <p>${atividade.description}</p>
      <p class="meta">Prazo: ${dueDate.toLocaleDateString()}</p>
      <p class="meta">Status: ${atividade.status === 'open' ? 'Em aberto' : 'Concluída'}</p>
    `;

    container.appendChild(card);
  });
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

function abrirModal() {
  document.getElementById("modalAtividade").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modalAtividade").classList.add("hidden");
}

document.getElementById("formAtividade").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const form = e.target;
  const formData = {
    title: form.title.value,
    description: form.description.value,
    due_date: form.due_date.value,
  };

  const res = await fetch("http://localhost/backend/atividades.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });

  if (res.ok) {
    fecharModal();
    location.reload(); // Atualiza a lista
  } else {
    alert("Erro ao salvar atividade.");
  }
});
