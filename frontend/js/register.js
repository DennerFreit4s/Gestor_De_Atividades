document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    birth_date: document.getElementById("birth_date").value,
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  const res = await fetch("http://localhost/backend/register.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.success) {
    alert("Usuário cadastrado com sucesso!");
    window.location.href = "login.html";
  } else {
    alert(data.message || "Erro ao cadastrar.");
  }
});
