// Seleciona o formulário e a div da mensagem
const loginForm = document.getElementById("loginForm");
const messageDiv = document.getElementById("message");

// Adiciona um evento de envio ao formulário
loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o envio do formulário padrão

    // Captura os valores de usuário e senha
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Limpa mensagens anteriores
    messageDiv.textContent = '';

    // Verifica se as credenciais estão corretas
    if (username === "admin" && password === "1234") {
        // Armazena um estado de autenticação no localStorage
        localStorage.setItem("authenticated", "true");
        // Exibe mensagem de sucesso
        messageDiv.textContent = "Login realizado com sucesso!";
        messageDiv.className = "message success"; // Adiciona classe de sucesso
        // Redireciona após 2 segundos
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    } else {
        // Exibe mensagem de erro
        messageDiv.textContent = "Usuário ou senha incorretos.";
        messageDiv.className = "message"; // Classe padrão
    }
    
});
