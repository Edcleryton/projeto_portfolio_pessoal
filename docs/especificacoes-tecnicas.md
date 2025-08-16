# Gerir.me - Especificações Técnicas

## 📋 Visão Geral do Sistema

### 🎯 Propósito
O **Gerir.me** é uma aplicação web para gerenciamento de despesas mensais e anuais recorrentes, desenvolvida como uma Single Page Application (SPA) com foco em privacidade, simplicidade e eficiência.

### 🏗️ Arquitetura
- **Tipo**: Frontend-only Application
- **Tecnologias**: HTML5, CSS3, JavaScript ES6+
- **Armazenamento**: LocalStorage
- **Padrão**: MVC 
- **Responsividade**: Mobile-first design

---

## 🔐 Sistema de Autenticação

### 📝 Regras de Negócio

#### RN001 - Cadastro de Usuário
- **Descrição**: Usuários podem criar contas com email único
- **Regras**:
  - Email deve ser válido e único no sistema
  - Nome completo é obrigatório (mínimo 2 caracteres)
  - Senha deve ter no mínimo 6 caracteres
  - Não são permitidos emails duplicados

#### RN002 - Autenticação
- **Descrição**: Sistema de login com email e senha
- **Regras**:
  - Login apenas com credenciais válidas
  - Sessão persistente entre navegações
  - Logout limpa a sessão atual
  - Máximo de 3 tentativas de login incorretas

#### RN003 - Recuperação de Senha
- **Descrição**: Sistema simulado de recuperação de senha
- **Regras**:
  - Apenas emails cadastrados podem recuperar senha
  - Simulação de envio de email (sem envio real)
  - Nova senha deve atender aos critérios mínimos

### 📋 Requisitos Funcionais

#### RF001 - Registro de Usuário
- **Descrição**: Permitir criação de nova conta
- **Entrada**: Nome, email, senha
- **Saída**: Conta criada e login automático
- **Prioridade**: Alta

#### RF002 - Login de Usuário
- **Descrição**: Autenticar usuário existente
- **Entrada**: Email e senha
- **Saída**: Acesso ao sistema
- **Prioridade**: Alta

#### RF003 - Logout de Usuário
- **Descrição**: Encerrar sessão do usuário
- **Entrada**: Clique no botão logout
- **Saída**: Retorno à tela de login
- **Prioridade**: Média

#### RF004 - Recuperação de Senha
- **Descrição**: Simular recuperação de senha
- **Entrada**: Email cadastrado
- **Saída**: Simulação de envio de email
- **Prioridade**: Baixa

### ✅ Critérios de Aceitação

#### CA001 - Registro Bem-sucedido
- **Dado**: Formulário de registro preenchido corretamente
- **Quando**: Usuário clica em "Criar conta"
- **Então**: 
  - Conta é criada no localStorage
  - Usuário é logado automaticamente
  - Redirecionamento para dashboard
  - Mensagem de sucesso exibida

#### CA002 - Login Bem-sucedido
- **Dado**: Credenciais válidas inseridas
- **Quando**: Usuário clica em "Entrar"
- **Então**:
  - Sessão é criada
  - Redirecionamento para dashboard
  - Nome do usuário exibido no header

#### CA003 - Falha na Autenticação
- **Dado**: Credenciais inválidas
- **Quando**: Usuário tenta fazer login
- **Então**:
  - Mensagem de erro exibida
  - Campos do formulário mantidos
  - Usuário permanece na tela de login

---

## 💰 Sistema de Gerenciamento de Despesas

### 📝 Regras de Negócio

#### RN004 - Isolamento de Dados
- **Descrição**: Cada usuário acessa apenas suas próprias despesas
- **Regras**:
  - Dados são isolados por ID do usuário
  - Não há compartilhamento entre usuários
  - Logout limpa dados da sessão

#### RN005 - Categorização
- **Descrição**: Despesas devem ser categorizadas
- **Regras**:
  - Categorias predefinidas: Streaming, Software, Música, Fitness, Notícias, Outros
  - Categoria é obrigatória
  - Não é possível criar novas categorias

#### RN006 - Ciclos de Cobrança
- **Descrição**: Despesas podem ser mensais ou anuais
- **Regras**:
  - Apenas dois tipos: "monthly" e "yearly"
  - Cálculos automáticos para totais
  - Data de próximo pagamento obrigatória

#### RN007 - Status de Despesas
- **Descrição**: Despesas podem estar ativas ou inativas
- **Regras**:
  - Status padrão: ativo
  - Despesas inativas não contam nos cálculos
  - Possível alternar status sem excluir

### 📋 Requisitos Funcionais

#### RF005 - Adicionar Despesa
- **Descrição**: Criar nova despesa recorrente
- **Entrada**: Nome, preço, categoria, ciclo, data, status
- **Saída**: Despesa salva e listada
- **Prioridade**: Alta

#### RF006 - Listar Despesas
- **Descrição**: Exibir todas as despesas do usuário
- **Entrada**: Usuário logado
- **Saída**: Lista paginada de despesas
- **Prioridade**: Alta

#### RF007 - Editar Despesa
- **Descrição**: Modificar despesa existente
- **Entrada**: ID da despesa e novos dados
- **Saída**: Despesa atualizada
- **Prioridade**: Alta

#### RF008 - Excluir Despesa
- **Descrição**: Remover despesa do sistema
- **Entrada**: ID da despesa
- **Saída**: Despesa removida
- **Prioridade**: Média

#### RF009 - Ativar/Desativar Despesa
- **Descrição**: Alterar status da despesa
- **Entrada**: ID da despesa
- **Saída**: Status alterado
- **Prioridade**: Média

#### RF010 - Filtrar Despesas
- **Descrição**: Filtrar por categoria e status
- **Entrada**: Filtros selecionados
- **Saída**: Lista filtrada
- **Prioridade**: Baixa

### ✅ Critérios de Aceitação

#### CA004 - Adicionar Despesa
- **Dado**: Formulário preenchido corretamente
- **Quando**: Usuário clica em "Salvar"
- **Então**:
  - Despesa é salva no localStorage
  - Lista de despesas é atualizada
  - Dashboard recalcula totais
  - Modal é fechado
  - Mensagem de sucesso exibida

#### CA005 - Validação de Campos
- **Dado**: Formulário com campos obrigatórios vazios
- **Quando**: Usuário tenta salvar
- **Então**:
  - Validação HTML5 impede envio
  - Campos obrigatórios destacados
  - Foco no primeiro campo inválido

#### CA006 - Exclusão de Despesa
- **Dado**: Despesa selecionada para exclusão
- **Quando**: Usuário confirma exclusão
- **Então**:
  - Despesa é removida do localStorage
  - Lista é atualizada
  - Dashboard recalcula totais
  - Mensagem de confirmação exibida

---

## 📊 Dashboard e Relatórios

### 📝 Regras de Negócio

#### RN008 - Cálculos Financeiros
- **Descrição**: Totais calculados automaticamente
- **Regras**:
  - Apenas despesas ativas contam
  - Despesas anuais divididas por 12 para total mensal
  - Despesas mensais multiplicadas por 12 para total anual
  - Arredondamento para 2 casas decimais

#### RN009 - Próximos Pagamentos
- **Descrição**: Exibir pagamentos dos próximos 7 dias
- **Regras**:
  - Apenas despesas ativas
  - Baseado na data de próximo pagamento
  - Ordenação por data crescente

### 📋 Requisitos Funcionais

#### RF011 - Exibir Estatísticas
- **Descrição**: Mostrar totais mensais, anuais e contadores
- **Entrada**: Despesas do usuário
- **Saída**: Cards com estatísticas
- **Prioridade**: Alta

#### RF012 - Listar Próximos Pagamentos
- **Descrição**: Exibir pagamentos próximos
- **Entrada**: Data atual
- **Saída**: Lista de pagamentos
- **Prioridade**: Média

#### RF013 - Gráfico por Categoria
- **Descrição**: Visualizar gastos por categoria
- **Entrada**: Despesas ativas
- **Saída**: Gráfico de barras
- **Prioridade**: Baixa

### ✅ Critérios de Aceitação

#### CA007 - Cálculo de Totais
- **Dado**: Usuário com despesas cadastradas
- **Quando**: Dashboard é carregado
- **Então**:
  - Total mensal calculado corretamente
  - Total anual calculado corretamente
  - Contador de despesas ativas correto
  - Valores formatados em moeda brasileira

#### CA008 - Próximos Pagamentos
- **Dado**: Despesas com datas futuras
- **Quando**: Dashboard é carregado
- **Então**:
  - Apenas pagamentos dos próximos 7 dias
  - Ordenados por data
  - Exibindo nome e valor
  - Contador atualizado no card

---

## 📅 Calendário de Pagamentos

### 📝 Regras de Negócio

#### RN010 - Visualização Mensal
- **Descrição**: Calendário exibe um mês por vez
- **Regras**:
  - Navegação entre meses
  - Destaque para dias com pagamentos
  - Apenas despesas ativas são exibidas

### 📋 Requisitos Funcionais

#### RF014 - Exibir Calendário
- **Descrição**: Mostrar calendário mensal
- **Entrada**: Mês/ano selecionado
- **Saída**: Grade de calendário
- **Prioridade**: Média

#### RF015 - Navegar entre Meses
- **Descrição**: Permitir navegação temporal
- **Entrada**: Clique em setas
- **Saída**: Calendário atualizado
- **Prioridade**: Baixa

#### RF016 - Destacar Pagamentos
- **Descrição**: Marcar dias com pagamentos
- **Entrada**: Despesas com datas
- **Saída**: Dias destacados
- **Prioridade**: Baixa

### ✅ Critérios de Aceitação

#### CA009 - Exibição do Calendário
- **Dado**: Usuário na seção calendário
- **Quando**: Página é carregada
- **Então**:
  - Calendário do mês atual exibido
  - Dias com pagamentos destacados
  - Navegação funcional
  - Nome do mês/ano correto

---

## 🔧 Requisitos Não-Funcionais

### RNF001 - Performance
- **Descrição**: Aplicação deve ser rápida e responsiva
- **Critérios**:
  - Carregamento inicial < 2 segundos
  - Transições suaves (< 300ms)
  - Sem travamentos na interface

### RNF002 - Usabilidade
- **Descrição**: Interface intuitiva e acessível
- **Critérios**:
  - Design responsivo (mobile-first)
  - Navegação clara e consistente
  - Feedback visual para ações
  - Mensagens de erro compreensíveis

### RNF003 - Compatibilidade
- **Descrição**: Funcionar em navegadores modernos
- **Critérios**:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+

### RNF004 - Segurança
- **Descrição**: Proteção dos dados do usuário
- **Critérios**:
  - Dados armazenados localmente
  - Isolamento entre usuários
  - Validação de entrada
  - Sanitização de dados

### RNF005 - Manutenibilidade
- **Descrição**: Código limpo e organizad
- **Critérios**:
  - Separação de responsabilidades
  - Código comentado
  - Padrões de nomenclatura
  - Estrutura modular

---

## 📱 Especificações de Interface

### 🎨 Design System

#### Cores Principais
- **Primária**: Gradiente azul/roxo (#667eea → #764ba2)
- **Secundária**: Cinza (#6b7280)
- **Sucesso**: Verde (#10b981)
- **Erro**: Vermelho (#ef4444)
- **Aviso**: Amarelo (#f59e0b)

#### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700
- **Tamanhos**: 12px, 14px, 16px, 18px, 24px, 32px

#### Espaçamento
- **Base**: 8px
- **Escala**: 8px, 16px, 24px, 32px, 48px, 64px

### 📱 Responsividade

#### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

#### Adaptações Mobile
- Menu de navegação colapsível
- Cards empilhados verticalmente
- Formulários em tela cheia
- Botões com área de toque adequada

---

## 🧪 Cenários de Teste

### Teste de Autenticação
1. **Registro com dados válidos** → Sucesso
2. **Registro com email duplicado** → Erro
3. **Login com credenciais válidas** → Sucesso
4. **Login com credenciais inválidas** → Erro
5. **Logout** → Redirecionamento para login

### Teste de Despesas
1. **Adicionar despesa válida** → Sucesso
2. **Adicionar despesa com campos vazios** → Validação
3. **Editar despesa existente** → Sucesso
4. **Excluir despesa** → Confirmação e remoção
5. **Filtrar por categoria** → Lista filtrada

### Teste de Dashboard
1. **Cálculo de totais** → Valores corretos
2. **Próximos pagamentos** → Lista atualizada
3. **Gráfico por categoria** → Visualização correta

### Teste de Responsividade
1. **Visualização mobile** → Layout adaptado
2. **Navegação mobile** → Menu funcional
3. **Formulários mobile** → Campos acessíveis

---

## 📚 Glossário

- **Despesa**: Gasto recorrente mensal ou anual
- **Ciclo de Cobrança**: Frequência de cobrança (mensal/anual)
- **Status**: Estado da despesa (ativa/inativa)
- **Categoria**: Classificação da despesa por tipo
- **LocalStorage**: Armazenamento local do navegador
- **SPA**: Single Page Application
- **CRUD**: Create, Read, Update, Delete
- **MVC**: Model-View-Controller

---

**Documento criado em**: " + new Date().toLocaleDateString('pt-BR') + "
**Versão**: 1.0
**Autor**: Sistema Gerir.me