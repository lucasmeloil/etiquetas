// Função para alternar a exibição do menu suspenso do usuário
function toggleDropdown() {
    const dropdown = document.getElementById("userDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Fechar o dropdown ao clicar fora
window.onclick = function(event) {
    if (!event.target.matches('.user a')) {
        const dropdowns = document.getElementsByClassName("dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.display = "none";
        }
    }
}
