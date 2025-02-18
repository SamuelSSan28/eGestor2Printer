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
      address: options.companyAddress || 'Endereco Nao informado',
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
  // Função auxiliar: remove acentos e converte para maiúsculas
  function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  }

  // 1️⃣ Coletar dados da página
  const cliente = document.querySelector('._dadosCliente2:nth-child(2)')?.innerText?.replace('Cliente:', '').trim() || 'Desconhecido';
  const telefone = document.querySelector('._dadosCliente2:nth-child(3)')?.innerText?.replace('Telefone:', '').trim() || 'Nao informado';
  const email = document.querySelector('._dadosCliente2:nth-child(4)')?.innerText?.replace('E-mail:', '').trim() || 'Nao informado';
  const endereco = document.querySelector('._dadosCliente2:nth-child(5)')?.innerText?.replace('Endereco:', '').trim() || 'Nao informado';
  const vendedor = document.querySelector('._datas')?.innerText?.match(/Vendedor:\s*(.*)/)?.[1] || 'Nao informado';
  const dataVenda = document.querySelector('._datas')?.innerText?.match(/Data:\s*(.*)/)?.[1] || new Date().toLocaleDateString('pt-BR');
  const horaVenda = new Date().toLocaleTimeString('pt-BR');

  // Normalizando os campos coletados
  const clienteN = normalizeText(cliente);
  const telefoneN = normalizeText(telefone);
  const emailN = normalizeText(email);
  const vendedorN = normalizeText(vendedor);

  // 2️⃣ Forma de pagamento
  const formaPagamentoRaw = document.querySelector('._financeiro tbody ._financeiro_formaPgto')?.innerText?.trim() || 'Nao informada';
  const formaPagamentoN = normalizeText(formaPagamentoRaw);

  // 3️⃣ Itens da venda
  const itens = Array.from(document.querySelectorAll('._carrinho tbody tr')).map(row => {
    const cols = row.querySelectorAll('td');
    return {
      descricao: cols[1]?.innerText?.trim() || '',
      quantidade: cols[3]?.innerText?.trim() || '',
      unidade: 'UN',
      valorUnitario: cols[2]?.innerText?.trim() || '',
      valorTotal: cols[5]?.innerText?.trim() || ''
    };
  }).map(item => ({
    descricao: normalizeText(item.descricao),
    quantidade: item.quantidade,
    unidade: item.unidade,
    valorUnitario: item.valorUnitario,
    valorTotal: item.valorTotal
  }));

  const totalVenda = document.querySelector('._carrinho tfoot ._carrinho_total')?.innerText || 'R$ 0,00';
  const valorPago = document.querySelector('._financeiro tfoot ._financeiro_valor')?.innerText || 'R$ 0,00';

  // 4️⃣ Obter o número da venda a partir do elemento com classe "._titulo"
  const codigoVendaRaw = document.querySelector('._titulo')?.innerText?.trim() || 'SEM CODIGO';
  const match = codigoVendaRaw.match(/\d+/);
  const codigoVendaNormalized = match ? normalizeText(match[0]) : 'SEM CODIGO';
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  const codigoVendaFinal = `${randomChars}${codigoVendaNormalized}`;

  // 5️⃣ Normalizar dados da empresa
  const companyName = normalizeText(company.name);
  const fantasyName = normalizeText(company.fantasyName);
  const companyAddress = normalizeText(company.address);
  const companyCnpj = normalizeText(company.cnpj);
  const companyIe = normalizeText(company.ie);

  // 6️⃣ Gerar o HTML do cupom com o código de venda incluso
  const cupomHtml = `
  <!DOCTYPE html>
  <html lang="PT-BR">
  <head>
    <meta charset="UTF-8">
    <title>CUPOM FISCAL</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
      .cupom { width: 80mm; padding: 10px; border: 1px solid #000; margin: auto; }
      .titulo { text-align: center; font-weight: bold; font-size: 16px; }
      .secao { margin-bottom: 10px; }
      .linha { border-bottom: 1px dashed #000; margin: 5px 0; }
      .negrito { font-weight: bold; }
      .pequeno { font-size: 12px; }
      .tabela-itens { width: 100%; border-collapse: collapse; }
      .tabela-itens th, .tabela-itens td { border-bottom: 1px dashed #000; padding: 2px; text-align: left; white-space: pre-wrap; }
      .codigo-barras { text-align: center; font-family: 'Courier New', Courier, monospace; margin-top: 10px; }
    </style>
  </head>
  <body>

  <div class="cupom">
      <div class="titulo">${companyName}</div>
      <div class="pequeno">${fantasyName}</div>
      <div class="pequeno">${companyAddress}</div>
      <div class="pequeno negrito">CNPJ: ${companyCnpj} IE: ${companyIe}</div>
      <div class="linha"></div>

      <div class="secao">
          <div class="negrito">CUPOM ELETRONICO - ${codigoVendaFinal}</div>
      </div>

      <div class="secao">
          <div class="negrito">CLIENTE: ${clienteN}</div>
          <div>TELEFONE: ${telefoneN}</div>
          <div>EMAIL: ${emailN}</div>
          <div>VENDEDOR: ${vendedorN}</div>
      </div>

      <div class="secao">
          <table class="tabela-itens">
              <thead>
                  <tr>
                      <th>DESCRICAO</th>
                      <th>QTD</th>
                      <th>UN</th>
                      <th>VL UN R$</th>
                      <th>VL ITEM R$</th>
                  </tr>
              </thead>
              <tbody>
                  ${itens.map(item => `
                  <tr>
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
          <div class="negrito">FORMA DE PAGAMENTO:</div> ${formaPagamentoN}
      </div>

      <div class="secao">
          <div class="negrito">TOTAL R$: ${totalVenda}</div>
      </div>

      <div class="secao">
          <div class="pequeno">GERADO EM: ${dataVenda} - ${horaVenda}</div>
      </div>

     <br/>
  </div>

  </body>
  </html>
  `;

  // 7️⃣ Abrir nova janela, escrever o HTML, imprimir e fechar
  const printWindow = window.open('', '_blank');
  printWindow.document.write(cupomHtml);
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
}
