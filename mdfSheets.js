let chapasDisponiveis = [];

export function initMdfSheets() {
    document.querySelector('.adicionar-chapa').addEventListener('click', adicionarChapa);
    window.removerChapa = removerChapa; // Função global para o onclick do HTML
}

export function getChapasDisponiveis() {
    return chapasDisponiveis;
}

function adicionarChapa(event) {
    const row = event.target.closest('tr');
    const cor = row.querySelector('.chapa-cor').value.trim();
    const largura = parseFloat(row.querySelector('.chapa-largura').value);
    const comprimento = parseFloat(row.querySelector('.chapa-comprimento').value);

    if (cor && largura && comprimento) {
        if (chapasDisponiveis.some(chapa => chapa.cor.toLowerCase() === cor.toLowerCase())) {
            alert('Esta cor já está cadastrada!');
            return;
        }

        chapasDisponiveis.push({ cor, largura, comprimento });

        limparCamposChapa(row);
        adicionarLinhaChapa(cor, largura, comprimento);
        atualizarSelectCores();
    }
}

function limparCamposChapa(row) {
    row.querySelector('.chapa-cor').value = '';
    row.querySelector('.chapa-largura').value = '1850';
    row.querySelector('.chapa-comprimento').value = '2750';
}

function adicionarLinhaChapa(cor, largura, comprimento) {
    const tbody = document.querySelector('#chapas-table tbody');
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td>${cor}</td>
        <td>${largura}</td>
        <td>${comprimento}</td>
        <td><button class="remover-chapa" onclick="removerChapa(this, '${cor}')">×</button></td>
    `;
    tbody.appendChild(novaLinha);
}

function removerChapa(button, cor) {
    if (confirm(`Deseja remover a chapa ${cor}?`)) {
        if (verificarChapaEmUso(cor)) {
            alert('Esta cor está sendo usada em algumas peças. Remova ou altere as peças primeiro.');
            return;
        }

        chapasDisponiveis = chapasDisponiveis.filter(chapa => chapa.cor !== cor);
        button.closest('tr').remove();
        atualizarSelectCores();
    }
}

function verificarChapaEmUso(cor) {
    return Array.from(document.querySelectorAll('.peca-cor')).some(select => select.value === cor);
}

export function atualizarSelectCores() {
    const selects = document.querySelectorAll('.peca-cor');
    const options = chapasDisponiveis.map(chapa =>
        `<option value="${chapa.cor}">${chapa.cor}</option>`
    ).join('');

    selects.forEach(select => {
        const valorAtual = select.value;
        select.innerHTML = '<option value="">Selecione a cor</option>' + options;
        if (chapasDisponiveis.some(chapa => chapa.cor === valorAtual)) {
            select.value = valorAtual;
        }
    });
}
