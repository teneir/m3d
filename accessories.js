export function initAccessories() {
    document.getElementById('adicionar-acessorio').addEventListener('click', adicionarAcessorio);
    document.getElementById('acessorios-table').addEventListener('input', calcularTotalAcessorio);
}

function adicionarAcessorio() {
    const tbody = document.querySelector('#acessorios-table tbody');
    const newRow = tbody.rows[0].cloneNode(true);

    limparCamposAcessorio(newRow);
    tbody.appendChild(newRow);
}

function limparCamposAcessorio(row) {
    row.querySelectorAll('input').forEach(input => {
        if (input.classList.contains('acessorio-quantidade')) {
            input.value = '1';
        } else {
            input.value = '';
        }
    });

    row.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
}

function calcularTotalAcessorio(event) {
    if (event.target.classList.contains('acessorio-quantidade') ||
        event.target.classList.contains('acessorio-preco')) {
        const row = event.target.closest('tr');
        const quantidade = parseFloat(row.querySelector('.acessorio-quantidade').value) || 0;
        const preco = parseFloat(row.querySelector('.acessorio-preco').value) || 0;
        const total = quantidade * preco;
        row.querySelector('.acessorio-total').textContent = `R$ ${total.toFixed(2)}`;
    }
}
