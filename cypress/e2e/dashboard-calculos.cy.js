// Testes de Dashboard - Versão Simples para Iniciantes
describe('Testes do Dashboard', () => {
  
  // Executa antes de cada teste - faz login primeiro
  beforeEach(() => {
    cy.visit('/'); // Visita a página inicial
    
    // Faz login com usuário padrão
    cy.get('#loginEmail').type('eddie@gerir.me');
    cy.get('#loginPassword').type('Eddie@123');
    cy.get('#loginForm > .btn-primary').click();
    
    // Aguarda o login e vai para a visão geral
    cy.get('.toast.success').should('be.visible');
    cy.get('[data-section="overview"]').click();
  });

  // Teste 1: Verificar se o dashboard carrega
  it('deve abrir a página do dashboard', () => {
    // Verifica se a seção de visão geral está visível
    cy.get('#overview-section').should('be.visible');
    
    // Verifica se o título está presente
    cy.get('h2').should('contain.text', 'Visão Geral');
  });

  // Teste 2: Verificar cards de resumo
  it('deve mostrar os cards de resumo financeiro', () => {
    // Verifica se o card de gasto mensal existe
    cy.get('#monthlyTotal').should('be.visible');
    cy.get('#monthlyTotal').should('contain.text', 'R$');
    
    // Verifica se o card de despesas recorrentes existe
    cy.get('#recurringTotal').should('be.visible');
    cy.get('#recurringTotal').should('contain.text', 'R$');
    
    // Verifica se o card de despesas únicas existe
    cy.get('#uniqueTotal').should('be.visible');
    cy.get('#uniqueTotal').should('contain.text', 'R$');
  });

  // Teste 3: Verificar seção de próximos pagamentos
  it('deve mostrar a seção de próximos pagamentos', () => {
    // Verifica se a seção de próximos pagamentos existe
    cy.get('#upcomingPayments').should('be.visible');
    
    // Verifica se tem o título da seção
    cy.get('#upcomingPayments h3').should('contain.text', 'Próximos Pagamentos');
  });

  // Teste 4: Navegação entre seções
  it('deve navegar entre as diferentes seções', () => {
    // Testa navegação para despesas
    cy.get('[data-section="expenses"]').click();
    cy.get('#expenses-section').should('be.visible');
    
    // Volta para visão geral
    cy.get('[data-section="overview"]').click();
    cy.get('#overview-section').should('be.visible');
    
    // Testa navegação para calendário
    cy.get('[data-section="calendar"]').click();
    cy.get('#calendar-section').should('be.visible');
  });

  // Teste 5: Verificar funcionalidade do menu do usuário
  it('deve abrir e fechar o menu do usuário', () => {
    // Clica no botão do menu do usuário
    cy.get('#userMenuBtn').click();
    
    // Verifica se o menu apareceu
    cy.get('#userMenu').should('be.visible');
    
    // Verifica se tem a opção de logout
    cy.get('#logoutBtn').should('be.visible');
    
    // Clica fora para fechar o menu
    cy.get('body').click(0, 0);
    
    // Verifica se o menu fechou
    cy.get('#userMenu').should('not.be.visible');
  });

  // Teste 6: Verificar alternância de tema
  it('deve alternar entre tema claro e escuro', () => {
    // Clica no botão de alternar tema
    cy.get('#themeToggle').click();
    
    // Verifica se o tema mudou (verifica se o body tem a classe dark)
    cy.get('body').should('have.class', 'dark-theme');
    
    // Clica novamente para voltar ao tema claro
    cy.get('#themeToggle').click();
    
    // Verifica se voltou ao tema claro
    cy.get('body').should('not.have.class', 'dark-theme');
  });

  // Teste 7: Verificar se os valores são atualizados após adicionar despesa
  it('deve atualizar valores do dashboard após adicionar despesa', () => {
    // Anota o valor atual do gasto mensal
    cy.get('#monthlyTotal').invoke('text').as('valorInicial');
    
    // Vai para a seção de despesas
    cy.get('[data-section="expenses"]').click();
    
    // Adiciona uma nova despesa
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Teste Dashboard');
    cy.get('#expenseValue').type('100.00');
    cy.get('#expenseCategory').select('Outros');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-15');
    cy.get('#saveBtn').click();
    cy.get('.toast.success').should('be.visible');
    
    // Volta para o dashboard
    cy.get('[data-section="overview"]').click();
    
    // Verifica se o valor foi atualizado
    cy.get('#monthlyTotal').should('be.visible');
    cy.get('#monthlyTotal').should('contain.text', 'R$');
  });

  // Teste 8: Verificar logout
  it('deve fazer logout corretamente', () => {
    // Abre o menu do usuário
    cy.get('#userMenuBtn').click();
    
    // Clica em logout
    cy.get('#logoutBtn').click();
    
    // Verifica se voltou para a tela de login
    cy.get('#loginForm').should('be.visible');
    
    // Verifica se não está mais logado
    cy.get('#dashboard').should('not.exist');
  });
});