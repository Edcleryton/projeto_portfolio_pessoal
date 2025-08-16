# Gerir.me - Gerenciador de Despesas

Um aplicativo web completo e moderno para gerenciar suas despesas mensais e anuais, com sistema de autenticação integrado, desenvolvido com HTML, CSS e JavaScript.

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticação
- **Login**: Acesso seguro com email e senha
- **Registro**: Criação de nova conta de usuário
- **Recuperação de Senha**: Sistema de reset de senha por email
- **Sessão Persistente**: Mantenha-se logado entre as sessões
- **Dados Isolados**: Cada usuário tem seus próprios dados

### 📊 Gerenciamento de Despesas
- **Dashboard**: Visão geral dos gastos mensais, anuais e próximos pagamentos
- **Gerenciamento Completo**: Adicionar, editar, excluir e ativar/desativar despesas
- **Calendário**: Visualizar pagamentos em um calendário mensal
- **Filtros Avançados**: Filtrar despesas por categoria e status
- **Categorias**: Streaming, Software, Música, Fitness, Notícias e Outros
- **Armazenamento Seguro**: Dados salvos no localStorage com isolamento por usuário
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile

## 📱 Como Usar

### 🔧 Instalação

**Opção 1: Servidor Local (Recomendado)**
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd projeto_portfolio_pessoal

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Acessar http://localhost:8080
```

**Opção 2: Abrir Diretamente**
1. Baixe ou clone este repositório
2. Abra o arquivo `index.html` diretamente no seu navegador:
   - Duplo clique no arquivo
   - Ou arraste e solte no navegador
   - Ou clique com botão direito → "Abrir com" → Navegador

### 🚀 Primeiro Acesso

1. **Conta Demo**: Use as credenciais pré-configuradas:
   - **Email**: `demo@gerir.me`
   - **Senha**: `123456`

2. **Criar Nova Conta**: Clique em "Criar conta" e preencha:
   - Nome completo
   - Email válido
   - Senha (mínimo 6 caracteres)

3. **Após o Login**: Use a navegação no topo para alternar entre as seções:
   - **Dashboard**: Veja o resumo dos seus gastos
   - **Despesas**: Gerencie suas despesas
   - **Calendário**: Visualize os pagamentos no calendário

### Adicionando uma Despesa

1. Vá para a seção "Despesas"
2. Clique em "Adicionar Despesa"
3. Preencha os dados:
   - Nome do serviço
   - Preço
   - Categoria
   - Ciclo de cobrança (mensal ou anual)
   - Data do próximo pagamento
   - Status (ativo ou inativo)
4. Clique em "Salvar"

### Editando uma Despesa

1. Na lista de despesas, clique no ícone de edição (lápis)
2. Modifique os dados desejados
3. Clique em "Salvar"

### Outras Ações

- **Ativar/Desativar**: Clique no ícone de play/pause
- **Excluir**: Clique no ícone da lixeira
- **Filtrar**: Use os filtros por categoria e status

## 🎨 Características do Design

- Interface moderna com gradientes e efeitos de vidro
- Cores suaves e design limpo
- Animações e transições suaves
- Ícones do Font Awesome
- Fonte Inter do Google Fonts
- Totalmente responsivo

## 💾 Armazenamento e Segurança

Todos os dados são armazenados localmente no navegador usando localStorage com isolamento por usuário:

### 🔒 Segurança
- **Isolamento de Dados**: Cada usuário tem seus próprios dados separados
- **Sessão Persistente**: Login mantido entre sessões do navegador
- **Dados Locais**: Informações ficam apenas no seu computador
- **Sem Servidor**: Não há transmissão de dados para servidores externos

### 📁 Estrutura de Dados
- **Usuários**: `users` - Lista de usuários registrados
- **Sessão**: `currentUser` - Usuário atualmente logado
- **Despesas**: `subscriptions_{userId}` - Despesas específicas do usuário

### 💡 Vantagens
- Privacidade total dos dados
- Funciona offline
- Sem necessidade de servidor ou banco de dados
- Dados persistem entre as sessões
- Portabilidade completa

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilos, animações e responsividade
- **JavaScript ES6+**: Lógica da aplicação
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia (Inter)
- **LocalStorage**: Armazenamento de dados

## 📊 Dados de Exemplo

### 👤 Conta Demo
- **Email**: `demo@subsmanager.com`
- **Senha**: `123456`

### 💳 Despesas de Exemplo
Cada novo usuário recebe automaticamente algumas despesas de exemplo:
- **Netflix** (R$ 29,90/mês) - Streaming
- **Spotify** (R$ 19,90/mês) - Música  
- **Adobe Creative Cloud** (R$ 239,88/ano) - Software

Você pode excluir esses dados e adicionar suas próprias despesas a qualquer momento.

## 📚 Documentação Técnica

O projeto possui documentação técnica completa na pasta `doc/`:

### 📋 Especificações
- **[Especificações Técnicas](docs/especificacoes-tecnicas.md)**: Requisitos funcionais, regras de negócio, critérios de aceitação e arquitetura do sistema
- **[Casos de Uso](docs/casos-de-uso.md)**: Fluxos detalhados de todas as funcionalidades com cenários principais e alternativos
- **[Definição da Homepage](docs/homepage-definicao.md)**: Especificação detalhada da página inicial do sistema
- **[User Stories](docs/user-stories.md)**: Histórias de usuário organizadas por épicos com critérios de aceitação e mapeamento
- **[Matriz de Rastreabilidade](docs/matriz-rastreabilidade.md)**: Mapeamento entre requisitos, implementação e testes
- **[Plano de Testes](docs/plano-de-testes.md)**: Estratégia e plano de testes baseado na ISO-29119-3

### 🎯 User Stories

#### 🔐 Autenticação
- **Como** usuário novo, **quero** criar uma conta **para** gerenciar minhas despesas pessoais
- **Como** usuário registrado, **quero** fazer login **para** acessar meus dados salvos
- **Como** usuário logado, **quero** fazer logout **para** proteger minha privacidade
- **Como** usuário que esqueceu a senha, **quero** recuperá-la **para** acessar minha conta novamente

#### 💰 Gerenciamento de Despesas
- **Como** usuário, **quero** adicionar uma nova despesa **para** controlar meus gastos recorrentes
- **Como** usuário, **quero** visualizar todas minhas despesas **para** ter uma visão geral dos meus gastos
- **Como** usuário, **quero** editar uma despesa **para** manter as informações atualizadas
- **Como** usuário, **quero** excluir uma despesa **para** remover gastos que não tenho mais
- **Como** usuário, **quero** ativar/desativar despesas **para** controlar quais contam nos cálculos
- **Como** usuário, **quero** filtrar despesas por categoria **para** encontrar gastos específicos

#### 📊 Dashboard e Relatórios
- **Como** usuário, **quero** ver o total de gastos mensais **para** controlar meu orçamento
- **Como** usuário, **quero** ver o total de gastos anuais **para** planejar minhas finanças
- **Como** usuário, **quero** ver próximos pagamentos **para** me preparar financeiramente
- **Como** usuário, **quero** visualizar gastos por categoria **para** identificar onde gasto mais

#### 📅 Calendário
- **Como** usuário, **quero** ver um calendário mensal **para** visualizar quando tenho pagamentos
- **Como** usuário, **quero** navegar entre meses **para** planejar pagamentos futuros
- **Como** usuário, **quero** ver dias destacados **para** identificar rapidamente dias de pagamento

## 🌟 Próximas Funcionalidades

### 🔐 Autenticação
- Autenticação com Google/Facebook
- Verificação de email
- Autenticação de dois fatores (2FA)

### 📊 Funcionalidades
- Exportar/importar dados
- Notificações de pagamentos próximos
- Gráficos mais detalhados
- Histórico de pagamentos
- Múltiplas moedas
- Temas personalizáveis
- Backup na nuvem
- Compartilhamento de despesas familiares

---

**Desenvolvido com ❤️ usando tecnologias web modernas**
