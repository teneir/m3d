document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Add new row functionality for peças table
    document.querySelector('.adicionar-linha').addEventListener('click', function() {
        const tbody = document.querySelector('#pecas-table tbody');
        const newRow = tbody.rows[0].cloneNode(true);
        
        // Clear input values
        newRow.querySelectorAll('input').forEach(input => input.value = '');
        newRow.querySelector('.peca-quantidade').value = '1';
        
        // Reset select values
        newRow.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });

        // Add click handler to new row's button
        newRow.querySelector('.adicionar-linha').addEventListener('click', function() {
            const tbody = document.querySelector('#pecas-table tbody');
            const newRow = tbody.rows[0].cloneNode(true);
            tbody.appendChild(newRow);
        });

        tbody.appendChild(newRow);
    });

    // Add new accessory row functionality
    document.getElementById('adicionar-acessorio').addEventListener('click', function() {
        const tbody = document.querySelector('#acessorios-table tbody');
        const newRow = tbody.rows[0].cloneNode(true);
        
        // Clear input values
        newRow.querySelectorAll('input').forEach(input => {
            if (input.classList.contains('acessorio-quantidade')) {
                input.value = '1';
            } else {
                input.value = '';
            }
        });
        
        // Reset select values
        newRow.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });

        tbody.appendChild(newRow);
    });

    // Calculate accessory totals
    document.getElementById('acessorios-table').addEventListener('input', function(e) {
        if (e.target.classList.contains('acessorio-quantidade') || 
            e.target.classList.contains('acessorio-preco')) {
            const row = e.target.closest('tr');
            const quantidade = parseFloat(row.querySelector('.acessorio-quantidade').value) || 0;
            const preco = parseFloat(row.querySelector('.acessorio-preco').value) || 0;
            const total = quantidade * preco;
            row.querySelector('.acessorio-total').textContent = `R$ ${total.toFixed(2)}`;
        }
    });

    // Plano de corte functionality
    function desenharPlanoCorte() {
        const container = document.getElementById('plano-corte-container');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 1100;  // Scaled down from 2750mm
        canvas.height = 740;  // Scaled down from 1850mm
        
        // Clear previous content
        container.innerHTML = '';
        container.appendChild(canvas);

        // Draw MDF sheet
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Get pieces from the first tab
        const pecas = [];
        document.querySelectorAll('#pecas-table tbody tr').forEach(row => {
            const nome = row.querySelector('.peca-nome').value;
            const largura = parseFloat(row.querySelector('.peca-largura').value);
            const comprimento = parseFloat(row.querySelector('.peca-comprimento').value);
            const quantidade = parseInt(row.querySelector('.peca-quantidade').value);
            const cor = row.querySelector('.peca-cor').value;

            if (nome && largura && comprimento && quantidade) {
                for (let i = 0; i < quantidade; i++) {
                    pecas.push({
                        nome,
                        largura,
                        comprimento,
                        cor
                    });
                }
            }
        });

        // Sort pieces by area (largest first)
        pecas.sort((a, b) => (b.largura * b.comprimento) - (a.largura * a.comprimento));

        // Scale factors
        const scaleX = canvas.width / 2750;
        const scaleY = canvas.height / 1850;

        // Position pieces
        let currentX = 0;
        let currentY = 0;
        let maxHeightInRow = 0;

        pecas.forEach(peca => {
            const width = peca.largura * scaleX;
            const height = peca.comprimento * scaleY;

            // Check if piece fits in current row
            if (currentX + width > canvas.width) {
                currentX = 0;
                currentY += maxHeightInRow;
                maxHeightInRow = 0;
            }

            // Draw piece
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.strokeRect(currentX, currentY, width, height);

            // Add piece name
            ctx.font = '12px Arial';
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(peca.nome, currentX + width/2, currentY + height/2);

            // Add dimensions
            ctx.font = '10px Arial';
            ctx.fillText(`${peca.largura}x${peca.comprimento}`, currentX + width/2, currentY + height - 10);

            // Update position
            currentX += width;
            maxHeightInRow = Math.max(maxHeightInRow, height);
        });
    }

    // Update plano de corte when switching to that tab
    document.querySelector('[data-tab="plano-corte"]').addEventListener('click', desenharPlanoCorte);

    // Função para gerenciar os campos de fita de borda
    function setupFitaBorda(row) {
        const checkboxes = row.querySelectorAll('.fita-check');
        checkboxes.forEach(checkbox => {
            const corInput = checkbox.closest('.fita-opcao').querySelector('.fita-cor');

            checkbox.addEventListener('change', function() {
                corInput.disabled = !this.checked;
                if (!this.checked) {
                    corInput.value = '';
                }
            });
        });
    }

    // Modifica a função de adicionar linha
    document.querySelector('.adicionar-linha').addEventListener('click', function() {
        const tbody = document.querySelector('#pecas-table tbody');
        const newRow = tbody.rows[0].cloneNode(true);

        // Limpa os campos de input
        newRow.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
            if (input.classList.contains('peca-quantidade')) {
                input.value = '1';
            } else {
                input.value = '';
            }
        });

        // Reseta os checkboxes e campos de fita
        newRow.querySelectorAll('.fita-check').forEach(checkbox => {
            checkbox.checked = false;
        });
        newRow.querySelectorAll('.fita-cor').forEach(input => {
            input.value = '';
            input.disabled = true;
        });

        // Configura os eventos da nova linha
        setupFitaBorda(newRow);

        tbody.appendChild(newRow);
    });

    // Configura os eventos da primeira linha
    setupFitaBorda(document.querySelector('#pecas-table tbody tr'));

    // Modifica a função de desenhar plano de corte para incluir informações das fitas
    function desenharPlanoCorte() {
        // ... (código anterior do plano de corte) ...

        pecas.forEach(peca => {
            // ... (código existente) ...

            // Adicionar informação das fitas de borda ao desenho
            const fitasInfo = [];
            row.querySelectorAll('.fita-check:checked').forEach(checkbox => {
                const lado = checkbox.getAttribute('data-lado');
                const cor = checkbox.closest('.fita-opcao').querySelector('.fita-cor').value;
                fitasInfo.push(`${lado}: ${cor}`);
            });

            if (fitasInfo.length > 0) {
                ctx.font = '8px Arial';
                ctx.fillText(fitasInfo.join(', '), currentX + width/2, currentY + height - 20);
            }
        });
    }

    // Calculate and display final budget
    function atualizarOrcamento() {
        const container = document.getElementById('orcamento-container');
        let html = `
        <h3>Orçamento Detalhado</h3>
        <div class="timestamp">Gerado em: 2025-04-11 00:32:59 por teneir</div>
        `;

        // 1. Cálculo das chapas de MDF
        const chapas = {};
        let areaTotal = 0;
        const CHAPA_PADRAO = {
            largura: 1850,
            comprimento: 2750,
            area: 1850 * 2750
        };

        document.querySelectorAll('#pecas-table tbody tr').forEach(row => {
            const cor = row.querySelector('.peca-cor').value;
            const largura = parseFloat(row.querySelector('.peca-largura').value) || 0;
            const comprimento = parseFloat(row.querySelector('.peca-comprimento').value) || 0;
            const quantidade = parseInt(row.querySelector('.peca-quantidade').value) || 0;

            if (cor && largura && comprimento && quantidade) {
                if (!chapas[cor]) {
                    chapas[cor] = {
                        pecas: [],
                        areaTotal: 0,
                        quantidadeChapas: 0
                    };
                }

                const areaPeca = (largura * comprimento * quantidade);
                chapas[cor].pecas.push({
                    nome: row.querySelector('.peca-nome').value,
                                       largura,
                                       comprimento,
                                       quantidade,
                                       area: areaPeca
                });
                chapas[cor].areaTotal += areaPeca;
            }
        });

        // Calcular quantidade de chapas necessárias
        for (const cor in chapas) {
            chapas[cor].quantidadeChapas = Math.ceil(chapas[cor].areaTotal / CHAPA_PADRAO.area);
        }

        // 2. Cálculo das fitas de borda
        const fitasPorCor = {};
        document.querySelectorAll('#pecas-table tbody tr').forEach(row => {
            row.querySelectorAll('.fita-check:checked').forEach(checkbox => {
                const cor = checkbox.closest('.fita-opcao').querySelector('.fita-cor').value;
                if (!cor) return;

                const lado = checkbox.getAttribute('data-lado');
                const quantidade = parseInt(row.querySelector('.peca-quantidade').value) || 0;
                const largura = parseFloat(row.querySelector('.peca-largura').value) || 0;
                const comprimento = parseFloat(row.querySelector('.peca-comprimento').value) || 0;

                let comprimentoFita;
                if (lado.includes('largura')) {
                    comprimentoFita = largura;
                } else {
                    comprimentoFita = comprimento;
                }

                if (!fitasPorCor[cor]) {
                    fitasPorCor[cor] = {
                        comprimentoTotal: 0,
                        pecas: []
                    };
                }

                fitasPorCor[cor].comprimentoTotal += (comprimentoFita * quantidade);
                fitasPorCor[cor].pecas.push({
                    nome: row.querySelector('.peca-nome').value,
                                            lado,
                                            comprimento: comprimentoFita,
                                            quantidade
                });
            });
        });

        // 3. Cálculo dos acessórios
        const acessorios = [];
        let totalAcessorios = 0;
        document.querySelectorAll('#acessorios-table tbody tr').forEach(row => {
            const tipo = row.querySelector('.acessorio-tipo').value;
            const quantidade = parseFloat(row.querySelector('.acessorio-quantidade').value) || 0;
            const precoUnitario = parseFloat(row.querySelector('.acessorio-preco').value) || 0;
            const total = quantidade * precoUnitario;

            if (quantidade > 0 && precoUnitario > 0) {
                acessorios.push({
                    tipo,
                    quantidade,
                    precoUnitario,
                    total
                });
                totalAcessorios += total;
            }
        });

        // 4. Custos adicionais
        const custos = {
            frete: parseFloat(document.getElementById('frete').value) || 0,
                          valorHora: parseFloat(document.getElementById('valor-hora').value) || 0,
                          horasEstimadas: parseFloat(document.getElementById('horas-estimadas').value) || 0,
                          despesasGerais: parseFloat(document.getElementById('despesas-gerais').value) || 0
        };

        const custoMaoDeObra = custos.valorHora * custos.horasEstimadas;

        // 5. Montagem do HTML do orçamento
        html += `
        <div class="orcamento-secao">
        <h4>1. Chapas de MDF</h4>
        ${Object.entries(chapas).map(([cor, dados]) => `
            <div class="material-grupo">
            <h5>MDF ${cor}</h5>
            <ul>
            <li>Quantidade de chapas necessárias: ${dados.quantidadeChapas}</li>
            <li>Área total utilizada: ${(dados.areaTotal / 1000000).toFixed(2)} m²</li>
            <li>Aproveitamento: ${((dados.areaTotal / (dados.quantidadeChapas * CHAPA_PADRAO.area)) * 100).toFixed(1)}%</li>
            </ul>
            <details>
            <summary>Detalhamento das peças</summary>
            <ul class="pecas-lista">
            ${dados.pecas.map(peca => `
                <li>${peca.nome}: ${peca.largura}mm x ${peca.comprimento}mm (${peca.quantidade} unidades)</li>
                `).join('')}
                </ul>
                </details>
                </div>
                `).join('')}
                </div>

                <div class="orcamento-secao">
                <h4>2. Fitas de Borda</h4>
                ${Object.entries(fitasPorCor).map(([cor, dados]) => `
                    <div class="material-grupo">
                    <h5>Fita ${cor}</h5>
                    <ul>
                    <li>Comprimento total: ${(dados.comprimentoTotal / 1000).toFixed(2)} metros</li>
                    <li>Comprimento total + 10% de sobra: ${((dados.comprimentoTotal * 1.1) / 1000).toFixed(2)} metros</li>
                    </ul>
                    <details>
                    <summary>Detalhamento por peça</summary>
                    <ul class="pecas-lista">
                    ${dados.pecas.map(peca => `
                        <li>${peca.nome} - ${peca.lado}: ${peca.comprimento}mm (${peca.quantidade} unidades)</li>
                        `).join('')}
                        </ul>
                        </details>
                        </div>
                        `).join('')}
                        </div>

                        <div class="orcamento-secao">
                        <h4>3. Acessórios</h4>
                        ${acessorios.length > 0 ? `
                            <table class="tabela-acessorios">
                            <thead>
                            <tr>
                            <th>Item</th>
                            <th>Quantidade</th>
                            <th>Preço Unitário</th>
                            <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${acessorios.map(item => `
                                <tr>
                                <td>${item.tipo}</td>
                                <td>${item.quantidade}</td>
                                <td>R$ ${item.precoUnitario.toFixed(2)}</td>
                                <td>R$ ${item.total.toFixed(2)}</td>
                                </tr>
                                `).join('')}
                                </tbody>
                                <tfoot>
                                <tr>
                                <td colspan="3"><strong>Total Acessórios:</strong></td>
                                <td><strong>R$ ${totalAcessorios.toFixed(2)}</strong></td>
                                </tr>
                                </tfoot>
                                </table>
                                ` : '<p>Nenhum acessório adicionado</p>'}
                                </div>

                                <div class="orcamento-secao">
                                <h4>4. Custos Adicionais</h4>
                                <table class="tabela-custos">
                                <tr>
                                <td>Frete:</td>
                                <td>R$ ${custos.frete.toFixed(2)}</td>
                                </tr>
                                <tr>
                                <td>Mão de obra:</td>
                                <td>R$ ${custoMaoDeObra.toFixed(2)} (${custos.horasEstimadas}h x R$ ${custos.valorHora.toFixed(2)}/h)</td>
                                </tr>
                                <tr>
                                <td>Despesas gerais:</td>
                                <td>R$ ${custos.despesasGerais.toFixed(2)}</td>
                                </tr>
                                </table>
                                </div>

                                <div class="orcamento-total">
                                <h4>Total Geral</h4>
                                <table class="tabela-total">
                                <tr>
                                <td>Acessórios:</td>
                                <td>R$ ${totalAcessorios.toFixed(2)}</td>
                                </tr>
                                <tr>
                                <td>Frete:</td>
                                <td>R$ ${custos.frete.toFixed(2)}</td>
                                </tr>
                                <tr>
                                <td>Mão de obra:</td>
                                <td>R$ ${custoMaoDeObra.toFixed(2)}</td>
                                </tr>
                                <tr>
                                <td>Despesas gerais:</td>
                                <td>R$ ${custos.despesasGerais.toFixed(2)}</td>
                                </tr>
                                <tr class="total-final">
                                <td><strong>Total Final:</strong></td>
                                <td><strong>R$ ${(totalAcessorios + custos.frete + custoMaoDeObra + custos.despesasGerais).toFixed(2)}</strong></td>
                                </tr>
                                </table>
                                </div>
                                `;

                                container.innerHTML = html;
    }

    // Update budget when switching to that tab
    document.querySelector('[data-tab="orcamento"]').addEventListener('click', atualizarOrcamento);

    // Add input event listeners for real-time calculations
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', atualizarOrcamento);
    });
});
