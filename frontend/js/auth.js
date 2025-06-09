document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const login = document.getElementById("login").value;
  const senha = document.getElementById("senha").value;

  const res = await fetch("http://localhost/backend/login.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({login, senha})
  });
  const data = await res.json();

  if (data.success) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    window.location.href = "main.html";
  } else {
    alert("Login inválido!");
  }
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = {
    nome: document.getElementById("nome").value,
    sobrenome: document.getElementById("sobrenome").value,
    data_nascimento: document.getElementById("data_nascimento").value,
    login: document.getElementById("novo_login").value,
    senha: document.getElementById("nova_senha").value
  };

  const res = await fetch("http://localhost/backend/register.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (data.success) {
    alert("Usuário cadastrado com sucesso!");
  } else {
    alert("Erro ao cadastrar.");
  }
});
