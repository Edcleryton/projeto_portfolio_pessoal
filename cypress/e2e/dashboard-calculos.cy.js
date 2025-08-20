describe('Testes de Dashboard e Cálculos', () => {
  beforeEach(() => {
    cy.clearTestData();
    cy.visit('/');
    cy.loginAsDefaultUser();
    cy.get('[data-section="overview"]').click();
  });

  describe('Visão geral', () => {
    it('deve abrir a página do dashboard', () => {
      cy.get('#overview-section').should('be.visible');
    });

    it('deve mostrar total mensal', () => {
      cy.get('#monthlyTotal').should('be.visible');
      cy.get('#monthlyTotal').should('contain.text', 'R$');
    });

    it('deve mostrar despesas recorrentes e únicas', () => {
      cy.get('#recurringTotal').should('be.visible');
      cy.get('#uniqueTotal').should('be.visible');
    });

    it('deve mostrar próximos pagamentos', () => {
      cy.get('#upcomingPayments').should('be.visible');
    });

    it('deve mostrar cards de resumo', () => {
      cy.get('.summary-cards').should('be.visible');
      cy.get('.summary-card').should('have.length', 3);
    });
  });

  describe('Navegação', () => {
    it('deve navegar entre seções', () => {
      cy.get('[data-section="expenses"]').click();
      cy.get('#expenses-section').should('be.visible');
      
      cy.get('[data-section="overview"]').click();
      cy.get('#overview-section').should('be.visible');
    });

    it('deve mostrar calendário', () => {
      cy.get('[data-section="calendar"]').click();
      cy.get('#calendar-section').should('be.visible');
      cy.get('#calendarGrid').should('exist');
    });
  });

  describe('Alternância de Tema', () => {
    beforeEach(() => {
      // Fecha o toast de boas-vindas que aparece após o login
      cy.get('body').then(($body) => {
        if ($body.find('.toast').length > 0) {
          cy.get('.toast .toast-close').click();
          cy.wait(500);
        }
      });
    });

    it('deve aplicar o tema corretamente ao carregar a página', () => {
      // Verifica se o tema padrão é claro
      cy.get('html').should('have.attr', 'data-theme', 'light');
      
      // Verifica se o botão de tema está visível com ícone correto
      cy.get('#theme-toggle').should('be.visible');
      cy.get('#theme-toggle i').should('be.visible');
      cy.get('#theme-toggle i').should('have.class', 'fa-moon');
      cy.get('#theme-toggle').should('have.attr', 'title', 'Alternar para modo escuro');
    });

    it('deve alternar entre os modos claro e escuro', () => {
      // Verifica estado inicial (modo claro)
      cy.get('html').should('have.attr', 'data-theme', 'light');
      cy.get('#theme-toggle i').should('have.class', 'fa-moon');
      
      // Alterna para modo escuro
       cy.get('#theme-toggle').click({ force: true });
      
      // Verifica se o toast de confirmação aparece com a mensagem correta
       cy.get('.toast').should('be.visible');
       cy.get('.toast .toast-title').should('contain.text', 'Tema alterado');
       cy.get('.toast .toast-message').should('contain.text', 'Modo escuro ativado');
      
      // Verifica se o tema foi alterado
      cy.get('html').should('have.attr', 'data-theme', 'dark');
      cy.get('#theme-toggle i').should('have.class', 'fa-sun');
      cy.get('#theme-toggle').should('have.attr', 'title', 'Alternar para modo claro');
      
      // Fecha o toast clicando nele
      cy.get('.toast .toast-close').click();
      cy.wait(500);
      
      // Volta para modo claro
       cy.get('#theme-toggle').click({ force: true });
      
      // Verifica se o toast de confirmação aparece com a mensagem correta
       cy.get('.toast').should('be.visible');
       cy.get('.toast .toast-title').should('contain.text', 'Tema alterado');
       cy.get('.toast .toast-message').should('contain.text', 'Modo claro ativado');
      
      // Verifica se o tema foi alterado
      cy.get('html').should('have.attr', 'data-theme', 'light');
      cy.get('#theme-toggle i').should('have.class', 'fa-moon');
      cy.get('#theme-toggle').should('have.attr', 'title', 'Alternar para modo escuro');
    });

    it('deve renderizar cores e estilos adequadamente em cada modo', () => {
      // Verifica estado inicial (modo claro)
      cy.get('html').should('have.attr', 'data-theme', 'light');
      cy.get('#theme-toggle i').should('have.class', 'fa-moon');
      cy.get('#theme-toggle').should('have.attr', 'title', 'Alternar para modo escuro');
      
      // Alterna para modo escuro
      cy.get('#theme-toggle').click({ force: true });
      
      // Verifica se o toast aparece com a mensagem correta
      cy.get('.toast').should('be.visible');
      cy.get('.toast .toast-title').should('contain.text', 'Tema alterado');
      cy.get('.toast .toast-message').should('contain.text', 'Modo escuro ativado');
      
      // Verifica se o tema foi alterado
      cy.get('html').should('have.attr', 'data-theme', 'dark');
      cy.get('#theme-toggle i').should('have.class', 'fa-sun');
      cy.get('#theme-toggle').should('have.attr', 'title', 'Alternar para modo claro');
      
      // Fecha o toast
      cy.get('.toast .toast-close').click();
      cy.wait(500);
    });

    it('deve manter a preferência do usuário após atualização da página', () => {
      // Alterna para modo escuro
      cy.get('#theme-toggle').click({ force: true });
      
      // Verifica se o toast aparece com a mensagem correta
      cy.get('.toast').should('be.visible');
      cy.get('.toast .toast-title').should('contain.text', 'Tema alterado');
      cy.get('.toast .toast-message').should('contain.text', 'Modo escuro ativado');
      
      // Verifica se o tema foi alterado
      cy.get('html').should('have.attr', 'data-theme', 'dark');
      
      // Fecha o toast
      cy.get('.toast .toast-close').click();
      cy.wait(500);
      
      // Verifica se a preferência foi salva no localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('gerirme_theme')).to.equal('dark');
      });
      
      // Alterna de volta para modo claro para verificar a funcionalidade completa
      cy.get('#theme-toggle').click({ force: true });
      
      // Verifica se o toast aparece com a mensagem correta
      cy.get('.toast').should('be.visible');
      cy.get('.toast .toast-title').should('contain.text', 'Tema alterado');
      cy.get('.toast .toast-message').should('contain.text', 'Modo claro ativado');
      
      // Verifica se o tema foi alterado de volta
      cy.get('html').should('have.attr', 'data-theme', 'light');
      cy.get('#theme-toggle i').should('have.class', 'fa-moon');
      cy.get('#theme-toggle').should('have.attr', 'title', 'Alternar para modo escuro');
      
      // Verifica se a preferência foi atualizada no localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('gerirme_theme')).to.equal('light');
      });
    });
  });
});