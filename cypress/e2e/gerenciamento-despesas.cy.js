describe('Testes de Gerenciamento de Despesas', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login primeiro
    cy.get('#loginEmail').type('joao@email.com');
    cy.get('#loginPassword').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').click();
    cy.get('#dashboard-container').should('be.visible');
    // Navegar para seção de despesas
    cy.get('[data-section="expenses"]').click();
  });

  it('deve abrir a página de despesas', () => {
    cy.get('#expenses-section').should('be.visible');
    cy.get('#expensesTableBody').should('exist');
  });

  it('deve adicionar despesa', () => {
    cy.get('#addExpenseBtn').should('be.visible').click();
    cy.get('#expenseModal').should('be.visible');
    cy.get('#expenseName').should('be.visible').type('Almoço');
    cy.get('#expenseValue').should('be.visible').type('25.50');
    cy.get('#expenseCategory').should('be.visible').select('Alimentação');
    cy.get('#expenseType').should('be.visible').select('unica');
    cy.get('#expenseDate').should('be.visible').type('2025-02-15');
    cy.get('#saveBtn').should('be.enabled').click();
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain', 'Despesa adicionada com sucesso!');
    cy.get('#expensesTableBody').should('contain', 'Almoço');
  });

  it('deve editar despesa', () => {
    // Primeiro adicionar uma despesa
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Almoço Original');
    cy.get('#expenseValue').type('20.00');
    cy.get('#expenseCategory').select('Alimentação');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-15');
    cy.get('#saveBtn').click();
    
    // Agora editar
    cy.get('.edit-btn').first().should('be.visible').click();
    cy.get('#expenseName').should('be.visible').clear().type('Jantar Editado');
    cy.get('#expenseValue').should('be.visible').clear().type('35.00');
    cy.get('#saveBtn').should('be.enabled').click();
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain', 'Despesa atualizada com sucesso!');
    cy.get('#expensesTableBody').should('contain', 'Jantar Editado');
  });

  it('deve excluir despesa', () => {
    // Primeiro adicionar uma despesa
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Despesa para Excluir');
    cy.get('#expenseValue').type('15.00');
    cy.get('#expenseCategory').select('Outros');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-15');
    cy.get('#saveBtn').click();
    
    // Agora excluir
    cy.get('.delete-btn').first().should('be.visible').click();
    cy.get('#confirmModal').should('be.visible');
    cy.get('#confirmOk').should('be.visible').click();
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain', 'Despesa removida com sucesso!');
  });

  it('deve filtrar por categoria', () => {
    // Adicionar despesas de diferentes categorias
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Supermercado');
    cy.get('#expenseValue').type('100.00');
    cy.get('#expenseCategory').select('Alimentação');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-15');
    cy.get('#saveBtn').click();
    
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Uber');
    cy.get('#expenseValue').type('25.00');
    cy.get('#expenseCategory').select('Transporte');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-15');
    cy.get('#saveBtn').click();
    
    // Filtrar por categoria
    cy.get('#categoryFilter').should('be.visible').select('Alimentação');
    cy.get('#expensesTableBody').should('contain', 'Supermercado');
    cy.get('#expensesTableBody').should('not.contain', 'Uber');
  });

  it('deve validar campos obrigatórios', () => {
    cy.get('#addExpenseBtn').should('be.visible').click();
    cy.get('#saveBtn').should('be.enabled').click();
    cy.get('#expenseNameError').should('contain', 'Nome da despesa é obrigatório.');
    cy.get('#expenseValueError').should('contain', 'Valor deve ser maior que zero.');
    cy.get('#expenseCategoryError').should('contain', 'Categoria é obrigatória.');
    cy.get('#expenseTypeError').should('contain', 'Tipo é obrigatório.');
    cy.get('#expenseDateError').should('contain', 'Data da despesa é obrigatória.');
  });

  it('deve validar valor inválido', () => {
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Teste');
    cy.get('#expenseValue').type('0');
    cy.get('#expenseCategory').select('Outros');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-15');
    cy.get('#saveBtn').click();
    cy.get('#expenseValueError').should('contain', 'Valor deve ser maior que zero.');
  });
});