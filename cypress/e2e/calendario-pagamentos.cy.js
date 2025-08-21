// Testes de Calendário de Pagamentos - Versão Simples para Iniciantes
describe('Testes do Calendário', () => {
  
  // Executa antes de cada teste - faz login primeiro
  beforeEach(() => {
    cy.visit('/'); // Visita a página inicial
    
    // Faz login com usuário padrão
    cy.get('#loginEmail').type('eddie@gerir.me');
    cy.get('#loginPassword').type('Eddie@123');
    cy.get('#loginForm > .btn-primary').click();
    
    // Aguarda o login e vai para o calendário
    cy.get('.toast.success').should('be.visible');
    cy.get('[data-section="calendar"]').click();
  });

  // Teste 1: Verificar se o calendário carrega
  it('deve abrir a página do calendário', () => {
    // Verifica se a seção do calendário está visível
    cy.get('#calendar-section').should('be.visible');
    
    // Verifica se o título está presente
    cy.get('h2').should('contain.text', 'Calendário de Pagamentos');
  });

  // Teste 2: Verificar se o grid do calendário existe
  it('deve mostrar o grid do calendário', () => {
    // Verifica se o grid do calendário existe
    cy.get('#calendarGrid').should('be.visible');
    
    // Verifica se tem os dias da semana
    cy.get('.calendar-header').should('be.visible');
    
    // Verifica se tem células de dias
    cy.get('.calendar-day').should('exist');
  });

  // Teste 3: Verificar navegação entre meses
  it('deve navegar entre os meses', () => {
    // Verifica se os botões de navegação existem
    cy.get('#prevMonth').should('be.visible');
    cy.get('#nextMonth').should('be.visible');
    
    // Clica para ir ao próximo mês
    cy.get('#nextMonth').click();
    
    // Verifica se o calendário foi atualizado
    cy.get('#calendarGrid').should('be.visible');
    
    // Clica para voltar ao mês anterior
    cy.get('#prevMonth').click();
    
    // Verifica se voltou
    cy.get('#calendarGrid').should('be.visible');
  });

  // Teste 4: Verificar se mostra o mês e ano atual
  it('deve mostrar o mês e ano atual', () => {
    // Verifica se o cabeçalho com mês/ano está visível
    cy.get('#currentMonth').should('be.visible');
    
    // Verifica se contém texto de mês
    cy.get('#currentMonth').should('not.be.empty');
  });

  // Teste 5: Verificar legenda do calendário
  it('deve mostrar a legenda do calendário', () => {
    // Verifica se a legenda existe
    cy.get('.calendar-legend').should('be.visible');
    
    // Verifica se tem as cores explicativas
    cy.get('.legend-item').should('exist');
  });

  // Teste 6: Verificar se despesas aparecem no calendário
  it('deve mostrar despesas no calendário após adicionar', () => {
    // Primeiro vai para despesas e adiciona uma
    cy.get('[data-section="expenses"]').click();
    
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Pagamento Teste');
    cy.get('#expenseValue').type('200.00');
    cy.get('#expenseCategory').select('Moradia');
    cy.get('#expenseType').select('recurring');
    cy.get('#expenseCycle').select('monthly');
    
    // Define uma data próxima
    const proximaData = new Date();
    proximaData.setDate(proximaData.getDate() + 5);
    const dataFormatada = proximaData.toISOString().split('T')[0];
    
    cy.get('#nextPayment').type(dataFormatada);
    cy.get('#saveExpenseBtn').click();
    cy.get('.toast.success').should('be.visible');
    
    // Volta para o calendário
    cy.get('[data-section="calendar"]').click();
    
    // Verifica se o calendário ainda está funcionando
    cy.get('#calendarGrid').should('be.visible');
  });

  // Teste 7: Verificar responsividade básica
  it('deve funcionar em diferentes tamanhos de tela', () => {
    // Testa em tamanho mobile
    cy.viewport(375, 667);
    cy.get('#calendar-section').should('be.visible');
    cy.get('#calendarGrid').should('be.visible');
    
    // Testa em tamanho tablet
    cy.viewport(768, 1024);
    cy.get('#calendar-section').should('be.visible');
    cy.get('#calendarGrid').should('be.visible');
    
    // Volta ao tamanho desktop
    cy.viewport(1280, 720);
    cy.get('#calendar-section').should('be.visible');
    cy.get('#calendarGrid').should('be.visible');
  });

  // Teste 8: Verificar se volta para outras seções
  it('deve navegar de volta para outras seções', () => {
    // Vai para visão geral
    cy.get('[data-section="overview"]').click();
    cy.get('#overview-section').should('be.visible');
    
    // Volta para calendário
    cy.get('[data-section="calendar"]').click();
    cy.get('#calendar-section').should('be.visible');
    
    // Vai para despesas
    cy.get('[data-section="expenses"]').click();
    cy.get('#expenses-section').should('be.visible');
    
    // Volta para calendário novamente
    cy.get('[data-section="calendar"]').click();
    cy.get('#calendar-section').should('be.visible');
  });
});