import { atualizarSelectCores } from './mdfSheets.js';

export function initPieces() {
    document.querySelector('.adicionar-linha').addEventListener('click', adicionarLinhaPeca);
    setupFitaBorda(document.querySelector('#pecas-table tbody tr'));

    // Adicionando evento ao botão de configuração de fitas de borda
    document.getElementById('configurar-fita-borda').addEventListener('click', abrirModalFitaBorda);
}

function adicionarLinhaPeca() {
    const tbody = document.querySelector('#pecas-table tbody');
    const newRow = tbody.rows[0].cloneNode(true);

    limparCamposPeca(newRow);
    setupFitaBorda(newRow);
    tbody.appendChild(newRow);
}

function limparCamposPeca(row) {
    row.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
        if (input.classList.contains('peca-quantidade')) {
            input.value = '1';
        } else {
            input.value = '';
        }
    });

    row.querySelector('.peca-cor').value = '';

    row.querySelectorAll('.fita-check').forEach(checkbox => {
        checkbox.checked = false;
    });
    row.querySelectorAll('.fita-cor').forEach(input => {
        input.value = '';
        input.disabled = true;
    });
}

function setupFitaBorda(row) {
    const checkboxes = row.querySelectorAll('.fita-check');
    checkboxes.forEach(checkbox => {
        const corInput = checkbox.closest('.fita-opcao').querySelector('.fita-cor');
        checkbox.addEventListener('change', () => {
            corInput.disabled = !checkbox.checked;
            if (!checkbox.checked) {
                corInput.value = '';
            }
        });
    });
}

// Função para abrir o modal de configuração de fitas de borda
function abrirModalFitaBorda() {
    const modal = document.querySelector('#modal-fita-borda');
    modal.style.display = 'block';

    // Populando o modal com as opções disponíveis
    const fitasDisponiveis = obterFitasDisponiveis();
    const select = modal.querySelector('#fita-borda-select');
    select.innerHTML = fitasDisponiveis.map(fita => `<option value="${fita}">${fita}</option>`).join('');
}

// Função auxiliar para obter as fitas disponíveis
function obterFitasDisponiveis() {
    return ['Branca', 'Preta', 'Madeira', 'Cinza']; // Exemplos; pode ser dinâmico
}

// Fechar o modal ao clicar no botão "Salvar" ou "Cancelar"
document.getElementById('salvar-fita-borda').addEventListener('click', salvarFitaBorda);
document.getElementById('cancelar-fita-borda').addEventListener('click', () => {
    document.querySelector('#modal-fita-borda').style.display = 'none';
});

function salvarFitaBorda() {
    const modal = document.querySelector('#modal-fita-borda');
    const corSelecionada = modal.querySelector('#fita-borda-select').value;

    if (corSelecionada) {
        alert(`Fita de borda configurada: ${corSelecionada}`);
    }

    modal.style.display = 'none';
}
