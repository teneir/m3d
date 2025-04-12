import { atualizarSelectCores } from './mdfSheets.js';

export function initPieces() {
    document.querySelector('.adicionar-linha').addEventListener('click', adicionarLinhaPeca);
    setupFitaBorda(document.querySelector('#pecas-table tbody tr'));
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
