# Casos de Teste - Bugs Registrados

Documento baseado na ISO-29119-3 contendo os casos de teste que levaram à identificação dos bugs registrados no sistema.

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

**Bug Identificado:** BUG-001 - Toast de boas-vindas sobrepõe botão de tema

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

**Bug Identificado:** BUG-002 - Estrutura de toast inadequada para testes automatizados

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

**Bug Identificado:** BUG-003 - Problemas de visibilidade em elementos após reload

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

**Bug Identificado:** BUG-004 - Verificações de CSS muito específicas causando falhas

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

**Bug Identificado:** BUG-005 - Método incorreto de fechamento de toast em testes

---

## Resumo dos Casos de Teste

| ID | Título | Prioridade | Status | Bug Relacionado |
|----|--------|------------|--------|-----------------|
| CT-001 | Alternância de tema com sobreposição | Alta | ✅ Resolvido | BUG-001 |
| CT-002 | Estrutura de toast para automação | Média | ✅ Resolvido | BUG-002 |
| CT-003 | Persistência de tema após reload | Alta | ✅ Resolvido | BUG-003 |
| CT-004 | Validação de cores CSS | Baixa | ✅ Resolvido | BUG-004 |
| CT-005 | Fechamento manual de toast | Média | ✅ Resolvido | BUG-005 |

---

## Observações

- Todos os casos de teste foram executados e os bugs identificados foram corrigidos
- Os testes automatizados agora passam com 100% de sucesso (11/11 testes)
- A funcionalidade de alternância de tema está funcionando conforme especificado
- A estrutura dos toasts foi padronizada para melhor testabilidade

**Data de Criação:** Janeiro 2025  
**Última Atualização:** Janeiro 2025  
**Responsável:** Equipe de QA