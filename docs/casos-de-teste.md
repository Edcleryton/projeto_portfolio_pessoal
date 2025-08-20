# Casos de Teste - Sistema de Gerenciamento Financeiro

Documento baseado na ISO-29119-3 contendo os casos de teste para validação das funcionalidades do sistema de gerenciamento financeiro pessoal.

---

## Caso de Teste CT-001

**ID:** CT-001

**Título:** Validação de alternância de tema com toast sobrepondo elementos

**Prioridade:** Alta

**Rastreabilidade:** RF-008 (Alternância de tema), RF-009 (Notificações toast)

**Pré-Condições:**
- Usuário logado no sistema
- Dashboard carregado na seção "Visão Geral"
- Toast de boas-vindas visível na tela

### Passos

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Clicar no botão de alternância de tema no canto superior direito | Botão deve ser clicável e responder ao clique |
| Passo 2 | Observar a mudança de tema | Tema deve alternar de claro para escuro com transição suave |
| Passo 3 | Verificar a exibição do toast de confirmação | Toast deve aparecer com mensagem "Tema alterado - Modo escuro ativado" |

**Pós-Condições:**
- Tema escuro aplicado em toda a interface
- Toast de confirmação exibido
- Preferência salva no localStorage

**Defeito Relacionado:** DEF-027 (ver Relatório de Defeitos)

---

## Caso de Teste CT-002

**ID:** CT-002

**Título:** Verificação de estrutura de toast para automação

**Prioridade:** Média

**Rastreabilidade:** RF-009 (Notificações toast), RNF-003 (Testabilidade)

**Pré-Condições:**
- Sistema carregado
- Testes automatizados configurados
- Usuário logado no dashboard

### Passos

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Executar teste automatizado de alternância de tema | Teste deve localizar elementos do toast corretamente |
| Passo 2 | Verificar seletores CSS para título do toast | Elemento `.toast-title` deve estar presente e acessível |
| Passo 3 | Verificar seletores CSS para mensagem do toast | Elemento `.toast-message` deve estar presente e acessível |

**Pós-Condições:**
- Testes automatizados executam com sucesso
- Estrutura do toast validada

**Defeito Relacionado:** DEF-028 (ver Relatório de Defeitos)

---

## Caso de Teste CT-003

**ID:** CT-003

**Título:** Persistência de tema após recarregamento da página

**Prioridade:** Alta

**Rastreabilidade:** RF-008 (Alternância de tema), RNF-002 (Persistência de dados)

**Pré-Condições:**
- Usuário logado no sistema
- Tema padrão (claro) ativo
- Dashboard carregado

### Passos

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Alternar para tema escuro | Tema escuro deve ser aplicado e salvo no localStorage |
| Passo 2 | Recarregar a página (F5 ou Ctrl+R) | Página deve recarregar completamente |
| Passo 3 | Fazer login novamente | Sistema deve carregar com tema escuro mantido |
| Passo 4 | Verificar localStorage | Valor 'gerirme_theme' deve estar definido como 'dark' |

**Pós-Condições:**
- Tema escuro mantido após recarregamento
- Preferência persistida no navegador

**Defeito Relacionado:** DEF-029 (ver Relatório de Defeitos)

---

## Caso de Teste CT-004

**ID:** CT-004

**Título:** Validação de cores CSS em diferentes temas

**Prioridade:** Baixa

**Rastreabilidade:** RF-008 (Alternância de tema), RNF-001 (Interface responsiva)

**Pré-Condições:**
- Sistema carregado no tema claro
- Dashboard visível
- Ferramentas de desenvolvedor disponíveis

### Passos

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Inspecionar cores do tema claro | Background deve ser branco/claro (rgb(255,255,255)) |
| Passo 2 | Alternar para tema escuro | Cores devem mudar para tons escuros |
| Passo 3 | Inspecionar cores do tema escuro | Background deve ser escuro (rgb(15,23,42) ou similar) |
| Passo 4 | Verificar contraste de elementos | Texto deve manter legibilidade em ambos os temas |

**Pós-Condições:**
- Cores aplicadas corretamente
- Contraste adequado mantido

**Defeito Relacionado:** DEF-030 (ver Relatório de Defeitos)

---

## Caso de Teste CT-005

**ID:** CT-005

**Título:** Fechamento manual de toast

**Prioridade:** Média

**Rastreabilidade:** RF-009 (Notificações toast), RF-010 (Usabilidade)

**Pré-Condições:**
- Sistema carregado
- Toast visível na tela
- Botão de fechar (X) presente no toast

### Passos

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Localizar botão de fechar no toast | Botão 'X' deve estar visível no canto do toast |
| Passo 2 | Clicar no botão de fechar | Toast deve desaparecer da tela |
| Passo 3 | Verificar se toast foi removido do DOM | Elemento toast não deve mais estar presente |

**Pós-Condições:**
- Toast removido da interface
- Elementos subjacentes acessíveis novamente

**Defeito Relacionado:** DEF-031 (ver Relatório de Defeitos)

---

## Caso de Teste CT-006

**ID:** CT-006

**Título:** Validação de recorrência de despesas em meses seguintes

**Prioridade:** Alta

**Rastreabilidade:** RF-003 (Gerenciamento de despesas), RF-004 (Despesas recorrentes)

**Pré-Condições:**
- Usuário logado no sistema
- Despesa recorrente cadastrada no mês atual
- Sistema configurado para processar recorrências

### Passos

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Cadastrar uma despesa com recorrência mensal | Despesa deve ser salva com flag de recorrência |
| Passo 2 | Navegar para o próximo mês no calendário | Calendário deve exibir o mês seguinte |
| Passo 3 | Verificar se a despesa recorrente aparece | Despesa deve estar visível no mesmo dia do mês seguinte |

**Pós-Condições:**
- Despesa recorrente visível em meses subsequentes
- Dados de recorrência mantidos corretamente

**Defeito Relacionado:** DEF-032 (ver Relatório de Defeitos)

---

## Caso de Teste CT-007

**ID:** CT-007

**Título:** Verificação de exibição correta da data de pagamento

**Prioridade:** Alta

**Rastreabilidade:** RF-003 (Gerenciamento de despesas), RF-005 (Calendário de pagamentos)

**Pré-Condições:**
- Usuário logado no sistema
- Despesa cadastrada com data de vencimento específica
- Calendário carregado

### Passos

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Cadastrar despesa com data de vencimento 15/01/2025 | Despesa deve ser salva com data correta |
| Passo 2 | Visualizar o calendário do mês de janeiro | Calendário deve exibir janeiro de 2025 |
| Passo 3 | Localizar o dia 15 no calendário | Data de pagamento deve estar marcada no dia 15 |

**Pós-Condições:**
- Data de pagamento exibida no dia correto
- Calendário sincronizado com dados das despesas

**Defeito Relacionado:** DEF-033 (ver Relatório de Defeitos)

---

## Caso de Teste CT-008

**ID:** CT-008

**Título:** Formatação correta de valores decimais

**Prioridade:** Média

**Rastreabilidade:** RF-003 (Gerenciamento de despesas), RNF-004 (Formatação de dados)

**Pré-Condições:**
- Usuário logado no sistema
- Formulário de cadastro de despesa aberto
- Campo de valor disponível para entrada

### Passos

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Inserir valor "21,10" no campo de valor | Sistema deve aceitar o valor com duas casas decimais |
| Passo 2 | Salvar a despesa | Despesa deve ser salva com valor formatado corretamente |
| Passo 3 | Visualizar a despesa na lista | Valor deve ser exibido como "R$ 21,10" |

**Pós-Condições:**
- Valores decimais exibidos com duas casas decimais
- Formatação monetária consistente em toda a aplicação

**Defeito Relacionado:** DEF-034 (ver Relatório de Defeitos)

---

## Caso de Teste CT-009

**ID:** CT-009

**Título:** Identificação de contas no calendário

**Prioridade:** Média

**Rastreabilidade:** RF-005 (Calendário de pagamentos), RF-006 (Identificação de despesas)

**Pré-Condições:**
- Usuário logado no sistema
- Múltiplas despesas cadastradas para o mesmo dia
- Calendário carregado com dados das despesas

### Passos

| Passo | Ação | Resultados Esperados |
|-------|------|---------------------|
| Passo 1 | Cadastrar duas despesas para o mesmo dia | Ambas despesas devem ser salvas |
| Passo 2 | Visualizar o calendário | Dia deve estar marcado em amarelo |
| Passo 3 | Clicar ou passar o mouse sobre o dia marcado | Tooltip ou popup deve mostrar quais contas devem ser pagas |

**Pós-Condições:**
- Usuário consegue identificar quais contas vencer no dia
- Interface fornece informações detalhadas sobre pagamentos

**Defeito Relacionado:** DEF-035 (ver Relatório de Defeitos)

---

## Resumo dos Casos de Teste

| ID | Título | Prioridade | Status | Defeito Relacionado |
|----|--------|------------|--------|--------------------|
| CT-001 | Alternância de tema com sobreposição | Alta | ✅ Executado | DEF-027 |
| CT-002 | Estrutura de toast para automação | Média | ✅ Executado | DEF-028 |
| CT-003 | Persistência de tema após reload | Alta | ✅ Executado | DEF-029 |
| CT-004 | Validação de cores CSS | Baixa | ✅ Executado | DEF-030 |
| CT-005 | Fechamento manual de toast | Média | ✅ Executado | DEF-031 |
| CT-006 | Recorrência de despesas em meses seguintes | Alta | 📋 Planejado | DEF-032 |
| CT-007 | Exibição correta da data de pagamento | Alta | 📋 Planejado | DEF-033 |
| CT-008 | Formatação correta de valores decimais | Média | 📋 Planejado | DEF-034 |
| CT-009 | Identificação de contas no calendário | Média | 📋 Planejado | DEF-035 |

---

## Observações

- **5 casos de teste executados** com sucesso, identificando defeitos de interface
- **4 casos de teste planejados** para validação de funcionalidades principais
- Os testes automatizados de interface passam com 100% de sucesso (11/11 testes)
- A funcionalidade de alternância de tema está funcionando conforme especificado
- A estrutura dos toasts foi padronizada para melhor testabilidade
- **Todos os defeitos identificados foram registrados no Relatório de Defeitos** (DEF-027 a DEF-035)
- **Status dos defeitos:**
  - 5 defeitos de interface: ✅ Resolvidos
  - 4 defeitos funcionais: ❌ Pendentes de correção

**Data de Criação:** Janeiro 2025  
**Última Atualização:** Janeiro 2025  
**Responsável:** Equipe de QA