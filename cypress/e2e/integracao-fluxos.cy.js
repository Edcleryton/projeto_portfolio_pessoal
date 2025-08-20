describe('Testes de Integração e Fluxos', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve fazer login e navegar pelo sistema', () => {
    cy.get('#loginEmail').type('eddie@gerir.me');
    cy.get('#loginPassword').type('Eddie@123');
    cy.get('#loginForm > .btn-primary').click();
    
    cy.get('#dashboard-container').should('be.visible');
    cy.get('#despesasNav').click();
    cy.get('#despesas-container').should('be.visible');
  });

  it('deve completar fluxo de registro e login', () => {
    cy.get('#registerTab').click();
    cy.get('#registerName').type('Novo Usuário');
    cy.get('#registerEmail').type('novo@teste.com');
    cy.get('#registerPassword').type('NovaSenh@123');
    cy.get('#confirmPassword').type('NovaSenh@123');
    cy.get('#registerForm > .btn-primary').click();
    
    cy.get('.toast').should('be.visible');
  });
});