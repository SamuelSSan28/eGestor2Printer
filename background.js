chrome.runtime.onInstalled.addListener(() => {
    console.log('Extensão de Cupom Fiscal instalada com sucesso!');
    chrome.storage.sync.set({ companyName: 'Empresa Padrão' });
  });
  