// Funções auxiliares para o sistema de orçamento

// Formatar moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Formatar medidas
function formatarMedida(valor, unidade = 'mm') {
    if (unidade === 'm') {
        return `${(valor / 1000).toFixed(2)}m`;
    }
    return `${valor}${unidade}`;
}

// Calcular área total
function calcularArea(largura, comprimento) {
    return (largura * comprimento) / 1000000; // Converte para m²
}

// Salvar orçamento em PDF
function salvarPDF() {
    const element = document.getElementById('orcamento-container');
    const opt = {
        margin: 1,
        filename: `orcamento_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

// Exportar para Excel
function exportarExcel() {
    const data = [];
    // Adicionar cabeçalho
    data.push(['Orçamento - Gerado em: ' + new Date().toLocaleString()]);
    data.push(['']);

    // Adicionar dados das peças
    data.push(['Peças de MDF']);
    data.push(['Nome', 'Largura', 'Comprimento', 'Quantidade', 'Cor MDF', 'Fitas']);
    
    document.querySelectorAll('#pecas-table tbody tr').forEach(row => {
        const fitas = Array.from(row.querySelectorAll('.fita-check:checked'))
            .map(check => {
                const cor = check.closest('.fita-opcao').querySelector('.fita-cor').value;
                const lado = check.getAttribute('data-lado');
                return `${lado}: ${cor}`;
            }).join('; ');

        data.push([
            row.querySelector('.peca-nome').value,
            row.querySelector('.peca-largura').value,
            row.querySelector('.peca-comprimento').value,
            row.querySelector('.peca-quantidade').value,
            row.querySelector('.peca-cor').value,
            fitas
        ]);
    });

    // Criar e baixar o arquivo Excel
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orçamento');
    XLSX.writeFile(wb, `orcamento_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Adicionar eventos aos botões de exportação
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar botões de controle
    const controls = document.createElement('div');
    controls.className = 'orcamento-controls';
    controls.innerHTML = `
        <button class="orcamento-btn btn-print" onclick="window.print()">
            <i class="fas fa-print"></i> Imprimir
        </button>
        <button class="orcamento-btn btn-save" onclick="salvarPDF()">
            <i class="fas fa-file-pdf"></i> Salvar PDF
        </button>
        <button class="orcamento-btn btn-export" onclick="exportarExcel()">
            <i class="fas fa-file-excel"></i> Exportar Excel
        </button>
    `;

    document.getElementById('orcamento-container').prepend(controls);
});

// Validação de campos
function validarCampos() {
    const campos = document.querySelectorAll('input[required]');
    let valido = true;

    campos.forEach(campo => {
        if (!campo.value.trim()) {
            campo.classList.add('invalid');
            valido = false;
        } else {
            campo.classList.remove('invalid');
        }
    });

    return valido;
}

// Atualizar totais em tempo real
function atualizarTotaisEmTempoReal() {
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (validarCampos()) {
                atualizarOrcamento();
            }
        });
    });
}

// Inicializar tooltips para ajuda
function inicializarTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        tippy(element, {
            content: element.getAttribute('data-tooltip'),
            placement: 'top'
        });
    });
}