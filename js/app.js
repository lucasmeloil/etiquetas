document.addEventListener("DOMContentLoaded", () => {
  const vehicleForm = document.getElementById("vehicle-form");
  const vehicleList = document.getElementById("vehicle-list").getElementsByTagName("tbody")[0];
  const modal = document.getElementById("myModal");
  const modalModelo = document.getElementById("modal-modelo");
  const modalPlaca = document.getElementById("modal-placa");
  const modalHoraEntrada = document.getElementById("modal-hora-entrada");
  const modalHoraSaida = document.getElementById("modal-hora-saida");
  const modalTotal = document.getElementById("modal-total");
  const modalPrintButton = document.getElementById("modal-print-button");
  const modalTipo = document.getElementById("modal-tipo");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  // Função para carregar veículos do Local Storage
  const loadVehicles = () => {
    vehicleList.innerHTML = ''; // Limpa a tabela antes de recarregar
    const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    vehicles.forEach((vehicle) => {
      addVehicleToTable(vehicle);
    });
  };

  // Função para adicionar um veículo à tabela
  const addVehicleToTable = (vehicle) => {
    const newRow = vehicleList.insertRow();
    newRow.innerHTML = `
      <td>${vehicle.tipo}</td>
      <td>${vehicle.modelo}</td>
      <td>${vehicle.placa}</td>
      <td>${vehicle.cor}</td>
      <td>${vehicle.proprietario}</td>
      <td>${new Date(vehicle.horaEntrada).toLocaleTimeString()}</td>
      <td><button class="exit-button" onclick="showExitModal(this)">Realizar Saida</button></td>
    `;
    newRow.dataset.horaEntrada = vehicle.horaEntrada;
  };

  vehicleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const modelo = document.getElementById("modelo").value;
    const placa = document.getElementById("placa").value;
    const cor = document.getElementById("cor").value;
    const proprietario = document.getElementById("proprietario").value;
    const tipo = document.getElementById("tipo-veiculo").value;
    const horaEntrada = new Date();

    const vehicle = {
      tipo,
      modelo,
      placa,
      cor,
      proprietario,
      horaEntrada: horaEntrada.toISOString(),
    };

    const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    vehicles.push(vehicle);
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
    addVehicleToTable(vehicle);
    vehicleForm.reset();
    printReceiptEntrada(vehicle);
  });

  window.showExitModal = (button) => {
    const row = button.closest("tr");
    const tipo = row.cells[0].innerText; // Tipo na coluna 0
    const modelo = row.cells[1].innerText; // Modelo na coluna 1
    const placa = row.cells[2].innerText; // Placa na coluna 2
    const horaEntrada = new Date(row.dataset.horaEntrada);

    // Define os dados no modal
    modalModelo.innerText = modelo;
    modalPlaca.innerText = placa;
    modalHoraEntrada.innerText = horaEntrada.toLocaleTimeString();
    modalTipo.innerText = tipo; // Captura o tipo do veículo para o modal

    // Cálculo da hora de saída e do total a pagar
    const horaSaida = new Date();
    modalHoraSaida.innerText = horaSaida.toLocaleTimeString();

    // Cálculo do total
    const total = calculateTotal(horaEntrada, horaSaida);
    modalTotal.innerText = total.toFixed(2);

    // Exibe o modal
    modal.style.display = "block";
    modal.dataset.rowIndex = Array.from(vehicleList.rows).indexOf(row);
    modal.dataset.horaEntrada = horaEntrada.toISOString();

    // Configurar o botão de impressão
    modalPrintButton.onclick = () => {
      printReceipt();
    };
  };

  const calculateTotal = (entrada, saida) => {
    const millisecondsPerHour = 3600000;
    const millisecondsPerHalfHour = 1800000;

    const duration = saida - entrada;
    let total = 0;

    if (duration <= millisecondsPerHour) {
      total = 10; // Primeira hora = R$ 10,00
    } else {
      total = 10;
      const remainingTime = duration - millisecondsPerHour;

      const additionalHalfHours = Math.ceil(remainingTime / millisecondsPerHalfHour);
      total += additionalHalfHours * 3.50; // Cada meia hora adicional = R$ 3,50
    }

    return total;
  };

  window.closeModal = () => {
    modal.style.display = "none";
  };

  window.finalizeExit = () => {
    const rowIndex = modal.dataset.rowIndex;
    const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    vehicles.splice(rowIndex, 1);
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
    vehicleList.deleteRow(rowIndex);
    printReceipt();
    closeModal();
  };

  function printReceiptEntrada(vehicle) {
    const horaEntrada = new Date(vehicle.horaEntrada);
    const dataEntrada = horaEntrada.toLocaleDateString();

    const receiptContent = `
      <div class="receipt">
        <h1>NEXUS ESTACIONE</h1>
        <p>Rua de Todos os Santos, número 25, Itabaiana-SE</p>
        <p class="divider"></p>
        <h2>Recibo de Entrada</h2>
        <p class="divider"></p>
        <p><strong>Tipo de Veículo:</strong> ${vehicle.tipo}</p>
        <p><strong>Modelo:</strong> ${vehicle.modelo}</p>
        <p><strong>Placa:</strong> ${vehicle.placa}</p>
        <p><strong>Hora de Entrada:</strong> ${horaEntrada.toLocaleTimeString()}</p>
        <p><strong>Data de Entrada:</strong> ${dataEntrada}</p>
        <p style="text-align: center;">Estamos a sua espera!</p>
        <p style="text-align: center;">Não tenha pressa, seu carro está em boas mãos!</p>
      </div>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>Recibo de Entrada</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; background: #ffffff; padding: 0; margin: 0; }
            .receipt { width: 80mm; padding: 10mm; border: 1px solid #000; border-radius: 5px; text-align: left; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); }
            h1 { font-size: 18px; text-align: center; margin: 0; }
            h2 { font-size: 16px; text-align: center; margin: 10px 0; }
            .divider { margin: 10px 0; border: 1px dashed #000; }
          </style>
        </head>
        <body>${receiptContent}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  }

  function printReceipt() {
    const receiptContent = `
      <div class="receipt">
        <h1 style="text-align: center;">NEXUS ESTACIONE</h1>
        <p style="text-align: center;">Rua de Todos os Santos, número 25, Itabaiana-SE</p>
        <hr style="border: 1px dashed #000;">
        <h2 style="text-align: center;">Recibo de Saída</h2>
        <hr style="border: 1px dashed #000;">
        <p><strong>Tipo de Veículo:</strong> ${modalTipo.innerText}</p>
        <p><strong>Modelo:</strong> ${modalModelo.innerText}</p>
        <p><strong>Placa:</strong> ${modalPlaca.innerText}</p>
        <p><strong>Data de Saída:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Hora de Entrada:</strong> ${modalHoraEntrada.innerText}</p>
        <p><strong>Hora de Saída:</strong> ${modalHoraSaida.innerText}</p>
        <p><strong>Total a Pagar:</strong> R$ ${modalTotal.innerText}</p>
        <hr style="border: 1px dashed #000;">
        <p style="text-align: center;">*** Agradecemos pela preferência! ***</p>
      </div>
    `;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>Recibo de Saída</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; background: #ffffff; padding: 0; margin: 0; }
            .receipt { width: 80mm; padding: 10mm; border: 1px solid #000; border-radius: 5px; text-align: left; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); }
            h1 { font-size: 18px; text-align: center; margin: 0; }
            h2 { font-size: 16px; text-align: center; margin: 10px 0; }
            hr { margin: 10px 0; }
          </style>
        </head>
        <body>${receiptContent}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  }

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = vehicleList.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      const modeloCell = rows[i].cells[1].innerText.toLowerCase();
      const placaCell = rows[i].cells[2].innerText.toLowerCase();
      if (modeloCell.includes(searchTerm) || placaCell.includes(searchTerm)) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  });

  loadVehicles();
});
