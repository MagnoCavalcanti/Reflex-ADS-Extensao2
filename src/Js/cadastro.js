const botaoProfessor = document.querySelector('.buttonProfessor');
const botaoAluno = document.querySelector('.buttonAluno');
const botaoFinalizar = document.querySelector('#buttonregister');

// Variável para guardar o perfil escolhido
let perfilSelecionado = null;

// ---- Seleção de perfil ----
botaoProfessor.addEventListener('click', function () {
  perfilSelecionado = "professor";
  botaoProfessor.classList.add('ativo');
  botaoAluno.classList.remove('ativo');
});

botaoAluno.addEventListener('click', function () {
  perfilSelecionado = "aluno";
  botaoAluno.classList.add('ativo');
  botaoProfessor.classList.remove('ativo');
});

// ---- Redirecionamento ao finalizar cadastro ----
botaoFinalizar.addEventListener('click', function (event) {

  // Impede o redirecionamento do <a> caso não tenha escolhido
  event.preventDefault();

  if (perfilSelecionado === "professor") {
    window.location.href = "/paginas/professor.html";
  }
  else if (perfilSelecionado === "aluno") {
    window.location.href = "/dashboardaluno.html";
  }
  else {
    alert("Por favor, selecione Professor ou Aluno para continuar!");
  }

});
