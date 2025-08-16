# Cypress E2E Tests

Este diretório contém os testes end-to-end (E2E) para o projeto de controle de despesas.

## Configuração da Aplicação

### URL Base
- **Aplicação**: http://localhost:8080/
- Configurada em `cypress.config.js` como `baseUrl`

### Credenciais de Teste
- **Email**: email@teste.com
- **Senha**: 123456
- Configuradas nas variáveis de ambiente do Cypress

## Estrutura dos Testes

- `e2e/login/` - Testes de autenticação
- `e2e/register/` - Testes de registro e CRUD de despesas
- `e2e/dashboard/` - Testes de visualização e dashboard

## Como Executar

```bash
# Executar todos os testes
npx cypress run

# Executar testes específicos
npx cypress run --spec "cypress/e2e/login/*.cy.js"

# Abrir interface gráfica
npx cypress open
```

## Comandos Personalizados

- `cy.loginAsTestUser()` - Login rápido com credenciais de teste
- `cy.takeScreenshot()` - Screenshot otimizado

## Configurações

- **Vídeos**: MP4 salvos em `cypress/videos/`
- **Screenshots**: PNG salvos em `cypress/screenshots/`
- **Relatórios**: Gerados automaticamente para defeitos
- **Variáveis de ambiente**: Configuradas em `cypress.config.js`