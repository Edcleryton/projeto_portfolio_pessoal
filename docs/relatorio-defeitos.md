# 🐛 Relatório de Defeitos - Gerir.me

**Baseado na ISO-29119-3 e em ferramentas de gestão de defeitos**

---

## DEF-001

| Campo | Valor |
|-------|-------|
| **ID** | DEF-001 |
| **Título** | Teste de Login falha ao executar em modo headless |
| **Testador** | Sistema Automatizado Cypress |
| **Data e Hora** | 2024-12-19 - Execução dos testes automatizados |
| **Resultado Esperado** | O teste de login deveria passar, preenchendo email e senha, submetendo o formulário e verificando se o usuário foi redirecionado para o dashboard |
| **Resultado Atual** | Teste falha durante execução em modo headless com timeout ou elementos não encontrados |
| **Evidências** | Vídeo: `cypress/videos/login/login.cy.js.mp4`<br>Screenshots: `cypress/screenshots/login.cy.js/` |
| **Prioridade** | Alta |
| **Severidade** | Alta - Impede validação da funcionalidade principal de autenticação |
| **Informações sobre o Software** | Versão: 1.0.0<br>Ambiente: Cypress 14.5.4 + Electron 130 (headless)<br>URL: http://localhost:8080 |
| **Rastreabilidade** | HU02 - Como usuário, quero fazer login no sistema<br>Teste: `cypress/e2e/login/login.cy.js` |
| **Status** | Aberto |

---

## DEF-002

| Campo | Valor |
|-------|-------|
| **ID** | DEF-002 |
| **Título** | Teste de Registro de usuário falha em modo headless |
| **Testador** | Sistema Automatizado Cypress |
| **Data e Hora** | 2024-12-19 - Execução dos testes automatizados |
| **Resultado Esperado** | O teste de registro deveria passar, preenchendo nome, email, senha e confirmação, submetendo o formulário e verificando redirecionamento |
| **Resultado Atual** | Teste falha durante execução em modo headless com timeout ou elementos não encontrados |
| **Evidências** | Vídeo: `cypress/videos/register.cy.js.mp4`<br>Screenshots: `cypress/screenshots/register.cy.js/` |
| **Prioridade** | Alta |
| **Severidade** | Alta - Impede validação da funcionalidade de cadastro de novos usuários |
| **Informações sobre o Software** | Versão: 1.0.0<br>Ambiente: Cypress 14.5.4 + Electron 130 (headless)<br>URL: http://localhost:8080 |
| **Rastreabilidade** | HU01 - Como usuário, quero me cadastrar no sistema<br>Teste: `cypress/e2e/register.cy.js` |
| **Status** | Aberto |

---

## DEF-003

| Campo | Valor |
|-------|-------|
| **ID** | DEF-003 |
| **Título** | Teste de Dashboard falha ao carregar estatísticas |
| **Testador** | Sistema Automatizado Cypress |
| **Data e Hora** | 2024-12-19 - Execução dos testes automatizados |
| **Resultado Esperado** | O teste deveria fazer login e verificar a visibilidade dos cards de estatísticas (gasto mensal, anual, assinaturas ativas, próximos pagamentos) |
| **Resultado Atual** | Teste falha ao tentar verificar elementos do dashboard após login |
| **Evidências** | Vídeo: `cypress/videos/dashboard/dashboard.cy.js.mp4`<br>Screenshots: `cypress/screenshots/dashboard/dashboard.cy.js/` |
| **Prioridade** | Média |
| **Severidade** | Média - Impede validação das estatísticas principais do sistema |
| **Informações sobre o Software** | Versão: 1.0.0<br>Ambiente: Cypress 14.5.4 + Electron 130 (headless)<br>URL: http://localhost:8080 |
| **Rastreabilidade** | HU07 - Como usuário, quero visualizar meu dashboard com estatísticas<br>Teste: `cypress/e2e/dashboard/dashboard.cy.js` |
| **Status** | Aberto |

---

## DEF-004

| Campo | Valor |
|-------|-------|
| **ID** | DEF-004 |
| **Título** | Teste de Lista de Assinaturas falha ao carregar dados |
| **Testador** | Sistema Automatizado Cypress |
| **Data e Hora** | 2024-12-19 - Execução dos testes automatizados |
| **Resultado Esperado** | O teste deveria fazer login, navegar para seção de assinaturas e verificar a lista de assinaturas com filtros funcionais |
| **Resultado Atual** | Teste falha ao tentar acessar ou verificar elementos da lista de assinaturas |
| **Evidências** | Vídeo: `cypress/videos/dashboard/lista-assinaturas.cy.js.mp4`<br>Screenshots: `cypress/screenshots/dashboard/lista-assinaturas.cy.js/` |
| **Prioridade** | Média |
| **Severidade** | Média - Impede validação da visualização de assinaturas cadastradas |
| **Informações sobre o Software** | Versão: 1.0.0<br>Ambiente: Cypress 14.5.4 + Electron 130 (headless)<br>URL: http://localhost:8080 |
| **Rastreabilidade** | HU04 - Como usuário, quero visualizar minhas assinaturas<br>Teste: `cypress/e2e/dashboard/lista-assinaturas.cy.js` |
| **Status** | Aberto |

---

## DEF-005

| Campo | Valor |
|-------|-------|
| **ID** | DEF-005 |
| **Título** | Teste de Adicionar Assinatura falha ao preencher formulário |
| **Testador** | Sistema Automatizado Cypress |
| **Data e Hora** | 2024-12-19 - Execução dos testes automatizados |
| **Resultado Esperado** | O teste deveria fazer login, abrir modal de nova assinatura, preencher dados e verificar se a assinatura foi adicionada à lista |
| **Resultado Atual** | Teste falha ao tentar interagir com o modal ou verificar a adição da nova assinatura |
| **Evidências** | Vídeo: `cypress/videos/register/adicionar-assinatura.cy.js.mp4`<br>Screenshots: `cypress/screenshots/register/adicionar-assinatura.cy.js/` |
| **Prioridade** | Alta |
| **Severidade** | Alta - Impede validação da funcionalidade principal de cadastro de assinaturas |
| **Informações sobre o Software** | Versão: 1.0.0<br>Ambiente: Cypress 14.5.4 + Electron 130 (headless)<br>URL: http://localhost:8080 |
| **Rastreabilidade** | HU03 - Como usuário, quero adicionar uma nova assinatura<br>Teste: `cypress/e2e/register/adicionar-assinatura.cy.js` |
| **Status** | Aberto |

---

## DEF-006

| Campo | Valor |
|-------|-------|
| **ID** | DEF-006 |
| **Título** | Teste de Remover Assinatura falha ao executar ação de exclusão |
| **Testador** | Sistema Automatizado Cypress |
| **Data e Hora** | 2024-12-19 - Execução dos testes automatizados |
| **Resultado Esperado** | O teste deveria fazer login, adicionar uma assinatura de teste, removê-la e verificar se foi excluída da lista |
| **Resultado Atual** | Teste falha ao tentar executar a ação de remoção ou verificar a exclusão |
| **Evidências** | Vídeo: `cypress/videos/register/remover-assinatura.cy.js.mp4`<br>Screenshots: `cypress/screenshots/register/remover-assinatura.cy.js/` |
| **Prioridade** | Média |
| **Severidade** | Média - Impede validação da funcionalidade de exclusão de assinaturas |
| **Informações sobre o Software** | Versão: 1.0.0<br>Ambiente: Cypress 14.5.4 + Electron 130 (headless)<br>URL: http://localhost:8080 |
| **Rastreabilidade** | HU06 - Como usuário, quero remover uma assinatura<br>Teste: `cypress/e2e/register/remover-assinatura.cy.js` |
| **Status** | Aberto |

---

## 📊 Resumo dos Defeitos

| Status | Quantidade | Percentual |
|--------|------------|------------|
| **Aberto** | 6 | 100% |
| **Em Análise** | 0 | 0% |
| **Corrigido** | 0 | 0% |
| **Fechado** | 0 | 0% |
| **Total** | 6 | 100% |

### Por Severidade:
- **Alta**: 3 defeitos (50%)
- **Média**: 3 defeitos (50%)
- **Baixa**: 0 defeitos (0%)

### Por Prioridade:
- **Alta**: 3 defeitos (50%)
- **Média**: 3 defeitos (50%)
- **Baixa**: 0 defeitos (0%)

---

## 🔍 Análise Preliminar

### Possíveis Causas dos Defeitos:
1. **Problemas de Timing**: Testes executando muito rapidamente em modo headless
2. **Seletores Incorretos**: Elementos não sendo encontrados pelos seletores CSS
3. **Estado da Aplicação**: LocalStorage ou estado inicial não configurado adequadamente
4. **Configuração do Cypress**: Timeouts ou configurações inadequadas para o ambiente

### Recomendações:
1. Adicionar waits explícitos nos testes
2. Verificar e ajustar seletores CSS
3. Implementar setup de dados de teste
4. Ajustar configurações de timeout no Cypress
5. Executar testes em modo interativo para debug

---

**📅 Data do Relatório**: 19 de Dezembro de 2024  
**🔄 Última Atualização**: 19 de Dezembro de 2024  
**📋 Versão do Relatório**: 1.0  
**✅ Status**: Ativo - Aguardando Correções