// Testes de Gerenciamento de Despesas - Versão Simples para Iniciantes
describe('Testes de Despesas', () => {
  
  // Executa antes de cada teste - faz login primeiro
  beforeEach(() => {
    cy.visit('/'); // Visita a página inicial
    
    // Faz login com usuário padrão
    cy.get('#loginEmail').type('eddie@gerir.me');
    cy.get('#loginPassword').type('Eddie@123');
    cy.get('#loginForm > .btn-primary').click();
    
    // Aguarda o login e vai para a seção de despesas
    cy.get('.toast.success').should('be.visible');
    cy.get('[data-section="expenses"]').click();
  });

  // Teste 1: Verificar se a página de despesas carrega
  it('deve abrir a página de despesas', () => {
    // Verifica se a seção de despesas está visível
    cy.get('#expenses-section').should('be.visible');
    
    // Verifica se a tabela de despesas existe
    cy.get('#expensesTableBody').should('exist');
    
    // Verifica se o botão de adicionar despesa existe
    cy.get('#addExpenseBtn').should('be.visible');
  });

  // Teste 2: Adicionar uma despesa simples
  it('deve adicionar uma nova despesa', () => {
    // Clica no botão para adicionar despesa
    cy.get('#addExpenseBtn').click();
    
    // Verifica se o modal abriu
    cy.get('#expenseModal').should('be.visible');
    
    // Preenche os dados da despesa
    cy.get('#expenseName').type('Almoço no Restaurante');
    cy.get('#expenseValue').type('25.50');
    cy.get('#expenseCategory').select('Alimentação');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-15');
    
    // Salva a despesa
    cy.get('#saveBtn').click();
    
    // Verifica se apareceu mensagem de sucesso
    cy.get('.toast.success').should('be.visible');
  });

  // Teste 3: Adicionar despesa recorrente
  it('deve adicionar uma despesa recorrente', () => {
    // Clica no botão para adicionar despesa
    cy.get('#addExpenseBtn').click();
    
    // Preenche os dados da despesa recorrente
    cy.get('#expenseName').type('Conta de Luz');
    cy.get('#expenseValue').type('120.00');
    cy.get('#expenseCategory').select('Moradia');
    cy.get('#expenseType').select('recurring');
    cy.get('#expenseCycle').select('monthly');
    cy.get('#nextPayment').type('2025-03-05');
    
    // Salva a despesa
    cy.get('#saveExpenseBtn').click();
    
    // Verifica se apareceu mensagem de sucesso
    cy.get('.toast.success').should('be.visible');
  });

  // Teste 4: Editar uma despesa existente
  it('deve editar uma despesa', () => {
    // Primeiro adiciona uma despesa para editar
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Despesa Original');
    cy.get('#expenseValue').type('50.00');
    cy.get('#expenseCategory').select('Transporte');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-20');
    cy.get('#saveBtn').click();
    cy.get('.toast.success').should('be.visible');
    
    // Agora edita a despesa
    cy.get('.edit-btn').first().click();
    
    // Modifica os dados
    cy.get('#expenseName').clear().type('Despesa Editada');
    cy.get('#expenseValue').clear().type('75.00');
    
    // Salva as alterações
    cy.get('#saveBtn').click();
    
    // Verifica se apareceu mensagem de sucesso
    cy.get('.toast.success').should('be.visible');
  });

  // Teste 5: Excluir uma despesa
  it('deve excluir uma despesa', () => {
    // Primeiro adiciona uma despesa para excluir
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Despesa para Excluir');
    cy.get('#expenseValue').type('30.00');
    cy.get('#expenseCategory').select('Lazer');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-25');
    cy.get('#saveBtn').click();
    cy.get('.toast.success').should('be.visible');
    
    // Clica no botão de excluir
    cy.get('.delete-btn').first().click();
    
    // Confirma a exclusão no modal de confirmação
    cy.get('#confirmBtn').click();
    
    // Verifica se apareceu mensagem de sucesso
    cy.get('.toast.success').should('be.visible');
  });

  // Teste 6: Filtrar despesas por categoria
  it('deve filtrar despesas por categoria', () => {
    // Adiciona algumas despesas de categorias diferentes
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Supermercado');
    cy.get('#expenseValue').type('150.00');
    cy.get('#expenseCategory').select('Alimentação');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-10');
    cy.get('#saveBtn').click();
    cy.get('.toast.success').should('be.visible');
    
    // Testa o filtro por categoria
    cy.get('#categoryFilter').select('Alimentação');
    
    // Verifica se a tabela foi filtrada
    cy.get('#expensesTableBody tr').should('contain', 'Supermercado');
  });
});