// Função para carregar conteúdo dentro do main
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

document.getElementById('linkHome').addEventListener('click', function(e) {
  e.preventDefault();
  carregarPagina('atividades.html');
});

document.getElementById('linkCreditos').addEventListener('click', function(e) {
  e.preventDefault();
  carregarPagina('creditos.html');
});

// Quando a página inicial carrega, já carregamos as atividades
document.addEventListener('DOMContentLoaded', () => {
  carregarPagina('atividades.html');
});