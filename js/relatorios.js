// Função para carregar os dados do localStorage
function loadData() {
  let dados = JSON.parse(localStorage.getItem("movimentacoes")) || [];
  return dados;
}

// Função para atualizar a tabela de movimentações
function updateTable(dados) {
  const tableBody = document
    .getElementById("movimentacaoTable")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = ""; // Limpa a tabela

  let totalVeiculos = 0;
  let totalReceita = 0;

  dados.forEach((dado) => {
    let row = tableBody.insertRow();
    let cellData = row.insertCell(0);
    let cellTipoVeiculo = row.insertCell(1);
    let cellTipoMovimentacao = row.insertCell(2);
    let cellTempoPermanencia = row.insertCell(3);
    let cellValor = row.insertCell(4);

    cellData.textContent = dado.data;
    cellTipoVeiculo.textContent = dado.tipoVeiculo;
    cellTipoMovimentacao.textContent = dado.tipoMovimentacao;
    cellTempoPermanencia.textContent = dado.tempoPermanencia;
    cellValor.textContent = dado.valor.toFixed(2);

    totalVeiculos += 1;
    totalReceita += dado.valor;
  });

  // Atualizar resumo
  document.getElementById("totalVeiculos").textContent = totalVeiculos;
  document.getElementById("totalReceita").textContent = totalReceita.toFixed(2);
}

// Função para filtrar dados com base nas datas e tipo de veículo
function filterData() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const vehicleType = document.getElementById("vehicleType").value;

  let dados = loadData();

  dados = dados.filter((dado) => {
    const dataDado = new Date(dado.data);
    const tipoVeiculo =
      vehicleType === "todos" || dado.tipoVeiculo === vehicleType;

    return dataDado >= startDate && dataDado <= endDate && tipoVeiculo;
  });

  updateTable(dados);
}

// Evento de clique no botão de filtro
document.getElementById("filterButton").addEventListener("click", filterData);

// Carregar dados e atualizar a tabela na inicialização
document.addEventListener("DOMContentLoaded", () => {
  const dados = loadData();
  updateTable(dados);
});
