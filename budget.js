import { getChapasDisponiveis } from './mdfSheets.js';

export function initBudget() {
    document.querySelector('[data-tab="orcamento"]').addEventListener('click', atualizarOrcamento);
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', atualizarOrcamento);
    });
}

function atualizarOrcamento() {
    const container = document.getElementById('orcamento-container');
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const username = "teneir"; // Aqui você pode pegar o username de uma variável global ou configuração

    let html = `
    <h3>Orçamento Detalhado</h3>
    <div class="timestamp">Gerado em: ${timestamp} por ${username}</div>
    `;

    const chapas = calcularChapas();
    const fitasBorda = calcularFitasBorda();
    const acessorios = calcularAcessorios();
    const custosAdicionais = calcularCustosAdicionais();

    html += gerarHtmlChapas(chapas);
    html += gerarHtmlFitasBorda(fitasBorda);
    html += gerarHtmlAcessorios(acessorios);
    html += gerarHtmlCustosAdicionais(custosAdicionais);
    html += gerarHtmlTotal(chapas, fitasBorda, acessorios, custosAdicionais);

    container.innerHTML = html;
}

// Implementar as funções auxiliares para cálculos e geração de HTML...
