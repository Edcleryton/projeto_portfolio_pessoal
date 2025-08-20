describe('Testes de Navegação', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.fixture('credenciais').then(credenciais =>{
      cy.get('#loginEmail').type(credenciais.validas.usuario);
      cy.get('#loginPassword').type(credenciais.validas.senha);
      })
  });

    //deve mostrar a página de visão geral
    cy.get('#overview-section').should('be.visible');
    cy.get('.toast-close > .fas').click();
    cy.contains('Visão Geral').should('contain.text', 'Visão Geral');





  });

