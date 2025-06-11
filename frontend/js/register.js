document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const userData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        birth_date: document.getElementById('birth_date').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    try {
        const response = await fetch('http://localhost/trabalhoPHP/gestor_de_atividades/backend/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.error) {
            alert(`Erro no cadastro: ${data.error}`);
        } else {
            alert('Usuário cadastrado com sucesso! Faça login.');
            window.location.href = 'login.html';
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
});