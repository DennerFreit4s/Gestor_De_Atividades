document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('login').value;
    const password = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost/trabalhoPHP/gestor_de_atividades/backend/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.error) {
            alert(`Erro no login: ${data.error}`);
            return;
        }

        localStorage.setItem('authToken', data.data);

        window.location.href = 'home.html';

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
});