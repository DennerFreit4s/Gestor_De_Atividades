const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// Carregar atividades
async function carregarAtividades() {
  const res = await fetch("http://localhost/backend/atividades.php", {
    headers: { "Authorization": "Bearer " + token }
  });
  const atividades = await res.json();
  const lista = document.getElementById("listaAtividades");
  lista.innerHTML = "";

  atividades.forEach((a) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${a.titulo}</strong> - ${a.status} - ${a.data_conclusao}
      <button onclick="editarAtividade(${a.id})">Editar</button>
      <button onclick="deletarAtividade(${a.id})">Excluir</button>
      <button onclick="marcarConcluida(${a.id})">Concluir</button>
    `;
    if (a.status === "aberto" && new Date(a.data_conclusao) < new Date()) {
      li.style.color = "red";
      li.innerHTML += " <span>[ATRASADA]</span>";
    }
    lista.appendChild(li);
  });
}

document.getElementById("novaAtividadeBtn").addEventListener("click", () => {
  abrirModal();
});

carregarAtividades();
