# Plano e Estratégia de Testes

> 📚 **[← Voltar para Wiki](README.md)** | **[User Stories ←](user-stories.md)** | **[Regras de Negócio →](regras-de-negocio.md)** | **[Configuração →](configuracao-desenvolvimento.md)**

Baseado na ISO-29119-3.

## 1. Épico e Estimativa Geral de Esforço em Testes

### Épico: MVP Gerir.me - Gerenciador de Assinaturas

**Objetivo:** Desenvolver um MVP completo e funcional em 3 Sprints (6 semanas) que permita aos usuários gerenciar suas assinaturas digitais e visualizar o impacto financeiro mensal.

**Valor de Negócio:** Fornecer aos usuários uma ferramenta simples e eficaz para controlar gastos com assinaturas digitais, oferecendo visibilidade clara do custo mensal total.

### Estimativa Geral de Esforço em Testes

| Sprint | Duração | Foco Principal | Esforço de Teste | % do Total |
|--------|---------|----------------|------------------|------------|
| **Sprint 1** | 2 semanas | Fundação e Acesso (HU01, HU02) | 32 horas | 35% |
| **Sprint 2** | 2 semanas | Gerenciamento Básico (HU03, HU04) | 28 horas | 30% |
| **Sprint 3** | 2 semanas | Valor e Conclusão (HU06, HU07) | 32 horas | 35% |
| **Total MVP** | 6 semanas | 6 User Stories Priorizadas | **92 horas** | **100%** |

**Distribuição do Esforço:**
- **Testes Funcionais:** 60% (55h)
- **Testes de Segurança:** 20% (18h) 
- **Testes de Usabilidade:** 15% (14h)
- **Testes Exploratórios:** 5% (5h)

## 2. User Stories e Estimativa de Esforço em Testes

### Sprint 1: Fundação e Acesso do Usuário (2 semanas)
**Meta:** Usuário capaz de se cadastrar e acessar área autenticada e segura.

| Código | Descrição | Esforço | RNF Foco |
|--------|-----------|---------|----------|
| **HU01** | Cadastro de Novo Usuário | 16h | RNF02 (Segurança) |
| **HU02** | Login de Usuário | 16h | RNF02 (Segurança) |
| **Subtotal Sprint 1** | **Fundação e Acesso** | **32h** | **Segurança** |

### Sprint 2: Gerenciamento Básico de Assinaturas (2 semanas)
**Meta:** Usuário logado capaz de cadastrar e visualizar assinaturas em lista.

| Código | Descrição | Esforço | RNF Foco |
|--------|-----------|---------|----------|
| **HU03** | Adicionar Nova Assinatura | 14h | RNF03 (Usabilidade) |
| **HU04** | Visualizar Lista de Assinaturas | 14h | RNF03 (Responsividade) |
| **Subtotal Sprint 2** | **Gerenciamento Básico** | **28h** | **Usabilidade** |

### Sprint 3: Entrega de Valor e Conclusão do MVP (2 semanas)
**Meta:** Usuário visualiza custo mensal total e pode remover assinaturas.

| Código | Descrição | Esforço | RNF Foco |
|--------|-----------|---------|----------|
| **HU07** | Dashboard de Custo Mensal | 18h | RNF03 (Usabilidade) |
| **HU06** | Remover uma Assinatura | 14h | RNF03 (Usabilidade) |
| **Subtotal Sprint 3** | **Valor e Conclusão** | **32h** | **Usabilidade** |

### Resumo Total do MVP

| Sprint   | User Stories | Esforço Total | % do MVP |
|----------|--------------|---------------|----------|
| Sprint 1 | HU01, HU02   |      32h      |    35%   |
| Sprint 2 | HU03, HU04   |      28h      |    30%   |
| Sprint 3 | HU06, HU07   |      32h      |    35%   |
| **TOTAL MVP** | **6 User Stories** | **92h** | **100%** |

## 3. Condições de Teste e Camadas

### HU01: Cadastro de Novo Usuário

| ID | Condição | Resultado Esperado | Camada |
|----|----------|-------------------|--------|
| CT001 | Criar conta com dados válidos (nome, email único, senha ≥6 chars) | Login automático + redirecionamento para dashboard | E2E |
| CT002 | Tentar criar conta com email já existente | Mensagem "Email já cadastrado" + permanecer na tela | Integração |
| CT003 | Tentar criar conta com senha < 6 caracteres | Mensagem de erro sobre senha mínima | Unitário |
| CT004 | Validar persistência de dados no localStorage | Dados salvos corretamente após criação | Integração |

### HU02: Login de Usuário

| ID | Condição | Resultado Esperado | Camada |
|----|----------|-------------------|--------|
| CT005 | Login com credenciais válidas | Redirecionamento para dashboard + nome no header | E2E |
| CT006 | Login com credenciais inválidas | Mensagem "Credenciais inválidas" + permanecer na tela | Integração |
| CT007 | Validar persistência de sessão | Sessão mantida após refresh da página | Integração |
| CT008 | Validar limpeza de dados temporários no logout | Dados removidos do localStorage | Unitário |

### HU03: Adicionar Nova Assinatura

| ID | Condição | Resultado Esperado | Camada |
|----|----------|-------------------|--------|
| CT009 | Adicionar assinatura com dados válidos | Assinatura criada + exibida na lista | E2E |
| CT010 | Validar campos obrigatórios (nome, valor, categoria) | Validação HTML5 + mensagens de erro | Unitário |
| CT011 | Validar formato de valor monetário | Valor formatado corretamente (R$ 0,00) | Unitário |
| CT012 | Validar responsividade do formulário | Formulário funcional em mobile/desktop | E2E |

### HU04: Visualizar Lista de Assinaturas

| ID | Condição | Resultado Esperado | Camada |
|----|----------|-------------------|--------|
| CT013 | Visualizar lista com assinaturas cadastradas | Lista exibida com todas as assinaturas ativas | Integração |
| CT014 | Visualizar lista vazia | Mensagem "Nenhuma assinatura cadastrada" | E2E |
| CT015 | Validar responsividade da lista | Lista adaptada para diferentes tamanhos de tela | E2E |
| CT016 | Validar ordenação por data de criação | Assinaturas ordenadas da mais recente para antiga | Unitário |

### HU06: Remover uma Assinatura

| ID | Condição | Resultado Esperado | Camada |
|----|----------|-------------------|--------|
| CT017 | Remover assinatura com confirmação | Assinatura removida + atualização da lista | E2E |
| CT018 | Cancelar remoção de assinatura | Assinatura mantida + modal fechado | Integração |
| CT019 | Validar atualização automática de estatísticas | Totais recalculados após remoção | Integração |
| CT020 | Validar remoção de última assinatura | Lista vazia + mensagem apropriada | E2E |

### HU07: Dashboard de Custo Mensal

| ID | Condição | Resultado Esperado | Camada |
|----|----------|-------------------|--------|
| CT021 | Visualizar estatísticas com assinaturas ativas | Cards com total mensal, anual e contador | E2E |
| CT022 | Validar cálculos de totais mensais e anuais | Valores corretos formatados em R$ | Unitário |
| CT023 | Validar atualização automática após mudanças | Estatísticas atualizadas em tempo real | Integração |
| CT024 | Visualizar dashboard sem assinaturas | Cards com valores zerados + mensagens apropriadas | E2E |

## 4. Missões de Teste Exploratório

### Missão 1: Segurança de Autenticação (Sprint 1)
**Foco**: RNF02 - Segurança  
**Duração**: 2 horas  
**Objetivo**: Explorar vulnerabilidades e comportamentos de segurança no sistema de autenticação

**Cenários a Explorar**:
- Tentativas de SQL injection nos campos de login
- Comportamento com caracteres especiais em senhas
- Persistência inadequada de dados sensíveis
- Validação de sessão após logout
- Tentativas de acesso direto a páginas protegidas
- Comportamento com múltiplas tentativas de login

**Critérios de Sucesso**:
- Nenhuma vulnerabilidade crítica encontrada
- Dados sensíveis não expostos no localStorage
- Redirecionamentos de segurança funcionando

### Missão 2: Usabilidade do Formulário de Assinaturas (Sprint 2)
**Foco**: RNF03 - Usabilidade  
**Duração**: 1.5 horas  
**Objetivo**: Avaliar a experiência do usuário ao gerenciar assinaturas

**Cenários a Explorar**:
- Fluxo completo de adição de assinatura sem instruções
- Comportamento com valores monetários extremos (R$ 0,01 e R$ 999.999,99)
- Usabilidade em diferentes categorias de assinaturas
- Feedback visual durante operações de CRUD
- Clareza das mensagens de erro e sucesso
- Facilidade de correção de erros no formulário

**Critérios de Sucesso**:
- Usuário consegue completar tarefas sem confusão
- Mensagens claras e úteis
- Fluxo intuitivo e eficiente

### Missão 3: Responsividade e Adaptabilidade (Sprint 2 e 3)
**Foco**: RNF03 - Responsividade  
**Duração**: 2 horas  
**Objetivo**: Validar comportamento em diferentes dispositivos e resoluções

**Cenários a Explorar**:
- Funcionalidade completa em smartphones (320px - 480px)
- Comportamento em tablets (768px - 1024px)
- Experiência em desktops (1200px+)
- Rotação de tela em dispositivos móveis
- Zoom do navegador (50% - 200%)
- Navegação por teclado e acessibilidade

**Critérios de Sucesso**:
- Interface funcional em todas as resoluções testadas
- Elementos não sobrepostos ou cortados
- Navegação eficiente em touch e mouse

### Missão 4: Performance e Experiência do Dashboard (Sprint 3)
**Foco**: RNF03 - Usabilidade do Dashboard  
**Duração**: 1 hora  
**Objetivo**: Avaliar performance e clareza das informações financeiras

**Cenários a Explorar**:
- Tempo de carregamento com diferentes quantidades de assinaturas (1, 10, 50+)
- Precisão dos cálculos com valores decimais complexos
- Comportamento com assinaturas de diferentes ciclos (mensal/anual)
- Clareza visual das estatísticas financeiras
- Atualização em tempo real após mudanças

**Critérios de Sucesso**:
- Carregamento rápido (< 2 segundos)
- Cálculos precisos e consistentes
- Informações claras e bem organizadas

## 5. Testes Não-Funcionais

### RNF02 - Segurança (Sprint 1)

| Tipo | Teste | Resultado Esperado |
|------|-------|-------------------|
| **Autenticação** | Validar hash de senhas no localStorage | Senhas nunca armazenadas em texto plano |
| **Autorização** | Tentar acesso direto a /dashboard sem login | Redirecionamento automático para /login |
| **Sessão** | Validar expiração de sessão após logout | Dados de sessão completamente limpos |
| **Validação** | Testar campos com scripts maliciosos | Sanitização adequada de inputs |
| **Persistência** | Verificar dados sensíveis no localStorage | Apenas dados não-sensíveis armazenados |

### RNF03 - Usabilidade e Responsividade (Sprint 2 e 3)

| Tipo | Teste | Resultado Esperado |
|------|-------|-------------------|
| **Responsividade** | Testar em resolução 320px (mobile) | Interface funcional e legível |
| **Responsividade** | Testar em resolução 768px (tablet) | Layout adaptado sem sobreposições |
| **Responsividade** | Testar em resolução 1200px+ (desktop) | Aproveitamento otimizado do espaço |
| **Usabilidade** | Tempo para completar cadastro de assinatura | Máximo 2 minutos para usuário novo |
| **Usabilidade** | Taxa de erro em formulários | Máximo 10% de erros de preenchimento |
| **Performance** | Tempo de carregamento do dashboard | Máximo 2 segundos com 50 assinaturas |
| **Acessibilidade** | Navegação por teclado (Tab/Enter) | Todos os elementos acessíveis |
| **Acessibilidade** | Contraste de cores (WCAG 2.1) | Razão mínima 4.5:1 para textos |

### Critérios de Aceitação Não-Funcionais

#### 🔒 Segurança
- ✅ Nenhum dado sensível exposto no cliente
- ✅ Validação adequada de todos os inputs
- ✅ Controle de acesso funcionando corretamente
- ✅ Sessões gerenciadas de forma segura

#### 📱 Responsividade
- ✅ Funcional em dispositivos 320px - 1920px
- ✅ Layout adaptativo sem quebras visuais
- ✅ Touch targets mínimos de 44px em mobile
- ✅ Texto legível sem zoom horizontal

#### 👤 Usabilidade
- ✅ Interface intuitiva para usuários não-técnicos
- ✅ Feedback claro para todas as ações
- ✅ Mensagens de erro úteis e específicas
- ✅ Fluxos de trabalho eficientes e diretos

#### ⚡ Performance
- ✅ Carregamento inicial < 3 segundos
- ✅ Operações CRUD < 1 segundo
- ✅ Cálculos financeiros instantâneos
- ✅ Interface responsiva sem travamentos