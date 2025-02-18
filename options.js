// Ao carregar a página, mostrar as configurações salvas
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get([
      'companyName',
      'fantasyName',
      'companyAddress',
      'companyCnpj',
      'companyIe',
      'satNumber'
    ], (result) => {
      document.getElementById('companyName').value = result.companyName || '';
      document.getElementById('fantasyName').value = result.fantasyName || '';
      document.getElementById('companyAddress').value = result.companyAddress || '';
      document.getElementById('companyCnpj').value = result.companyCnpj || '';
      document.getElementById('companyIe').value = result.companyIe || '';
      document.getElementById('satNumber').value = result.satNumber || '';
    });
  });
  
  // Salvar configurações no armazenamento
  document.getElementById('save').addEventListener('click', () => {
    const settings = {
      companyName: document.getElementById('companyName').value.trim(),
      fantasyName: document.getElementById('fantasyName').value.trim(),
      companyAddress: document.getElementById('companyAddress').value.trim(),
      companyCnpj: document.getElementById('companyCnpj').value.trim(),
      companyIe: document.getElementById('companyIe').value.trim(),
      satNumber: document.getElementById('satNumber').value.trim()
    };
  
    chrome.storage.sync.set(settings, () => {
      document.getElementById('status').textContent = 'Configurações salvas com sucesso!';
      setTimeout(() => {
        document.getElementById('status').textContent = '';
      }, 3000);
    });
  });
  