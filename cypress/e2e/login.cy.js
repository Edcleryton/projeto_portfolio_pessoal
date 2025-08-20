describe('Testes de Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve fazer login com sucesso', () => {
    cy.fixture('credenciais').then(credenciais =>{
      cy.get('#loginEmail').type(credenciais.validas.usuario);
      cy.get('#loginPassword').type(credenciais.validas.senha);
      })

    cy.get('#loginForm > .btn-primary').click();
    cy.get('.toast').should('be.visible');
    cy.get('.toast-title').should('contain.text', 'Login realizado'); 
    });

  it('fazer login com credenciais inválidas', () => {
    cy.fixture('credenciais').then(credenciais =>{
      cy.get('#loginEmail').type(credenciais.invalidas.usuario);
      cy.get('#loginPassword').type(credenciais.invalidas.senha);
      })
    cy.get('#loginForm > .btn-primary').click();
    cy.get('.toast').should('be.visible');
    cy.get('.toast-title').should('contain.text', 'Login inválido'); 
  });
it('fazer login com campo de email vazio', () => {
  cy.get('#loginEmail').type('');
  cy.get('#loginPassword').type('Eddie@123');
  cy.get('#loginForm > .btn-primary').click();
  cy.get('.toast').should('be.visible');
  cy.get('.toast-title').should('contain.text', 'Login inválido'); 
});

it('fazer login com campo de senha vazio', () => {
  cy.get('#loginEmail').type('Eddie@email.com');
  cy.get('#loginPassword').type('');
  cy.get('#loginForm > .btn-primary').click();
  cy.get('.toast').should('be.visible');
  cy.get('.toast-title').should('contain.text', 'Login inválido'); 
});
});