export function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

export function formatarMedida(valor, unidade = 'mm') {
    if (unidade === 'm') {
        return `${(valor / 1000).toFixed(2)}m`;
    }
    return `${valor}${unidade}`;
}

export function calcularArea(largura, comprimento) {
    return (largura * comprimento) / 1000000; // Converte para m²
}

export function salvarPDF() {
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

export function exportarExcel() {
    const data = gerarDadosExcel();
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orçamento');
    XLSX.writeFile(wb, `orcamento_${new Date().toISOString().split('T')[0]}.xlsx`);
}
