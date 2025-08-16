# Gerir.me - Configuração de Desenvolvimento

## 📋 Visão Geral

Este documento detalha como configurar o ambiente de desenvolvimento para o projeto Gerir.me, incluindo instalação de dependências, execução do servidor local e configurações de desenvolvimento.

---

## 🔧 Pré-requisitos

### Software Necessário
- **Node.js**: Versão 14.0.0 ou superior
- **NPM**: Versão 6.0.0 ou superior
- **Git**: Para controle de versão
- **Navegador Moderno**: Chrome, Firefox, Safari ou Edge

### Verificação dos Pré-requisitos
```bash
# Verificar versão do Node.js
node --version

# Verificar versão do NPM
npm --version

# Verificar versão do Git
git --version
```

---

## 🚀 Configuração Inicial

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd projeto_portfolio_pessoal
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Iniciar Servidor de Desenvolvimento
```bash
npm start
# ou
npm run dev
```

### 4. Acessar a Aplicação
Abra o navegador e acesse: `http://localhost:8080`

---

## 📦 Scripts Disponíveis

### `npm start`
- **Descrição**: Inicia o servidor HTTP na porta 8080
- **Comando**: `npx http-server . -p 8080 -a localhost -o`
- **Funcionalidades**:
  - Serve arquivos estáticos
  - Abre automaticamente no navegador
  - Logs de requisições HTTP
  - Hot reload manual (F5)

### `npm run dev`
- **Descrição**: Alias para `npm start`
- **Uso**: Mesmo comportamento do comando start

### `npm test`
- **Descrição**: Abre a interface do Cypress para testes E2E
- **Comando**: `cypress open`
- **Pré-requisito**: Servidor deve estar rodando

---

## 🌐 Configuração do Servidor

### http-server
O projeto utiliza o `http-server` como servidor de desenvolvimento:

**Configurações Padrão:**
- **Porta**: 8080
- **Host**: localhost
- **CORS**: Desabilitado
- **Cache**: 3600 segundos
- **Timeout**: 120 segundos
- **Auto-abertura**: Habilitada

**Parâmetros Utilizados:**
- `-p 8080`: Define a porta
- `-a localhost`: Define o host
- `-o`: Abre automaticamente no navegador

---

## 🔍 Estrutura do Projeto

```
projeto_portfolio_pessoal/
├── docs/                    # Documentação técnica
├── cypress/                 # Testes E2E
├── index.html              # Página principal
├── script.js               # Lógica da aplicação
├── styles.css              # Estilos CSS
├── package.json            # Configurações NPM
├── package-lock.json       # Lock de dependências
├── cypress.config.js       # Configuração Cypress
├── .gitignore             # Arquivos ignorados pelo Git
└── README.md              # Documentação principal
```

---

## 🧪 Ambiente de Testes

### Cypress E2E
```bash
# Abrir interface do Cypress
npm test

# Executar testes em modo headless
npx cypress run
```

### Dados de Teste
**Usuário Demo:**
- **Email**: `demo@gerir.me`
- **Senha**: `123456`

---

## 🐛 Solução de Problemas

### Porta 8080 em Uso
```bash
# Verificar processos na porta 8080
netstat -ano | findstr :8080

# Matar processo (Windows)
taskkill /PID <PID> /F

# Usar porta alternativa
npx http-server . -p 3000 -a localhost -o
```

### Problemas de Cache
```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Problemas de CORS
- O `http-server` resolve automaticamente problemas de CORS
- Para desenvolvimento, CORS está desabilitado
- Em produção, configure adequadamente

---

## 📝 Logs e Debugging

### Logs do Servidor
O `http-server` exibe logs de todas as requisições:
```
[2024-01-01T12:00:00.000Z] "GET /" "Mozilla/5.0..."
[2024-01-01T12:00:00.001Z] "GET /styles.css" "Mozilla/5.0..."
[2024-01-01T12:00:00.002Z] "GET /script.js" "Mozilla/5.0..."
```

### Debug no Navegador
- **Console**: F12 → Console
- **Network**: F12 → Network
- **Application**: F12 → Application → Local Storage

---

## 🔒 Considerações de Segurança

### Desenvolvimento Local
- Dados armazenados no localStorage
- Sem comunicação com servidor externo
- Isolamento por usuário
- Validação client-side

### Produção
- Considere HTTPS
- Implemente validação server-side
- Configure CSP (Content Security Policy)
- Monitore logs de acesso

---

**Documento criado em**: Janeiro 2025  
**Versão**: 1.0  
**Autor**: Equipe de Desenvolvimento Gerir.me