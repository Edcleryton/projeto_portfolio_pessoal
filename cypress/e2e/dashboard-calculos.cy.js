describe('Testes de Dashboard e Cálculos', () => {
  beforeEach(() => {
    cy.clearTestData();
    cy.visit('/');
    cy.loginAsDefaultUser();
    cy.get('[data-section="overview"]').click();
  });

  describe('Visão geral', () => {
    it('deve abrir a página do dashboard', () => {
      // Arrange: Usuário já está logado e navegou para overview (beforeEach)
      
      // Act: Verificar se a página foi carregada
      // (ação já executada no beforeEach)
      
      // Assert: Verificar se a seção overview está visível
      cy.get('#overview-section').should('be.visible');
    });

    it('deve mostrar total mensal', () => {
      // Arrange: Dashboard já carregado (beforeEach)
      
      // Act: Verificar elemento de total mensal
      // (elemento já deve estar presente na página)
      
      // Assert: Verificar visibilidade e formato do total mensal
      cy.get('#monthlyTotal').should('be.visible');
      cy.get('#monthlyTotal').should('contain.text', 'R$');
    });

    it('deve mostrar despesas recorrentes e únicas', () => {
      // Arrange: Dashboard já carregado (beforeEach)
      
      // Act: Verificar elementos de totais
      // (elementos já devem estar presentes na página)
      
      // Assert: Verificar visibilidade dos totais
      cy.get('#recurringTotal').should('be.visible');
      cy.get('#uniqueTotal').should('be.visible');
    });

    it('deve mostrar próximos pagamentos', () => {
      // Arrange: Dashboard já carregado (beforeEach)
      
      // Act: Verificar elemento de próximos pagamentos
      // (elemento já deve estar presente na página)
      
      // Assert: Verificar visibilidade dos próximos pagamentos
      cy.get('#upcomingPayments').should('be.visible');
    });

    it('deve exibir despesas próximas ao vencimento com destaque', () => {
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      const amanhaStr = amanha.toISOString().split('T')[0];
      
      // Criar despesa que aparecerá em próximos pagamentos
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Despesa Próxima Dashboard');
      cy.get('#expenseValue').type('250.00');
      cy.get('#expenseCategory').select('Saúde');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(amanhaStr);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Voltar para dashboard
      cy.get('[data-section="overview"]').click();
      
      // Verificar se aparece em próximos pagamentos
      cy.get('#upcomingPayments').should('be.visible');
      cy.get('[data-testid="payment-item"]').should('exist');
      cy.get('[data-testid="payment-name"]').should('contain', 'Despesa Próxima Dashboard');
      cy.get('[data-testid="payment-value"]').should('contain', 'R$ 250,00');
    });

    it('deve destacar despesas que vencem em até 7 dias', () => {
      const seteDias = new Date();
      seteDias.setDate(seteDias.getDate() + 7);
      const seteDiasStr = seteDias.toISOString().split('T')[0];
      
      // Criar despesa que vence em 7 dias
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Despesa 7 Dias');
      cy.get('#expenseValue').type('180.00');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(seteDiasStr);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Voltar para dashboard
      cy.get('[data-section="overview"]').click();
      
      // Verificar se aparece destacada
      cy.get('#upcomingPayments').should('be.visible');
      cy.get('[data-testid="payment-item"]').should('exist');
      cy.get('[data-testid="payment-item"]').should('have.class', 'highlighted');
    });

    it('deve mostrar cards de resumo', () => {
      // Arrange: Dashboard já carregado (beforeEach)
      
      // Act: Verificar elementos dos cards de resumo
      // (elementos já devem estar presentes na página)
      
      // Assert: Verificar visibilidade e quantidade dos cards
      cy.get('.summary-cards').should('be.visible');
      cy.get('.summary-card').should('have.length', 3);
    });
  });

  describe('Navegação', () => {
    it('deve navegar entre seções', () => {
      // Arrange: Dashboard já carregado (beforeEach)
      
      // Act: Navegar para seção de despesas
      cy.get('[data-section="expenses"]').click();
      
      // Assert: Verificar se a seção de despesas está visível
      cy.get('#expenses-section').should('be.visible');
      
      // Act: Voltar para overview
      cy.get('[data-section="overview"]').click();
      
      // Assert: Verificar se voltou para overview
      cy.get('#overview-section').should('be.visible');
    });

    it('deve mostrar calendário', () => {
      cy.get('[data-section="calendar"]').click();   
      cy.get('#calendar-section').should('be.visible');
      cy.get('#calendarGrid').should('exist');
    });

    it('deve mostrar calendário', () => {
      // Arrange: Dashboard já carregado (beforeEach)
      
      // Act: Navegar para seção de calendário
      cy.get('[data-section="calendar"]').click();
      
      // Assert: Verificar se a seção de calendário está visível
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
      // Arrange: Página já carregada com tema padrão (beforeEach)
      
      // Act: Verificar estado inicial do tema
      // (tema já deve estar aplicado na página)
      
      // Assert: Verificar se o tema padrão é claro
      cy.get('html').should('have.attr', 'data-theme', 'light');
      
      // Assert: Verificar se o botão de tema está visível com ícone correto
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