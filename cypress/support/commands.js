// ***********************************************
// Custom commands for Gerir.me tests
// ***********************************************

// Comando para criar usuário padrão no localStorage
Cypress.Commands.add('createDefaultUser', () => {
  cy.window().then((win) => {
    const defaultUser = {
      id: "1642123456789",
      name: "Edcleryton Silva",
      email: "eddie@gerir.me",
      password: "Eddie@123",
      createdAt: new Date().toISOString()
    };
    
    // Criar array de usuários se não existir
    const existingUsers = JSON.parse(win.localStorage.getItem('gerirme_users') || '[]');
    
    // Verificar se o usuário já existe
    const userExists = existingUsers.some(user => user.email === defaultUser.email);
    
    if (!userExists) {
      existingUsers.push(defaultUser);
      win.localStorage.setItem('gerirme_users', JSON.stringify(existingUsers));
    }
  });
});

// Comando para fazer login com usuário padrão
Cypress.Commands.add('loginAsDefaultUser', () => {
  cy.createDefaultUser();
  cy.get('#loginEmail').type('eddie@gerir.me');
  cy.get('#loginPassword').type('Eddie@123');
  cy.get('#loginForm > .btn-primary').click();
  cy.get('.toast.success').should('be.visible');
});

// Comando para limpar dados de teste
Cypress.Commands.add('clearTestData', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('gerirme_users');
    win.localStorage.removeItem('gerirme_current_user');
    win.localStorage.removeItem('gerirme_expenses_1642123456789');
  });
});