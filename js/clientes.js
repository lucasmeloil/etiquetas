document.getElementById("client-form").addEventListener("submit", function(event) {
    event.preventDefault();
    cadastrarCliente();
});

function cadastrarCliente() {
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const endereco = document.getElementById("endereco").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    const cliente = { nome, cpf, endereco, telefone, email };
    
    // Salvar no Local Storage
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    clientes.push(cliente);
    localStorage.setItem("clientes", JSON.stringify(clientes));

    adicionarClienteNaTabela(cliente);
    
    document.getElementById("client-form").reset();
}

// Adiciona cliente à tabela
function adicionarClienteNaTabela(cliente) {
    const clientList = document.getElementById("client-list").getElementsByTagName("tbody")[0];
    const newRow = clientList.insertRow();
    
    newRow.insertCell(0).innerText = cliente.nome;
    newRow.insertCell(1).innerText = cliente.cpf;
    newRow.insertCell(2).innerText = cliente.endereco;
    newRow.insertCell(3).innerText = cliente.telefone;
    newRow.insertCell(4).innerText = cliente.email;

    const actionsCell = newRow.insertCell(5);
    actionsCell.innerHTML = '<button onclick="editarCliente(this)">Editar</button> <button onclick="deletarCliente(this)">Deletar</button>';
}

// Carregar clientes do Local Storage na tabela
function carregarClientes() {
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    clientes.forEach(cliente => {
        adicionarClienteNaTabela(cliente);
    });
}

// Função para editar cliente
function editarCliente(button) {
    const row = button.parentNode.parentNode;
    document.getElementById("nome").value = row.cells[0].innerText;
    document.getElementById("cpf").value = row.cells[1].innerText;
    document.getElementById("endereco").value = row.cells[2].innerText;
    document.getElementById("telefone").value = row.cells[3].innerText;
    document.getElementById("email").value = row.cells[4].innerText;

    row.remove(); // Remove a linha para que o cliente possa ser re-cadastrado
    removerClienteDoLocalStorage(row.cells[1].innerText); // Remove o cliente do Local Storage
}

// Função para deletar cliente
function deletarCliente(button) {
    const row = button.parentNode.parentNode;
    const cpf = row.cells[1].innerText;
    row.remove();
    removerClienteDoLocalStorage(cpf); // Remove o cliente do Local Storage
}

// Função para remover cliente do Local Storage
function removerClienteDoLocalStorage(cpf) {
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    clientes = clientes.filter(cliente => cliente.cpf !== cpf);
    localStorage.setItem("clientes", JSON.stringify(clientes));
}

// Carregar clientes ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarClientes);
