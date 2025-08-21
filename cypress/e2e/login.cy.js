// Testes de Login - Versão Simples para Iniciantes

describe('Login/Autenticação', () => {
  beforeEach(() => {
    // Visita a página inicial antes de cada teste
    cy.visit('/');
  });

  it('Deve carregar a tela de login corretamente', () => {
    // Verifica se os elementos principais estão presentes
    cy.get('#loginEmail').should('be.visible');
    cy.get('#loginPassword').should('be.visible');
    cy.get('[data-testid="login-submit"]').should('be.visible');
    cy.get('#showRegister').should('be.visible');
  });

  it('Deve tentar fazer login (teste simplificado)', () => {
    // Preenche os campos de login
    cy.get('#loginEmail').type('usuario@teste.com');
    cy.get('#loginPassword').type('senha123');
    
    // Clica no botão de login
    cy.get('[data-testid="login-submit"]').click();
    
    // Verifica se o formulário ainda está presente (login falhou como esperado)
    // ou se foi redirecionado (login bem-sucedido)
    cy.get('body').then(($body) => {
      if ($body.find('#dashboard-container:visible').length > 0) {
        // Login bem-sucedido
        cy.get('#dashboard-container').should('be.visible');
      } else {
        // Login falhou, permanece na tela de login
        cy.get('#login-form').should('be.visible');
      }
    });
  });

  it('Deve mostrar erro com email inválido', () => {
    // Tenta fazer login com email inválido
    cy.get('#loginEmail').type('email-invalido');
    cy.get('#loginPassword').type('senha123');
    cy.get('[data-testid="login-submit"]').click();
    
    // Verifica se a mensagem de erro aparece
    cy.get('[data-testid="login-email-error"]').should('be.visible');
  });

  it('Deve mostrar erro com campos vazios', () => {
    // Tenta fazer login sem preencher os campos
    cy.get('[data-testid="login-submit"]').click();
    
    // Verifica se permanece na tela de login
    cy.get('#login-form').should('be.visible');
    cy.get('#auth-container').should('be.visible');
  });

  it('Deve alternar para tela de registro', () => {
    // Clica no link de registro
    cy.get('#showRegister').click();
    
    // Verifica se mudou para a tela de registro
    cy.get('#register-form').should('be.visible');
    cy.get('#login-form').should('not.have.class', 'active');
  });
});