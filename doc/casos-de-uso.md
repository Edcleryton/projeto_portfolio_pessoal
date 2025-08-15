# SubsManager - Casos de Uso

## 📋 Visão Geral

Este documento detalha os casos de uso do sistema SubsManager, descrevendo as interações entre os usuários e o sistema para cada funcionalidade principal.

---

## 👤 Atores

### Usuário Não Autenticado
- Pessoa que ainda não fez login no sistema
- Pode criar conta, fazer login ou recuperar senha

### Usuário Autenticado
- Pessoa logada no sistema
- Pode gerenciar suas despesas e acessar todas as funcionalidades

---

## 🔐 Casos de Uso - Autenticação

### UC001 - Criar Conta

**Ator Principal**: Usuário Não Autenticado

**Pré-condições**: 
- Usuário não possui conta no sistema
- Aplicação está carregada

**Fluxo Principal**:
1. Usuário acessa a tela de login
2. Usuário clica em "Criar nova conta"
3. Sistema exibe formulário de registro
4. Usuário preenche nome completo, email e senha
5. Usuário clica em "Criar conta"
6. Sistema valida os dados inseridos
7. Sistema verifica se email já existe
8. Sistema cria nova conta no localStorage
9. Sistema autentica usuário automaticamente
10. Sistema redireciona para dashboard
11. Sistema exibe mensagem de sucesso

**Fluxos Alternativos**:
- **FA001**: Email já cadastrado
  - 7a. Sistema detecta email duplicado
  - 7b. Sistema exibe mensagem de erro
  - 7c. Usuário permanece no formulário

- **FA002**: Dados inválidos
  - 6a. Sistema detecta campos obrigatórios vazios
  - 6b. Navegador exibe validação HTML5
  - 6c. Usuário corrige os dados

**Pós-condições**:
- Conta criada no sistema
- Usuário autenticado
- Sessão ativa criada

---

### UC002 - Fazer Login

**Ator Principal**: Usuário Não Autenticado

**Pré-condições**:
- Usuário possui conta no sistema
- Aplicação está carregada

**Fluxo Principal**:
1. Usuário acessa a tela de login
2. Usuário preenche email e senha
3. Usuário clica em "Entrar"
4. Sistema valida credenciais
5. Sistema cria sessão de usuário
6. Sistema redireciona para dashboard
7. Sistema carrega dados do usuário
8. Sistema exibe nome do usuário no header

**Fluxos Alternativos**:
- **FA001**: Credenciais inválidas
  - 4a. Sistema não encontra usuário ou senha incorreta
  - 4b. Sistema exibe mensagem de erro
  - 4c. Usuário permanece na tela de login

- **FA002**: Campos vazios
  - 3a. Usuário não preenche todos os campos
  - 3b. Navegador exibe validação HTML5
  - 3c. Usuário preenche campos obrigatórios

**Pós-condições**:
- Usuário autenticado
- Sessão ativa criada
- Dashboard carregado com dados do usuário

---

### UC003 - Fazer Logout

**Ator Principal**: Usuário Autenticado

**Pré-condições**:
- Usuário está logado no sistema

**Fluxo Principal**:
1. Usuário clica no botão "Sair" no header
2. Sistema limpa sessão atual
3. Sistema limpa dados temporários
4. Sistema redireciona para tela de login
5. Sistema exibe tela de login limpa

**Pós-condições**:
- Sessão encerrada
- Usuário redirecionado para login
- Dados da sessão limpos

---

### UC004 - Recuperar Senha

**Ator Principal**: Usuário Não Autenticado

**Pré-condições**:
- Usuário esqueceu a senha
- Usuário possui conta no sistema

**Fluxo Principal**:
1. Usuário acessa tela de login
2. Usuário clica em "Esqueci minha senha"
3. Sistema exibe formulário de recuperação
4. Usuário insere email cadastrado
5. Usuário clica em "Recuperar senha"
6. Sistema verifica se email existe
7. Sistema simula envio de email
8. Sistema exibe mensagem de confirmação
9. Usuário retorna para tela de login

**Fluxos Alternativos**:
- **FA001**: Email não cadastrado
  - 6a. Sistema não encontra email
  - 6b. Sistema exibe mensagem de erro
  - 6c. Usuário pode tentar novamente

**Pós-condições**:
- Simulação de recuperação realizada
- Usuário informado sobre próximos passos

---

## 💰 Casos de Uso - Gerenciamento de Despesas

### UC005 - Adicionar Despesa

**Ator Principal**: Usuário Autenticado

**Pré-condições**:
- Usuário está logado no sistema
- Usuário está na seção "Despesas"

**Fluxo Principal**:
1. Usuário clica em "Adicionar Despesa"
2. Sistema abre modal com formulário
3. Usuário preenche nome da despesa
4. Usuário insere valor (preço)
5. Usuário seleciona categoria
6. Usuário escolhe ciclo de cobrança (mensal/anual)
7. Usuário define data do próximo pagamento
8. Usuário define status (ativo por padrão)
9. Usuário clica em "Salvar"
10. Sistema valida todos os campos
11. Sistema gera ID único para despesa
12. Sistema salva despesa no localStorage
13. Sistema fecha modal
14. Sistema atualiza lista de despesas
15. Sistema recalcula dashboard
16. Sistema exibe mensagem de sucesso

**Fluxos Alternativos**:
- **FA001**: Campos obrigatórios vazios
  - 10a. Sistema detecta campos não preenchidos
  - 10b. Navegador exibe validação HTML5
  - 10c. Usuário preenche campos obrigatórios

- **FA002**: Cancelar operação
  - 9a. Usuário clica em "Cancelar" ou "X"
  - 9b. Sistema fecha modal sem salvar
  - 9c. Usuário retorna à lista de despesas

**Pós-condições**:
- Nova despesa salva no sistema
- Lista de despesas atualizada
- Dashboard recalculado
- Modal fechado

---

### UC006 - Listar Despesas

**Ator Principal**: Usuário Autenticado

**Pré-condições**:
- Usuário está logado no sistema

**Fluxo Principal**:
1. Usuário navega para seção "Despesas"
2. Sistema carrega despesas do usuário do localStorage
3. Sistema ordena despesas por data de criação (mais recentes primeiro)
4. Sistema exibe lista paginada de despesas
5. Para cada despesa, sistema mostra:
   - Nome da despesa
   - Valor formatado em moeda
   - Categoria com ícone
   - Ciclo de cobrança
   - Data do próximo pagamento
   - Status (ativo/inativo)
   - Botões de ação (editar, excluir, ativar/desativar)

**Fluxos Alternativos**:
- **FA001**: Nenhuma despesa cadastrada
  - 2a. Sistema não encontra despesas
  - 2b. Sistema exibe mensagem "Nenhuma despesa encontrada"
  - 2c. Sistema exibe botão para adicionar primeira despesa

**Pós-condições**:
- Lista de despesas exibida
- Ações disponíveis para cada despesa

---

### UC007 - Editar Despesa

**Ator Principal**: Usuário Autenticado

**Pré-condições**:
- Usuário está logado no sistema
- Despesa existe no sistema
- Usuário está na lista de despesas

**Fluxo Principal**:
1. Usuário clica no botão "Editar" de uma despesa
2. Sistema abre modal com formulário preenchido
3. Sistema carrega dados atuais da despesa
4. Usuário modifica campos desejados
5. Usuário clica em "Salvar"
6. Sistema valida dados modificados
7. Sistema atualiza despesa no localStorage
8. Sistema fecha modal
9. Sistema atualiza lista de despesas
10. Sistema recalcula dashboard
11. Sistema exibe mensagem de sucesso

**Fluxos Alternativos**:
- **FA001**: Cancelar edição
  - 5a. Usuário clica em "Cancelar"
  - 5b. Sistema fecha modal sem salvar
  - 5c. Alterações são descartadas

- **FA002**: Dados inválidos
  - 6a. Sistema detecta campos inválidos
  - 6b. Sistema exibe validação
  - 6c. Usuário corrige dados

**Pós-condições**:
- Despesa atualizada no sistema
- Lista e dashboard atualizados
- Modal fechado

---

### UC008 - Excluir Despesa

**Ator Principal**: Usuário Autenticado

**Pré-condições**:
- Usuário está logado no sistema
- Despesa existe no sistema
- Usuário está na lista de despesas

**Fluxo Principal**:
1. Usuário clica no botão "Excluir" de uma despesa
2. Sistema exibe modal de confirmação
3. Sistema mostra detalhes da despesa a ser excluída
4. Usuário confirma exclusão clicando "Sim, excluir"
5. Sistema remove despesa do localStorage
6. Sistema fecha modal de confirmação
7. Sistema atualiza lista de despesas
8. Sistema recalcula dashboard
9. Sistema exibe mensagem de confirmação

**Fluxos Alternativos**:
- **FA001**: Cancelar exclusão
  - 4a. Usuário clica em "Cancelar"
  - 4b. Sistema fecha modal sem excluir
  - 4c. Despesa permanece no sistema

**Pós-condições**:
- Despesa removida do sistema
- Lista e dashboard atualizados
- Modal fechado

---

### UC009 - Ativar/Desativar Despesa

**Ator Principal**: Usuário Autenticado

**Pré-condições**:
- Usuário está logado no sistema
- Despesa existe no sistema

**Fluxo Principal**:
1. Usuário clica no botão de status da despesa
2. Sistema alterna status (ativo ↔ inativo)
3. Sistema atualiza despesa no localStorage
4. Sistema atualiza indicador visual na lista
5. Sistema recalcula dashboard (despesas inativas não contam)
6. Sistema exibe mensagem de confirmação

**Pós-condições**:
- Status da despesa alterado
- Dashboard recalculado
- Indicador visual atualizado

---

### UC010 - Filtrar Despesas

**Ator Principal**: Usuário Autenticado

**Pré-condições**:
- Usuário está logado no sistema
- Usuário está na seção "Despesas"
- Existem despesas cadastradas

**Fluxo Principal**:
1. Usuário acessa filtros na seção de despesas
2. Usuário seleciona categoria desejada (ou "Todas")
3. Usuário seleciona status desejado (Ativas/Inativas/Todas)
4. Sistema aplica filtros automaticamente
5. Sistema atualiza lista com despesas filtradas
6. Sistema mantém filtros ativos durante navegação

**Fluxos Alternativos**:
- **FA001**: Nenhuma despesa atende aos filtros
  - 5a. Sistema não encontra despesas com critérios
  - 5b. Sistema exibe mensagem "Nenhuma despesa encontrada"
  - 5c. Sistema sugere alterar filtros

**Pós-condições**:
- Lista filtrada exibida
- Filtros ativos mantidos
- Contador de resultados atualizado

---

## 📊 Casos de Uso - Dashboard

### UC011 - Visualizar Dashboard

**Ator Principal**: Usuário Autenticado

**Pré-condições**:
- Usuário está logado no sistema

**Fluxo Principal**:
1. Usuário acessa seção "Dashboard" (padrão após login)
2. Sistema carrega todas as despesas ativas do usuário
3. Sistema calcula total mensal:
   - Soma despesas mensais
   - Adiciona despesas anuais divididas por 12
4. Sistema calcula total anual:
   - Soma despesas anuais
   - Adiciona despesas mensais multiplicadas por 12
5. Sistema conta despesas ativas
6. Sistema identifica próximos pagamentos (7 dias)
7. Sistema exibe cards com estatísticas
8. Sistema exibe lista de próximos pagamentos
9. Sistema gera gráfico por categoria

**Fluxos Alternativos**:
- **FA001**: Nenhuma despesa cadastrada
  - 2a. Sistema não encontra despesas
  - 2b. Sistema exibe dashboard com valores zerados
  - 2c. Sistema exibe mensagem motivacional
  - 2d. Sistema destaca botão "Adicionar Despesa"

**Pós-condições**:
- Dashboard carregado com dados atualizados
- Estatísticas calculadas corretamente
- Gráficos e listas exibidos

---

## 📅 Casos de Uso - Calendário

### UC012 - Visualizar Calendário

**Ator Principal**: Usuário Autenticado

**Pré-condições**:
- Usuário está logado no sistema

**Fluxo Principal**:
1. Usuário navega para seção "Calendário"
2. Sistema carrega mês atual
3. Sistema busca despesas ativas do usuário
4. Sistema identifica datas de pagamento no mês
5. Sistema gera grade do calendário
6. Sistema destaca dias com pagamentos
7. Sistema exibe navegação entre meses
8. Sistema mostra nome do mês/ano atual

**Fluxos Alternativos**:
- **FA001**: Nenhum pagamento no mês
  - 4a. Sistema não encontra pagamentos
  - 4b. Sistema exibe calendário sem destaques
  - 4c. Sistema mantém navegação funcional

**Pós-condições**:
- Calendário do mês exibido
- Dias com pagamentos destacados
- Navegação disponível

---

### UC013 - Navegar entre Meses

**Ator Principal**: Usuário Autenticado

**Pré-condições**:
- Usuário está na seção "Calendário"
- Calendário está carregado

**Fluxo Principal**:
1. Usuário clica em seta de navegação (anterior/próximo)
2. Sistema calcula novo mês/ano
3. Sistema atualiza título do calendário
4. Sistema recarrega despesas para novo período
5. Sistema regenera grade do calendário
6. Sistema atualiza destaques de pagamentos
7. Sistema mantém navegação funcional

**Pós-condições**:
- Calendário atualizado para novo mês
- Pagamentos do período destacados
- Navegação mantida

---

## 🔄 Fluxos de Exceção Globais

### EX001 - Erro de LocalStorage
- **Situação**: LocalStorage não disponível ou cheio
- **Ação**: Sistema exibe mensagem de erro e sugere limpeza

### EX002 - Dados Corrompidos
- **Situação**: Dados no localStorage estão corrompidos
- **Ação**: Sistema limpa dados e solicita novo login

### EX003 - Sessão Expirada
- **Situação**: Usuário fica muito tempo inativo
- **Ação**: Sistema redireciona para login automaticamente

### EX004 - Navegador Incompatível
- **Situação**: Navegador não suporta funcionalidades necessárias
- **Ação**: Sistema exibe mensagem de compatibilidade

---

## 📝 Notas de Implementação

### Validações
- Todos os formulários utilizam validação HTML5
- Validações customizadas em JavaScript quando necessário
- Feedback visual imediato para usuário

### Persistência
- Todos os dados são salvos no localStorage
- Estrutura de dados isolada por usuário
- Backup automático a cada operação

### Interface
- Design responsivo para todos os casos de uso
- Feedback visual para todas as ações
- Mensagens de sucesso/erro consistentes

### Performance
- Carregamento lazy de dados quando possível
- Cálculos otimizados para grandes volumes
- Cache de dados frequentemente acessados

---

**Documento criado em**: " + new Date().toLocaleDateString('pt-BR') + "
**Versão**: 1.0
**Autor**: Sistema SubsManager