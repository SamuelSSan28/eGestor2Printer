# 📄 Projeto: Extensão de Cupom Fiscal para Chrome

## 📝 Descrição
Esta extensão do Google Chrome gera e imprime automaticamente um cupom fiscal a partir de uma página de pedidos, utilizando as informações da empresa armazenadas nas configurações.

---

## 📂 Estrutura do Projeto:
```
📁 raiz do projeto
 ├── 📄 manifest.json           // Configuração principal da extensão
 ├── 📄 popup.html              // Interface da extensão (botão Gerar Cupom)
 ├── 📄 popup.js                // Script principal para capturar dados e gerar cupom
 ├── 📄 options.html            // Página de configurações
 ├── 📄 options.js              // Script para salvar configurações
 └── 📄 README.md               // Este arquivo
```
---

## 🚀 Como Executar a Extensão
1. **Abra o Google Chrome** e vá para `chrome://extensions/`.
2. Ative o modo desenvolvedor (canto superior direito).
3. Clique em **Carregar sem compactação** e selecione a pasta do projeto.
4. A extensão aparecerá com o ícone na barra de ferramentas.

---

## ⚙️ Configuração da Empresa
- Acesse as opções da extensão para configurar:
  - Nome da Empresa
  - Nome Fantasia
  - Endereço
  - CNPJ
  - Inscrição Estadual
---

## 🧩 Funcionamento
- Clique em **"Gerar Cupom"**.
- A extensão coleta os dados da página de pedidos.
- Exibe o cupom em uma nova aba com formatação pronta para impressão.
---

## 💡 Tecnologias Utilizadas
- **JavaScript**
- **HTML/CSS**
- **Chrome Extensions API**
---

## 📞 Suporte
Para dúvidas ou sugestões, entre em contato com o desenvolvedor.

