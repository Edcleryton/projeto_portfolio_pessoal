// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando para criar usuário padrão para testes
Cypress.Commands.add('createDefaultUser', () => {
  cy.window().then((win) => {
    const users = JSON.parse(win.localStorage.getItem('gerirme_users') || '[]');
    const defaultUser = {
      id: 'default-test-user',
      nome: 'Usuário Teste',
      email: 'teste@email.com',
      senha: 'senha123'
    };
    
    const userExists = users.some(user => user.email === defaultUser.email);
    if (!userExists) {
      users.push(defaultUser);
      win.localStorage.setItem('gerirme_users', JSON.stringify(users));
    }
  });
});

// Comando para fazer login como usuário padrão
Cypress.Commands.add('loginAsDefaultUser', () => {
  cy.createDefaultUser();
  cy.get('#loginEmail').type('teste@email.com');
  cy.get('#loginPassword').type('senha123');
  cy.get('#loginForm > .btn-primary').click();
  cy.get('.toast.success').should('be.visible');
});

// Comando para limpar dados de teste
Cypress.Commands.add('clearTestData', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('gerirme_users');
    win.localStorage.removeItem('gerirme_currentUser');
    win.localStorage.removeItem('gerirme_expenses');
    win.localStorage.removeItem('gerirme_theme');
  });
});

// Comando para definir tema
Cypress.Commands.add('setTheme', (theme) => {
  cy.window().then((win) => {
    win.localStorage.setItem('gerirme_theme', theme);
  });
});

// Comando para resetar tentativas de login
Cypress.Commands.add('resetLoginAttempts', () => {
  cy.task('resetLoginAttempts');
});

// Comando para simular bloqueio de conta
Cypress.Commands.add('simulateAccountBlock', (email, minutesRemaining = 15) => {
  cy.task('simulateAccountBlock', { email, minutesRemaining });
});

// Comando para obter tentativas de login
Cypress.Commands.add('getLoginAttempts', (email) => {
  return cy.task('getLoginAttempts', email);
});

// Comando para resetar notificações
Cypress.Commands.add('resetNotifications', () => {
  cy.task('resetNotifications');
});

// Comando para simular permissão de notificação
Cypress.Commands.add('mockNotificationPermission', (permission) => {
  cy.task('mockNotificationPermission', permission);
});

// Comando para verificar se notificação foi enviada
Cypress.Commands.add('checkNotificationSent', (title) => {
  return cy.task('checkNotificationSent', title);
});

// Comando para adicionar mock de notificação
Cypress.Commands.add('addNotificationMock', (notification) => {
  cy.task('addNotificationMock', notification);
});

// Comando para obter estado da aplicação
Cypress.Commands.add('getAppState', () => {
  return cy.task('getAppState');
});

// Comando para resetar estado da aplicação
Cypress.Commands.add('resetAppState', () => {
  cy.task('resetAppState');
});

// Comando para disparar verificação de notificações
Cypress.Commands.add('triggerNotificationCheck', () => {
  cy.task('triggerNotificationCheck');
});

// Comando para aguardar elemento estar visível
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible');
});

// Comando para aguardar e clicar
Cypress.Commands.add('waitAndClick', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible').click();
});

// Comando para aguardar e digitar
Cypress.Commands.add('waitAndType', (selector, text, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible').clear().type(text);
});