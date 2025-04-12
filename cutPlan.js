export function initCutPlan() {
    document.querySelector('[data-tab="plano-corte"]').addEventListener('click', desenharPlanoCorte);
}

function desenharPlanoCorte() {
    const container = document.getElementById('plano-corte-container');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    configurarCanvas(canvas);
    const pecas = coletarPecas();
    desenharPecas(ctx, pecas);
}

function configurarCanvas(canvas) {
    canvas.width = 1100;
    canvas.height = 740;

    const container = document.getElementById('plano-corte-container');
    container.innerHTML = '';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    return ctx;
}

function coletarPecas() {
    const pecas = [];
    document.querySelectorAll('#pecas-table tbody tr').forEach(row => {
        const peca = extrairDadosPeca(row);
        if (peca) {
            for (let i = 0; i < peca.quantidade; i++) {
                pecas.push(peca);
            }
        }
    });
    return pecas.sort((a, b) => (b.largura * b.comprimento) - (a.largura * a.comprimento));
}

function extrairDadosPeca(row) {
    const nome = row.querySelector('.peca-nome').value;
    const largura = parseFloat(row.querySelector('.peca-largura').value);
    const comprimento = parseFloat(row.querySelector('.peca-comprimento').value);
    const quantidade = parseInt(row.querySelector('.peca-quantidade').value);
    const cor = row.querySelector('.peca-cor').value;

    if (nome && largura && comprimento && quantidade && cor) {
        return { nome, largura, comprimento, cor, quantidade };
    }
    return null;
}

function desenharPecas(ctx, pecas) {
    const scaleX = ctx.canvas.width / 2750;
    const scaleY = ctx.canvas.height / 1850;
    let currentX = 0;
    let currentY = 0;
    let maxHeightInRow = 0;

    pecas.forEach(peca => {
        const width = peca.largura * scaleX;
        const height = peca.comprimento * scaleY;

        if (currentX + width > ctx.canvas.width) {
            currentX = 0;
            currentY += maxHeightInRow;
            maxHeightInRow = 0;
        }

        desenharPeca(ctx, currentX, currentY, width, height, peca);

        currentX += width;
        maxHeightInRow = Math.max(maxHeightInRow, height);
    });
}

function desenharPeca(ctx, x, y, width, height, peca) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    ctx.font = '12px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(peca.nome, x + width/2, y + height/2);

    ctx.font = '10px Arial';
    ctx.fillText(`${peca.largura}x${peca.comprimento}`, x + width/2, y + height - 10);
}
