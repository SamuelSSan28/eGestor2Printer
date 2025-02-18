document.getElementById('generateAndPrint').addEventListener('click', () => {
    chrome.storage.sync.get([
      'companyName', 
      'fantasyName', 
      'companyAddress', 
      'companyCnpj', 
      'companyIe', 
      'satNumber'
    ], (options) => {
      const company = {
        name: options.companyName || 'Empresa Padrão',
        fantasyName: options.fantasyName || 'Nome Fantasia',
        address: options.companyAddress || 'Endereço não informado',
        cnpj: options.companyCnpj || '12.345.678/0001-99',
        ie: options.companyIe || '123456789',
        sat: options.satNumber || 'SAT123456789'
      };
  
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: generateCupom,
          args: [company]
        });
      });
    });
  });
  
  // Função principal que gera e imprime o cupom
  function generateCupom(company) {
    // 1️⃣ Coletar dados da página
    const cliente = document.querySelector('._dadosCliente2:nth-child(2)')?.innerText?.replace('Cliente:', '').trim() || 'Desconhecido';
    const telefone = document.querySelector('._dadosCliente2:nth-child(3)')?.innerText?.replace('Telefone:', '').trim() || 'Não informado';
    const email = document.querySelector('._dadosCliente2:nth-child(4)')?.innerText?.replace('E-mail:', '').trim() || 'Não informado';
    const endereco = document.querySelector('._dadosCliente2:nth-child(5)')?.innerText?.replace('Endereço:', '').trim() || 'Não informado';
    const vendedor = document.querySelector('._datas')?.innerText?.match(/Vendedor:\s*(.*)/)?.[1] || 'Não informado';
    const dataVenda = document.querySelector('._datas')?.innerText?.match(/Data:\s*(.*)/)?.[1] || new Date().toLocaleDateString('pt-BR');
    const horaVenda = new Date().toLocaleTimeString('pt-BR');
  
    // 2️⃣ Coletar forma de pagamento
    const formaPagamento = document.querySelector('._financeiro tbody ._financeiro_formaPgto')?.innerText?.trim() || 'Não informada';
  
    // 3️⃣ Coletar itens da venda
    const itens = Array.from(document.querySelectorAll('._carrinho tbody tr')).map(row => {
      const cols = row.querySelectorAll('td');
      return {
        codigo: '-',
        descricao: cols[1]?.innerText?.trim() || '',
        quantidade: cols[3]?.innerText?.trim() || '',
        unidade: 'Un',
        valorUnitario: cols[2]?.innerText?.trim() || '',
        valorTotal: cols[5]?.innerText?.trim() || ''
      };
    });
  
    const totalVenda = document.querySelector('._carrinho tfoot ._carrinho_total')?.innerText || 'R$ 0,00';
    const valorPago = document.querySelector('._financeiro tfoot ._financeiro_valor')?.innerText || 'R$ 0,00';
    const troco = "0,00";
  
    // 4️⃣ Gerar o cupom conforme seu modelo fornecido
    const cupomHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Cupom Fiscal</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .cupom { width: 80mm; padding: 10px; border: 1px solid #000; margin: auto; }
        .titulo { text-align: center; font-weight: bold; font-size: 16px; }
        .secao { margin-bottom: 10px; }
        .linha { border-bottom: 1px dashed #000; margin: 5px 0; }
        .negrito { font-weight: bold; }
        .pequeno { font-size: 12px; }
        .tabela-itens { width: 100%; border-collapse: collapse; font-size: 12px; }
        .tabela-itens th, .tabela-itens td { border-bottom: 1px dashed #000; padding: 2px; text-align: left; }
        .codigo-barras { text-align: center; font-family: 'Courier New', Courier, monospace; margin-top: 10px; }
      </style>
    </head>
    <body>
  
    <div class="cupom">
        <div class="titulo">${company.name}</div>
        <div class="pequeno">${company.fantasyName}</div>
        <div class="pequeno">${company.address}</div>
        <div class="pequeno negrito">CNPJ: ${company.cnpj} IE: ${company.ie}</div>
        <div class="linha"></div>
  
        <div class="secao">
            <div class="negrito">CUPOM FISCAL ELETRÔNICO - SAT</div>
        </div>
  
        <div class="secao">
            <div class="negrito">Cliente: ${cliente}</div>
            <div>Telefone: ${telefone}</div>
            <div>Email: ${email}</div>
            <div>Vendedor: ${vendedor}</div>
        </div>
  
        <div class="secao">
            <table class="tabela-itens">
                <thead>
                    <tr>
                        <th>Cód</th>
                        <th>Descrição</th>
                        <th>Qtd</th>
                        <th>Un</th>
                        <th>Vl Un R$</th>
                        <th>Vl Item R$</th>
                    </tr>
                </thead>
                <tbody>
                    ${itens.map(item => `
                    <tr>
                        <td>${item.codigo}</td>
                        <td>${item.descricao}</td>
                        <td>${item.quantidade}</td>
                        <td>${item.unidade}</td>
                        <td>${item.valorUnitario}</td>
                        <td>${item.valorTotal}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
  
        <div class="secao">
            <div class="negrito">Forma de pagamento:</div> ${formaPagamento}
        </div>
  
        <div class="secao">
            <div class="negrito">Total R$: ${totalVenda}</div>
            <div>Dinheiro: ${valorPago}</div>
            <div>Troco: ${troco}</div>
        </div>
  
        <div class="secao">
            <div class="negrito">SAT Nº: ${company.sat}</div>
            <div>${dataVenda} - ${horaVenda}</div>
        </div>
  
        <div class="linha"></div>
  
        <div class="codigo-barras">12345678901234567890</div>
    </div>
  
    </body>
    </html>
    `;
  
    // 5️⃣ Abrir uma nova janela e imprimir
    const printWindow = window.open('', '_blank');
    printWindow.document.write(cupomHtml);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }
  