describe('Testes de Dashboard e Cálculos', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login primeiro
    cy.get('#loginEmail').type('joao@email.com');
    cy.get('#loginPassword').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').click();
    cy.get('#dashboard-container').should('be.visible');
    // Navegar para visão geral
    cy.get('[data-section="overview"]').click();
  });

  it('deve abrir a página do dashboard', () => {
    cy.get('#overview-section').should('be.visible');
    cy.get('#overview-section').should('exist');
  });

  it('deve mostrar total mensal', () => {
    cy.get('#monthlyTotal').should('be.visible');
    cy.get('#monthlyTotal').should('contain.text', 'R$');
    cy.get('#monthlyTotal').should('contain.text', '0,00');
  });

  it('deve mostrar despesas recorrentes e únicas', () => {
    cy.get('#recurringTotal').should('be.visible');
    cy.get('#recurringTotal').should('contain.text', 'R$');
    cy.get('#uniqueTotal').should('be.visible');
    cy.get('#uniqueTotal').should('contain.text', 'R$');
  });

  it('deve mostrar próximos pagamentos', () => {
    cy.get('#upcomingPayments').should('be.visible');
    cy.get('#upcomingPayments').should('exist');
    cy.get('#upcomingPayments .empty-state').should('contain', 'Nenhum pagamento próximo');
  });

  it('deve mostrar cards de resumo', () => {
    cy.get('.summary-cards').should('be.visible');
    cy.get('.summary-card').should('have.length', 3);
    cy.get('.summary-card').first().should('contain', 'Gasto Mensal');
    cy.get('.summary-card').eq(1).should('contain', 'Despesas Recorrentes');
    cy.get('.summary-card').eq(2).should('contain', 'Despesas Únicas');
  });

  it('deve navegar entre seções', () => {
    // Testar navegação para despesas
    cy.get('[data-section="expenses"]').should('be.visible').click();
    cy.get('#expenses-section').should('be.visible');
    cy.get('#overview-section').should('not.be.visible');
    
    // Voltar para visão geral
    cy.get('[data-section="overview"]').should('be.visible').click();
    cy.get('#overview-section').should('be.visible');
    cy.get('#expenses-section').should('not.be.visible');
  });

  it('deve mostrar calendário', () => {
    cy.get('[data-section="calendar"]').should('be.visible').click();
    cy.get('#calendar-section').should('be.visible');
    cy.get('#calendarGrid').should('exist');
    cy.get('#currentMonth').should('be.visible');
  });
});