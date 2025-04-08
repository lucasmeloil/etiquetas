document.addEventListener("DOMContentLoaded", () => {
  const vehicleForm = document.getElementById("vehicle-form");
  const vehicleList = document
    .getElementById("vehicle-list")
    .getElementsByTagName("tbody")[0];
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

  const loadVehicles = () => {
    vehicleList.innerHTML = "";
    const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    vehicles.forEach((vehicle) => {
      addVehicleToTable(vehicle);
    });
  };

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
    const tipo = row.cells[0].innerText;
    const modelo = row.cells[1].innerText;
    const placa = row.cells[2].innerText;
    const horaEntrada = new Date(row.dataset.horaEntrada);

    modalModelo.innerText = modelo;
    modalPlaca.innerText = placa;
    modalHoraEntrada.innerText = horaEntrada.toLocaleTimeString();
    modalTipo.innerText = tipo;

    const horaSaida = new Date();
    modalHoraSaida.innerText = horaSaida.toLocaleTimeString();

    const total = calculateTotal(horaEntrada, horaSaida);
    modalTotal.innerText = total.toFixed(2);

    modal.style.display = "block";
    modal.dataset.rowIndex = Array.from(vehicleList.rows).indexOf(row);
    modal.dataset.horaEntrada = horaEntrada.toISOString();

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
      total = 10;
    } else {
      total = 10;
      const remainingTime = duration - millisecondsPerHour;
      const additionalHalfHours = Math.ceil(
        remainingTime / millisecondsPerHalfHour
      );
      total += additionalHalfHours * 3.5;
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

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = vehicleList.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      const modeloCell = rows[i].cells[1].innerText.toLowerCase();
      const placaCell = rows[i].cells[2].innerText.toLowerCase();
      const proprietarioCell = rows[i].cells[4].innerText.toLowerCase();
      if (
        searchTerm === "" ||
        modeloCell.includes(searchTerm) ||
        placaCell.includes(searchTerm) ||
        proprietarioCell.includes(searchTerm)
      ) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  });

  const exportReportButton = document.getElementById("exportReportButton");

  exportReportButton.addEventListener("click", () => {
    const rows = vehicleList.getElementsByTagName("tr");
    if (rows.length === 0) {
      alert("Nenhum veículo estacionado para exportar.");
      return;
    }

    let reportContent = `
    <html>
      <head>
        <title>Relatório de Veículos Estacionados</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #555; }
        </style>
      </head>
      <body>
        <h1>Nexus Estacione</h1>
        <p>Relatório de Veículos Estacionados</p>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Modelo</th>
              <th>Placa</th>
              <th>Cor</th>
              <th>Proprietário</th>
              <th>Hora de Entrada</th>
            </tr>
          </thead>
          <tbody>
  `;

    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      const row = Array.from(cells)
        .map((cell) => `<td>${cell.innerText}</td>`)
        .join("");
      reportContent += `<tr>${row}</tr>`;
    }

    reportContent += `
          </tbody>
        </table>
        <div class="footer">
          <p>Relatório gerado por Nexus Estacione em ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `;

    const blob = new Blob([reportContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio_veiculos_estacionados.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  loadVehicles();
});
