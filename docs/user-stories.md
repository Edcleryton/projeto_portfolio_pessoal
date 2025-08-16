# Gerir.me - User Stories em Gherkin

> 📚 **[← Voltar para Wiki](README.md)** | **[Casos de Uso ←](casos-de-uso.md)** | **[Plano de Testes →](plano-de-testes.md)** | **[Regras de Negócio →](regras-de-negocio.md)**

## 📋 Visão Geral

Este documento contém todas as user stories do sistema Gerir.me escritas em formato Gherkin, organizadas por épicos e features. O formato Gherkin utiliza a sintaxe Given-When-Then para criar cenários de teste estruturados e legíveis.

---

## 🏗️ Estrutura Gherkin

Cada feature segue o formato:
- **Feature**: Descrição da funcionalidade
- **Background**: Contexto comum a todos os cenários
- **Scenario**: Cenário específico de teste
- **Given**: Estado inicial
- **When**: Ação executada
- **Then**: Resultado esperado
- **And**: Condições adicionais

---

## 📚 Features em Gherkin

### 🔐 Feature: Autenticação e Segurança

```gherkin
Feature: Gerenciamento de Autenticação
  Como usuário do sistema Gerir.me
  Quero gerenciar minha autenticação
  Para acessar e proteger meus dados financeiros

  Background:
    Given que estou na página inicial do Gerir.me
    And o sistema está funcionando corretamente

  @RF001 @UC001 @alta
  Scenario: Criar nova conta com dados válidos
    Given que não possuo uma conta no sistema
    When clico em "Criar nova conta"
    And preencho o nome com "João Silva"
    And preencho o email com "joao@exemplo.com"
    And preencho a senha com "123456"
    And clico em "Criar conta"
    Then devo ser logado automaticamente
    And devo ser redirecionado para o dashboard
    And meus dados devem ser salvos no localStorage
    And devo ver meu nome "João Silva" no header

  @RF001 @UC001
  Scenario: Tentar criar conta com email já existente
    Given que existe um usuário com email "demo@gerir.me"
    When clico em "Criar nova conta"
    And preencho o email com "demo@gerir.me"
    And preencho os demais campos válidos
    And clico em "Criar conta"
    Then devo ver uma mensagem de erro "Email já cadastrado"
    And devo permanecer na tela de registro

  @RF001 @UC001
  Scenario: Tentar criar conta com senha inválida
    Given que estou na tela de registro
    When preencho o nome com "João Silva"
    And preencho o email com "joao@exemplo.com"
    And preencho a senha com "123" 
    And clico em "Criar conta"
    Then devo ver uma mensagem de erro sobre senha mínima
    And não devo conseguir criar a conta

  @RF002 @UC002 @alta
  Scenario: Fazer login com credenciais válidas
    Given que possuo uma conta com email "demo@gerir.me" e senha "123456"
    When preencho o email com "demo@gerir.me"
    And preencho a senha com "123456"
    And clico em "Entrar"
    Then devo ser redirecionado para o dashboard
    And devo ver meu nome no header
    And minha sessão deve ser persistente

  @RF002 @UC002
  Scenario: Tentar login com credenciais inválidas
    Given que estou na tela de login
    When preencho o email com "usuario@inexistente.com"
    And preencho a senha com "senhaerrada"
    And clico em "Entrar"
    Then devo ver uma mensagem de erro "Credenciais inválidas"
    And devo permanecer na tela de login

  @RF003 @UC003 @media
  Scenario: Fazer logout do sistema
    Given que estou logado no sistema
    And estou na página do dashboard
    When clico no botão "Sair" no header
    Then devo ser redirecionado para a tela de login
    And minha sessão deve ser limpa
    And dados temporários devem ser removidos

  @RF004 @UC004 @baixa
  Scenario: Recuperar senha com email válido
    Given que possuo uma conta com email "demo@gerir.me"
    And estou na tela de login
    When clico em "Esqueci minha senha"
    And preencho o email com "demo@gerir.me"
    And clico em "Recuperar senha"
    Then devo ver uma mensagem "Email de recuperação enviado"
    And devo ser redirecionado para a tela de login

  @RF004 @UC004
  Scenario: Tentar recuperar senha com email inexistente
    Given que estou na tela de recuperação de senha
    When preencho o email com "inexistente@exemplo.com"
    And clico em "Recuperar senha"
    Then devo ver uma mensagem de erro "Email não encontrado"
    And devo permanecer na tela de recuperação
```

---

### 💰 Feature: Gerenciamento de Despesas

```gherkin
Feature: Gerenciamento de Despesas Recorrentes
  Como usuário do sistema Gerir.me
  Quero gerenciar minhas despesas recorrentes
  Para controlar meus gastos mensais e anuais

  Background:
    Given que estou logado no sistema
    And estou na página de despesas
    And o sistema está funcionando corretamente

  @RF005 @UC005 @alta
  Scenario: Adicionar nova despesa com dados válidos
    Given que estou na lista de despesas
    When clico no botão "Adicionar Despesa"
    And preencho o nome com "Netflix"
    And preencho o valor com "29.90"
    And seleciono a categoria "Entretenimento"
    And seleciono o ciclo "Mensal"
    And seleciono a data "15"
    And clico em "Salvar"
    Then devo ver a mensagem "Despesa adicionada com sucesso"
    And a despesa deve aparecer na lista
    And o dashboard deve ser atualizado
    And a despesa deve estar ativa por padrão

  @RF005 @UC005
  Scenario: Tentar adicionar despesa com campos vazios
    Given que estou no modal de adicionar despesa
    When deixo o campo nome vazio
    And clico em "Salvar"
    Then devo ver mensagens de erro nos campos obrigatórios
    And a despesa não deve ser salva
    And devo permanecer no modal

  @RF006 @UC006 @alta
  Scenario: Visualizar lista de despesas
    Given que possuo despesas cadastradas
    When acesso a página de despesas
    Then devo ver uma lista com todas as despesas
    And cada despesa deve mostrar nome, valor, categoria, ciclo e status
    And os valores devem estar formatados em moeda brasileira
    And devo ver botões de ação para cada despesa

  @RF006 @UC006
  Scenario: Visualizar mensagem quando não há despesas
    Given que não possuo despesas cadastradas
    When acesso a página de despesas
    Then devo ver a mensagem "Nenhuma despesa encontrada"
    And devo ver o botão "Adicionar Despesa"

  @RF007 @UC007 @alta
  Scenario: Editar despesa existente
    Given que possuo uma despesa "Spotify" de R$ 19,90
    When clico no botão de editar da despesa
    And altero o valor para "21,90"
    And clico em "Salvar"
    Then devo ver a mensagem "Despesa atualizada com sucesso"
    And a despesa deve mostrar o novo valor na lista
    And o dashboard deve ser recalculado

  @RF008 @UC008 @media
  Scenario: Excluir despesa com confirmação
    Given que possuo uma despesa "Academia" cadastrada
    When clico no botão de excluir da despesa
    And confirmo a exclusão no modal
    Then devo ver a mensagem "Despesa excluída com sucesso"
    And a despesa deve ser removida da lista
    And o dashboard deve ser atualizado

  @RF008 @UC008
  Scenario: Cancelar exclusão de despesa
    Given que possuo uma despesa cadastrada
    When clico no botão de excluir
    And cancelo a exclusão no modal
    Then a despesa deve permanecer na lista
    And nenhuma alteração deve ser feita

  @RF009 @UC009 @media
  Scenario: Desativar despesa
    Given que possuo uma despesa ativa "Gym"
    When clico no botão de toggle de status
    Then a despesa deve ficar inativa
    And não deve contar nos cálculos do dashboard
    And devo ver indicação visual de despesa inativa

  @RF009 @UC009 @media
  Scenario: Ativar despesa inativa
    Given que possuo uma despesa inativa "Gym"
    When clico no botão de toggle de status
    Then a despesa deve ficar ativa
    And deve voltar a contar nos cálculos do dashboard
    And devo ver indicação visual de despesa ativa

  @RF010 @UC010 @baixa
  Scenario: Filtrar despesas por categoria
    Given que possuo despesas de diferentes categorias
    When seleciono o filtro "Entretenimento"
    Then devo ver apenas despesas da categoria "Entretenimento"
    And devo ver o contador de resultados atualizado

  @RF010 @UC010 @baixa
  Scenario: Filtrar despesas por status
    Given que possuo despesas ativas e inativas
    When seleciono o filtro "Inativas"
    Then devo ver apenas despesas inativas
    And devo ver o contador de resultados

  @RF010 @UC010
  Scenario: Aplicar múltiplos filtros
    Given que possuo despesas variadas
    When seleciono categoria "Saúde" e status "Ativas"
    Then devo ver apenas despesas ativas da categoria "Saúde"
    And se não houver resultados, devo ver mensagem apropriada
```

---

### 📊 Feature: Dashboard e Relatórios

```gherkin
Feature: Dashboard e Relatórios Financeiros
  Como usuário do sistema Gerir.me
  Quero visualizar relatórios e estatísticas das minhas despesas
  Para controlar meu orçamento e planejar minhas finanças

  Background:
    Given que estou logado no sistema
    And possuo despesas cadastradas
    And estou na página do dashboard

  @RF011 @UC011 @alta
  Scenario: Visualizar estatísticas financeiras básicas
    Given que possuo despesas ativas cadastradas
    When acesso o dashboard
    Then devo ver o card com total mensal calculado
    And devo ver o card com total anual calculado
    And devo ver o card com contador de despesas ativas
    And todos os valores devem estar formatados em moeda brasileira
    And os cálculos devem estar corretos e atualizados

  @RF011 @UC011
  Scenario: Atualização automática das estatísticas
    Given que estou visualizando o dashboard
    When adiciono uma nova despesa
    Then as estatísticas devem ser atualizadas automaticamente
    And os totais devem refletir a nova despesa
    And o contador de despesas deve ser incrementado

  @RF012 @UC011 @media
  Scenario: Visualizar próximos pagamentos
    Given que possuo despesas com vencimentos nos próximos 7 dias
    When visualizo a seção de próximos pagamentos
    Then devo ver uma lista ordenada por data
    And devo ver apenas despesas ativas
    And cada item deve mostrar nome e valor da despesa
    And devo ver o contador total no card do dashboard

  @RF013 @UC011 @baixa
  Scenario: Visualizar gráfico de gastos por categoria
    Given que possuo despesas ativas de diferentes categorias
    When acesso a seção de gráficos
    Then devo ver um gráfico de barras por categoria
    And cada categoria deve ter uma cor distinta
    And os valores devem estar convertidos para base mensal
    And apenas despesas ativas devem ser consideradas

  @RF013 @UC011
  Scenario: Visualizar mensagem quando não há dados no gráfico
    Given que não possuo despesas ativas cadastradas
    When acesso a seção de gráficos
    Then devo ver uma mensagem "Nenhum dado disponível para exibir"
    And o gráfico não deve ser exibido
```

---

### 📅 Feature: Calendário de Pagamentos

```gherkin
Feature: Calendário de Pagamentos
  Como usuário do sistema Gerir.me
  Quero visualizar um calendário com meus pagamentos
  Para planejar e acompanhar meus compromissos financeiros

  Background:
    Given que estou logado no sistema
    And possuo despesas ativas cadastradas
    And estou na página do calendário

  @RF014 @UC012 @media
  Scenario: Visualizar calendário mensal atual
    Given que estou na página do calendário
    When o calendário é carregado
    Then devo ver a grade do calendário do mês atual
    And devo ver o nome do mês e ano no cabeçalho
    And dias com pagamentos devem estar destacados
    And apenas despesas ativas devem ser consideradas

  @RF016 @UC012 @baixa
  Scenario: Visualizar detalhes de pagamentos do dia
    Given que estou visualizando o calendário
    And existe um dia com pagamentos destacado
    When clico em um dia destacado
    Then devo ver os detalhes dos pagamentos daquele dia
    And devo ver nome e valor de cada despesa

  @RF015 @UC013 @baixa
  Scenario: Navegar para o mês anterior
    Given que estou visualizando o calendário de Janeiro 2024
    When clico na seta "anterior"
    Then devo ver o calendário de Dezembro 2023
    And o título deve ser atualizado para "Dezembro 2023"
    And os destaques devem ser recalculados para o novo mês

  @RF015 @UC013 @baixa
  Scenario: Navegar para o próximo mês
    Given que estou visualizando o calendário de Janeiro 2024
    When clico na seta "próximo"
    Then devo ver o calendário de Fevereiro 2024
    And o título deve ser atualizado para "Fevereiro 2024"
    And os destaques devem ser recalculados para o novo mês

  @RF016 @UC012 @baixa
  Scenario: Identificar dias com pagamentos agendados
    Given que possuo despesas com vencimento no dia 15
    When visualizo o calendário
    Then o dia 15 deve estar visualmente destacado
    And deve ser diferente dos dias sem pagamentos
    And apenas despesas ativas devem gerar destaques
```

---

## 📊 Resumo por Feature

| Feature | Total | 🔴 Críticos | 🟡 Importantes | 🟢 Opcionais | ⚪ Validações |
|---------|-------|-------------|----------------|---------------|---------------|
| **🔐 Autenticação** | 8 | 2 | 1 | 1 | 4 |
| **💰 Despesas** | 13 | 3 | 3 | 2 | 5 |
| **📊 Dashboard** | 5 | 1 | 1 | 1 | 2 |
| **📅 Calendário** | 6 | 0 | 1 | 0 | 5 |
| **TOTAL** | **32** | **6** | **6** | **4** | **16** |

### 📈 Análise de Prioridades

#### 🔴 **Críticos (6 cenários - 18.75%)**
- Funcionalidades essenciais para o funcionamento básico
- Criar conta, login, CRUD básico de despesas
- Visualização de estatísticas financeiras

#### 🟡 **Importantes (6 cenários - 18.75%)**
- Melhoram significativamente a experiência do usuário
- Logout, exclusão segura, próximos pagamentos
- Ativação/desativação de despesas

#### 🟢 **Opcionais (4 cenários - 12.5%)**
- Funcionalidades complementares e de conveniência
- Recuperar senha, filtros, gráficos, calendário

#### ⚪ **Validações (16 cenários - 50%)**
- Casos de erro, validações e fluxos alternativos
- Garantem robustez e boa experiência em cenários adversos

---

## 🎯 Mapeamento e Rastreabilidade

### 🏷️ Sistema de Tags Gherkin
Cada cenário possui tags para rastreabilidade:
- **@RF###**: Requisito Funcional correspondente
- **@UC###**: Caso de Uso relacionado
- **@alta/@media/@baixa**: Nível de prioridade

### 📋 Comandos de Teste por Tags
```bash
# Executar cenários críticos
npx cypress run --env tags="@alta"

# Executar por feature
npx cypress run --env tags="@RF005,@RF006,@RF007"

# Executar casos de uso específicos
npx cypress run --env tags="@UC001,@UC002"
```

### 📚 Documentos Relacionados
- **[Especificações Técnicas](especificacoes-tecnicas.md)**: Detalhamento técnico dos requisitos
- **[Casos de Uso](casos-de-uso.md)**: Fluxos detalhados de cada funcionalidade
- **[Matriz de Rastreabilidade](matriz-rastreabilidade.md)**: Mapeamento completo entre todos os artefatos

---

## 🚀 Roadmap de Implementação

### Sprint 1 - Fundação (Concluído ✅)
**Cenários Críticos de Autenticação e Despesas**
- Criar conta válida, Login válido
- Adicionar despesa, Visualizar despesas, Editar despesa
- **6 cenários implementados**

### Sprint 2 - Funcionalidades Core (Concluído ✅)
**Dashboard e Operações Importantes**
- Estatísticas financeiras, Exclusão de despesas
- Ativação/desativação, Próximos pagamentos
- **6 cenários implementados**

### Sprint 3 - Recursos Avançados (Concluído ✅)
**Features Opcionais e Calendário**
- Filtros, Gráficos, Calendário mensal
- Recuperação de senha
- **4 cenários implementados**

### Sprint 4 - Validações e Polimento (Concluído ✅)
**Casos de Erro e Fluxos Alternativos**
- Validações de formulários, Mensagens de erro
- Casos de cancelamento, Estados vazios
- **16 cenários de validação implementados**

---

## 📝 Benefícios do Formato Gherkin

### ✅ **Vantagens Obtidas**
- **Linguagem Natural**: Cenários legíveis por stakeholders técnicos e não-técnicos
- **Estrutura Padronizada**: Given-When-Then garante consistência
- **Testabilidade**: Cada cenário pode ser automatizado diretamente
- **Rastreabilidade**: Tags conectam cenários a requisitos e casos de uso
- **Cobertura Completa**: 32 cenários cobrem todos os fluxos principais e alternativos

### 🎯 **Execução de Testes**
- **Por Prioridade**: Focar nos cenários críticos primeiro
- **Por Feature**: Testar funcionalidades específicas
- **Por Caso de Uso**: Validar fluxos completos de usuário
- **Regressão**: Executar todos os 32 cenários automaticamente

### 📊 **Status Atual**
- **32 cenários Gherkin definidos** (100%)
- **4 features completas** (Autenticação, Despesas, Dashboard, Calendário)
- **Cobertura total** de fluxos principais e alternativos
- **Sistema de tags implementado** para rastreabilidade completa

---

**Documento atualizado em**: Janeiro 2025  
**Versão**: 2.0 - Formato Gherkin  
**Autor**: Sistema Gerir.me  
**Status**: Todos os Cenários Gherkin Definidos ✅  
**Cenários**: 32 cenários em 4 features  
**Cobertura**: 100% dos fluxos principais e alternativos