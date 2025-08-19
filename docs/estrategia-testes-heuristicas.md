# Estratégia de Testes Baseada em Heurísticas

## Visão Geral

Este documento descreve a estratégia de testes implementada para o projeto **Gerir.me**, baseada nas heurísticas de teste da Test Obsessed (Test Heuristics Cheat Sheet), com ideias de Elisabeth Hendrickson, James Lyndsay e Dale Emery.

## Arquivos de Teste Consolidados

### 1. Testes Funcionais Principais
- `testes-gerenciamento-usuarios.cy.js` - Cadastro, login, autenticação
- `testes-gerenciamento-despesas.cy.js` - CRUD de despesas
- `testes-calculos-dashboard.cy.js` - Cálculos e totalizações
- `testes-notificacoes-interface.cy.js` - Notificações e interface

### 2. Testes Funcionais Avançados
- `testes-cenarios-funcionais-avancados.cy.js` - Regras de negócio complexas
- `testes-edge-cases-funcionais.cy.js` - Casos limites e validações
- `testes-integracao-fluxos.cy.js` - Fluxos completos de usuário
- `testes-regras-negocio-complexas.cy.js` - Validações específicas

### 3. Testes Heurísticos (Consolidado)
- `testes-heuristicos.cy.js` - Ataques de dados, strings, UI e segurança

### 4. Testes Básicos
- `registro.cy.js` - Testes básicos de registro

## Heurísticas Implementadas

### 🎯 Ataques de Tipos de Dados

| Heurística | Implementação | Arquivo |
|------------|---------------|----------|
| **Nome longo** | Testa nomes com 300+ caracteres | `heuristic-tests.cy.js` |
| **Caracteres especiais** | Testa *, ?, /, \\, <, >, etc. | `heuristic-tests.cy.js` |
| **Nome já existente** | Tenta cadastrar email duplicado | `heuristic-tests.cy.js` |
| **Espaços** | Testa espaços no início/fim | `heuristic-tests.cy.js` |
| **Dias inválidos** | Testa 30/02, 31/04, etc. | `dashboard-heuristic-tests.cy.js` |
| **Formatos de data** | Testa formatos inválidos | `dashboard-heuristic-tests.cy.js` |

### 📝 Testes de Strings

| Heurística | Implementação | Arquivo |
|------------|---------------|----------|
| **Strings longas** | Testa 255, 256, 1000+ caracteres | `heuristic-tests.cy.js` |
| **Caracteres acentuados** | Testa à, á, â, ã, ä, ç, etc. | `heuristic-tests.cy.js` |
| **Caracteres asiáticos** | Testa 田中太郎, パスワード | `heuristic-tests.cy.js` |
| **Caracteres especiais** | Testa ", ', ;, quebras de linha | `heuristic-tests.cy.js` |
| **Em branco** | Testa campos vazios | `heuristic-tests.cy.js` |
| **Espaços extras** | Testa espaços no início/fim | `heuristic-tests.cy.js` |
| **Injeção SQL** | Testa '; DROP TABLE; --, etc. | `heuristic-tests.cy.js` |

### 🖥️ Testes de UI

| Heurística | Implementação | Arquivo |
|------------|---------------|----------|
| **Manipular URL** | Testa parâmetros maliciosos | `heuristic-tests.cy.js` |
| **Responsividade** | Testa múltiplas resoluções | `validation-tests.cy.js` |

### 🔒 Heurísticas de Segurança

| Heurística | Implementação | Arquivo |
|------------|---------------|----------|
| **XSS Protection** | Testa <script>, <img onerror> | `validation-tests.cy.js` |
| **SQL Injection** | Testa injeções em todos campos | `heuristic-tests.cy.js` |
| **Dados Sensíveis** | Verifica exposição de senhas | `validation-tests.cy.js` |
| **Headers Segurança** | Verifica resposta HTTP | `validation-tests.cy.js` |

### 📊 CRUD e Integridade de Dados

| Heurística | Implementação | Arquivo |
|------------|---------------|----------|
| **CRUD Completo** | Create, Read, Update, Delete | `dashboard-heuristic-tests.cy.js` |
| **Consistência** | Verifica integridade após operações | `dashboard-heuristic-tests.cy.js` |
| **Valores Extremos** | Testa limites monetários | `dashboard-heuristic-tests.cy.js` |

### ♿ Acessibilidade e Usabilidade

| Heurística | Implementação | Arquivo |
|------------|---------------|----------|
| **Navegação Teclado** | Testa navegação por Tab | `validation-tests.cy.js` |
| **Estados de Foco** | Verifica feedback visual | `validation-tests.cy.js` |
| **Mensagens Erro** | Verifica clareza das mensagens | `validation-tests.cy.js` |
| **Consistência Design** | Verifica padrões visuais | `validation-tests.cy.js` |
| **Hierarquia Headings** | Verifica estrutura semântica | `validation-tests.cy.js` |

## Cobertura de Testes por Funcionalidade

### 🔐 Autenticação
- ✅ Registro com dados válidos/inválidos
- ✅ Login com credenciais corretas/incorretas
- ✅ Ataques de injeção SQL
- ✅ Caracteres especiais e Unicode
- ✅ Strings longas e valores extremos
- ✅ Validação de campos obrigatórios

### 💰 Gerenciamento de Despesas
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Validação de valores monetários extremos
- ✅ Datas inválidas e formatos incorretos
- ✅ Descrições com caracteres especiais
- ✅ Filtros e busca com ataques de dados
- ✅ Operações em lote e performance

### 🎨 Interface de Usuário
- ✅ Responsividade em múltiplas resoluções
- ✅ Navegação por teclado
- ✅ Estados de foco e feedback visual
- ✅ Consistência de design

### 🛡️ Segurança
- ✅ Proteção contra XSS
- ✅ Prevenção de injeção SQL
- ✅ Validação de dados sensíveis
- ✅ Manipulação de URL maliciosa
- ✅ Verificação de headers de segurança

## Execução dos Testes

### Pré-requisitos
```bash
# Instalar dependências
npm install

# Iniciar servidor local
npm start
```

### Executar Testes
```bash
# Executar todos os testes
npx cypress run

# Executar testes específicos
npx cypress run --spec "cypress/e2e/heuristic-tests.cy.js"
npx cypress run --spec "cypress/e2e/dashboard-heuristic-tests.cy.js"
npx cypress run --spec "cypress/e2e/validation-tests.cy.js"

# Abrir interface gráfica
npx cypress open
```

### Estrutura de Execução Recomendada

1. **Testes Básicos** (`register.cy.js`)
   - Validação de funcionalidades core
   - Smoke tests essenciais

2. **Testes Heurísticos** (`heuristic-tests.cy.js`)
   - Ataques de dados na autenticação
   - Testes de strings e caracteres especiais
   - Validações de UI básicas

3. **Testes de Dashboard** (`dashboard-heuristic-tests.cy.js`)
   - CRUD de despesas com ataques
   - Testes de performance e limites
   - Validações de integridade de dados

4. **Testes de Validação** (`validation-tests.cy.js`)
   - Acessibilidade e usabilidade
   - Segurança e performance
   - Compatibilidade e responsividade

## Métricas e Relatórios

### Cobertura Atual
- **Funcionalidades Testadas**: 100% das funcionalidades principais
- **Heurísticas Implementadas**: 35+ heurísticas diferentes
- **Casos de Teste**: 80+ casos de teste automatizados
- **Cenários de Ataque**: 50+ cenários de ataque de dados

### Tipos de Defeitos Detectáveis
- 🔍 **Validação de Entrada**: Campos que aceitam dados inválidos
- 🛡️ **Vulnerabilidades**: XSS, SQL Injection, manipulação de URL
- 🎨 **Problemas de UI**: Layout quebrado, elementos inacessíveis
- ⚡ **Performance**: Lentidão e travamentos
- 📱 **Responsividade**: Problemas em diferentes resoluções
- ♿ **Acessibilidade**: Navegação por teclado, contraste, semântica

## Manutenção e Evolução

### Adição de Novos Testes
1. Identificar nova funcionalidade ou heurística
2. Escolher arquivo apropriado ou criar novo
3. Implementar casos de teste seguindo padrões existentes
4. Atualizar documentação

### Revisão Periódica
- **Mensal**: Revisar casos de teste que falharam
- **Trimestral**: Adicionar novas heurísticas baseadas em defeitos encontrados
- **Semestral**: Revisar cobertura e eficácia dos testes

### Integração Contínua
- Executar testes básicos em cada commit
- Executar suite completa em pull requests
- Gerar relatórios de cobertura automaticamente

## Conclusão

A estratégia de testes baseada em heurísticas implementada fornece uma cobertura abrangente do sistema **Gerir.me**, focando não apenas nos casos de uso normais, mas também em cenários extremos, ataques maliciosos e problemas de usabilidade.

Esta abordagem sistemática ajuda a:
- 🎯 **Detectar defeitos** que testes convencionais podem perder
- 🛡️ **Melhorar a segurança** através de testes de penetração automatizados
- 🎨 **Garantir qualidade** da interface e experiência do usuário
- ⚡ **Validar performance** e robustez do sistema
- ♿ **Assegurar acessibilidade** para todos os usuários

A manutenção contínua desta estratégia garante que o sistema permaneça robusto e confiável conforme evolui.

---

**Documento criado em**: 16/01/2025  
**Versão**: 1.0  
**Autor**: Sistema de Testes Automatizados  
**Próxima Revisão**: 16/04/2025