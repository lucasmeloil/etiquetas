const totalVagas = 50;
const vagas = Array.from({ length: totalVagas }, (_, i) => ({
    id: i + 1,
    ocupada: false,
    info: {}
}));

function initVagas() {
    const vagaContainer = document.getElementById('vaga-container');
    vagaContainer.innerHTML = ''; // Limpa o container

    // Carrega as informações das vagas do localStorage
    for (let i = 0; i < totalVagas; i++) {
        const vagaData = localStorage.getItem(`vaga_${i + 1}`);
        if (vagaData) {
            vagas[i].ocupada = true;
            vagas[i].info = JSON.parse(vagaData);
        }
    }

    // Cria os elementos das vagas
    vagas.forEach(vaga => {
        const vagaDiv = document.createElement('div');
        vagaDiv.className = 'vaga';

        if (vaga.ocupada) {
            vagaDiv.classList.add('ocupada'); // Vaga ocupada (vermelha)
            vagaDiv.innerHTML = `
                <strong>Vaga ${vaga.id}</strong><br>
                <span>${vaga.info.tipo}</span><br>
                <span>${vaga.info.modelo}</span><br>
                <span>${vaga.info.placa}</span><br>
                <span>${vaga.info.proprietario}</span>
            `;
        } else {
            vagaDiv.classList.add('livre'); // Vaga livre (verde)
            vagaDiv.textContent = `Vaga ${vaga.id}`;
        }

        vagaDiv.onclick = () => {
            if (!vaga.ocupada) {
                abrirModal(vaga.id); // Vaga livre
            } else {
                mostrarInfoVeiculo(vaga); // Vaga ocupada
            }
        };

        vagaContainer.appendChild(vagaDiv);
    });
}

function abrirModal(vagaId) {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    const vehicleForm = document.getElementById('vehicle-form');
    vehicleForm.onsubmit = (event) => {
        event.preventDefault();
        registrarVeiculo(vagaId);
        fecharModal();
    };
}

function mostrarInfoVeiculo(vaga) {
    const infoModal = document.getElementById('modal');
    infoModal.style.display = 'block';

    const modalContent = `
        <h2>Informações do Veículo</h2>
        <p><strong>Tipo:</strong> ${vaga.info.tipo}</p>
        <p><strong>Modelo:</strong> ${vaga.info.modelo}</p>
        <p><strong>Placa:</strong> ${vaga.info.placa}</p>
        <p><strong>Cor:</strong> ${vaga.info.cor}</p>
        <p><strong>Proprietário:</strong> ${vaga.info.proprietario}</p>
        <button onclick="darSaida(${vaga.id})">Dar Saída</button>
        <button onclick="fecharModal()">Fechar</button>
    `;

    // Limpa o conteúdo anterior e adiciona as informações
    infoModal.querySelector('.modal-content').innerHTML = modalContent;
}

function darSaida(vagaId) {
    // Remove a vaga do localStorage e libera a vaga
    localStorage.removeItem(`vaga_${vagaId}`);
    const vaga = vagas.find(v => v.id === vagaId);
    vaga.ocupada = false;
    vaga.info = {};
    
    alert(`Vaga ${vagaId} foi liberada!`);
    initVagas(); // Atualiza a visualização das vagas
}

function fecharModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function registrarVeiculo(vagaId) {
    const veiculo = {
        tipo: document.getElementById('tipo').value,
        modelo: document.getElementById('modelo').value,
        placa: document.getElementById('placa').value,
        cor: document.getElementById('cor').value,
        proprietario: document.getElementById('proprietario').value,
    };

    const vaga = vagas.find(v => v.id === vagaId);
    if (vaga && !vaga.ocupada) {
        vaga.ocupada = true;
        vaga.info = veiculo;
        localStorage.setItem(`vaga_${vagaId}`, JSON.stringify(veiculo)); // Salva no localStorage
        alert(`Vaga ${vagaId} foi alocada!`);
        initVagas(); // Atualiza a visualização das vagas
    } else {
        alert(`Vaga ${vagaId} já está ocupada.`);
    }
}

// Inicializa o sistema de vagas ao carregar a página
document.addEventListener('DOMContentLoaded', initVagas);
