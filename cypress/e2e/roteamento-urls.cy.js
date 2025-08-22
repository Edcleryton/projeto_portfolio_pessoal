describe('Testes de Roteamento e URLs', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve carregar a página inicial', () => {
    cy.url().should('include', '/');
    cy.get('body').should('exist');
  });

  it('deve exibir o formulário de login por padrão', () => {
    cy.get('#auth-container').should('be.visible');
    cy.get('#loginForm').should('be.visible');
    cy.get('#registerForm').should('not.be.visible');
  });

  it('deve alternar para o formulário de registro', () => {
    cy.get('#showRegister').click();
    cy.get('#registerForm').should('be.visible');
    cy.get('#loginForm').should('not.be.visible');
  });

  it('deve simular login e mostrar dashboard', () => {
    // Simular usuário logado via localStorage
    cy.window().then((win) => {
      const mockUser = {
        id: '1',
        name: 'Eddie Test',
        email: 'eddie@gerir.me'
      };
      
      win.localStorage.setItem('currentUser', JSON.stringify(mockUser));
      win.localStorage.setItem('authToken', 'mock-token');
      
      // Simular o login programaticamente
      win.eval(`
        if (window.app) {
          window.app.currentUser = ${JSON.stringify(mockUser)};
          window.app.showDashboard();
        }
      `);
    });
    
    // Verificar se o dashboard está visível
    cy.get('#dashboard-container').should('be.visible');
    cy.get('#auth-container').should('not.be.visible');
  });

  it('deve navegar entre seções do dashboard simulado', () => {
    // Simular usuário logado
    cy.window().then((win) => {
      const mockUser = {
        id: '1',
        name: 'Eddie Test',
        email: 'eddie@gerir.me'
      };
      
      win.localStorage.setItem('currentUser', JSON.stringify(mockUser));
      win.localStorage.setItem('authToken', 'mock-token');
      
      // Simular o login programaticamente
      win.eval(`
        if (window.app) {
          window.app.currentUser = ${JSON.stringify(mockUser)};
          window.app.showDashboard();
        }
      `);
    });
    
    // Aguardar o dashboard aparecer
    cy.get('#dashboard-container').should('be.visible');
    
    // Navegar para despesas
    cy.get('[data-section="expenses"]').should('be.visible').click();
    cy.get('#expenses-section').should('have.class', 'active');
    
    // Navegar para calendário
    cy.get('[data-section="calendar"]').should('be.visible').click();
    cy.get('#calendar-section').should('have.class', 'active');
  });
});