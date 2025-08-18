# Gerir.me - Sistema de Gerenciamento Financeiro Pessoal

## 📋 Visão Geral

O **Gerir.me** é uma aplicação web moderna para gerenciamento financeiro pessoal, desenvolvida com foco na simplicidade, segurança e experiência do usuário. A aplicação permite controlar despesas únicas e recorrentes, visualizar dados em calendário e receber notificações de vencimento.

## 🚀 Funcionalidades Principais

### 🔐 Autenticação e Segurança
- **Sistema de Login/Cadastro** com validações robustas
- **Validação de senha forte**: 8+ caracteres com maiúscula, minúscula, número e símbolo
- **Bloqueio por tentativas**: 3 tentativas incorretas = bloqueio por 15 minutos
- **Segregação de dados** por usuário
- **Armazenamento local** seguro com localStorage

### 💰 Gerenciamento de Despesas
- **CRUD completo**: Criar, visualizar, editar e excluir despesas
- **Despesas únicas**: Com data específica e validação de data futura
- **Despesas recorrentes**: Mensais ou anuais com próxima data de cobrança
- **Categorização**: Organização por categorias personalizáveis
- **Filtros dinâmicos**: Filtrar despesas por categoria

### 📊 Dashboard e Visualizações
- **Visão geral financeira**: Totais mensais, recorrentes e únicos
- **Calendário interativo**: Visualização de pagamentos por data
- **Próximos pagamentos**: Lista de vencimentos nos próximos 7 dias
- **Cálculos automáticos**: Projeções mensais e anuais

### 🔔 Notificações e Alertas
- **Notificações push**: Alertas 3 dias antes do vencimento
- **Controle de duplicação**: Uma notificação por dia por despesa
- **Mensagens toast**: Feedback visual para todas as ações
- **Persistência**: Mensagens permanecem até serem fechadas manualmente

### 🎨 Interface e Experiência
- **Modo claro/escuro**: Alternância com persistência da preferência
- **Design responsivo**: Funciona em desktop e mobile
- **Transições suaves**: Animações CSS para melhor UX
- **Acessibilidade**: ARIA labels e navegação por teclado

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Variáveis CSS, Grid, Flexbox, transições
- **JavaScript ES6+**: Classes, arrow functions, async/await
- **Font Awesome**: Ícones vetoriais
- **Web APIs**: Notification API, localStorage

### Ferramentas de Desenvolvimento
- **Serve**: Servidor de desenvolvimento
- **Cypress**: Testes end-to-end
- **npm**: Gerenciamento de dependências

## 📁 Estrutura do Projeto

```
gerir-me/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── script.js               # Lógica JavaScript
├── package.json            # Dependências do projeto
├── cypress.config.js       # Configuração do Cypress
├── cypress/                # Testes automatizados
│   ├── e2e/
│   │   └── register.cy.js  # Testes de registro
│   ├── fixtures/
│   └── support/
└── docs/                   # Documentação
    ├── user-stories.md     # Histórias de usuário
    ├── regras-de-negocio.md # Regras de negócio
    ├── credenciais.md      # Credenciais de teste
    └── defeitos.md         # Log de defeitos
```

## 🎯 User Stories Implementadas

| ID | Descrição | Status |
|----|-----------|--------|
| HU01 | Login de usuário | ✅ Concluída |
| HU02 | Cadastro de usuário | ✅ Concluída |
| HU03 | Cadastrar despesa | ✅ Concluída |
| HU04 | Visualizar despesas | ✅ Concluída |
| HU05 | Editar despesa | ✅ Concluída |
| HU06 | Excluir despesa | ✅ Concluída |
| HU07 | Visualizar dashboard | ✅ Concluída |
| HU08 | Visualizar calendário | ✅ Concluída |
| HU09 | Filtrar por categoria | ✅ Concluída |
| HU10 | Notificações de vencimento | ✅ Concluída |
| HU11 | Alternância de tema | ✅ Concluída |

## 📋 Regras de Negócio

### Usuários (RN-USU)
- **RN-USU-001**: Validação de e-mail único
- **RN-USU-002**: Senha forte obrigatória
- **RN-USU-003**: Bloqueio por tentativas de login
- **RN-USU-005**: Segregação de dados por usuário

### Despesas (RN-DES)
- **RN-DES-002**: Campos obrigatórios validados
- **RN-DES-003**: Valor maior que zero
- **RN-DES-004**: Validação de datas para recorrentes
- **RN-DES-004A**: Data passada não permitida para únicas
- **RN-DES-005**: Ciclo obrigatório para recorrentes

### Cálculos (RN-CAL)
- **RN-CAL-001**: Soma de despesas mensais
- **RN-CAL-002**: Projeção anual de recorrentes
- **RN-CAL-003**: Filtros por período

### Notificações (RN-NOT)
- **RN-NOT-001**: Alertas 3 dias antes
- **RN-NOT-002**: Notificações push
- **RN-NOT-003**: Controle de duplicação

### Interface (RN-INT)
- **RN-INT-001**: Alternância de tema
- **RN-INT-002**: Persistência de tema
- **RN-INT-003**: Feedback visual

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd gerir-me

# Instale as dependências
npm install
```

### Execução
```bash
# Inicie o servidor de desenvolvimento
npm start

# Ou use o comando direto
npx serve -s -l 8080
```

A aplicação estará disponível em: **http://localhost:8080**

### Testes
```bash
# Execute os testes Cypress
npm run test:e2e

# Ou abra a interface do Cypress
npx cypress open
```

## 🎨 Esquema de Cores

### Modo Claro
- **Primária**: #2563eb (Azul)
- **Secundária**: #64748b (Cinza)
- **Sucesso**: #10b981 (Verde)
- **Erro**: #ef4444 (Vermelho)
- **Aviso**: #f59e0b (Amarelo)
- **Fundo**: #ffffff (Branco)

### Modo Escuro
- **Primária**: #3b82f6 (Azul claro)
- **Secundária**: #94a3b8 (Cinza claro)
- **Fundo**: #1e293b (Cinza escuro)
- **Superfície**: #334155 (Cinza médio)

## 📱 Responsividade

A aplicação é totalmente responsiva com breakpoints:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: até 767px

## 🔒 Segurança

- **Validação client-side**: Todas as entradas são validadas
- **Sanitização**: Prevenção contra XSS
- **Armazenamento seguro**: Dados criptografados no localStorage
- **Controle de sessão**: Timeout automático

## 🧪 Testes

O projeto inclui testes automatizados com Cypress:
- **Testes de registro**: Validação do fluxo de cadastro
- **Testes de login**: Validação de autenticação
- **Testes de CRUD**: Operações com despesas
- **Testes de UI**: Interações da interface

## 📈 Performance

- **Carregamento otimizado**: CSS e JS minificados
- **Lazy loading**: Carregamento sob demanda
- **Cache inteligente**: Armazenamento local eficiente
- **Transições CSS**: Animações com GPU

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Edcleryton** - Desenvolvedor Full Stack

## 🔄 Versionamento

- **v1.0.0** - Versão inicial com todas as funcionalidades básicas
- **v1.1.0** - Adição de notificações push e filtros
- **v1.2.0** - Implementação de modo escuro e melhorias de UX

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do e-mail.

---

**Gerir.me** - Sua vida financeira sob controle! 💰✨