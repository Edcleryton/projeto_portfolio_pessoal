describe('Testes de Gerenciamento de Despesas', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.fixture('credenciais').then(credenciais =>{
      cy.get('#loginEmail').type(credenciais.validas.usuario);
      cy.get('#loginPassword').type(credenciais.validas.senha);
    });
    cy.get('#loginForm > .btn-primary').click();
    cy.get('[data-section="expenses"]').click();
  });

  describe('Funcionalidades básicas', () => {
    it('deve abrir a página de despesas', () => {
      cy.get('#expenses-section').should('be.visible');
      cy.get('#expensesTableBody').should('exist');
    });

    it('deve adicionar despesa', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Almoço');
      cy.get('#expenseValue').type('25.50');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-02-15');
      cy.get('#saveBtn').click();
      cy.get('.toast.success').should('be.visible');
      cy.get('#expensesTableBody').should('contain', 'Almoço');
    });

    it('deve editar despesa', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Almoço Original');
      cy.get('#expenseValue').type('20.00');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-02-15');
      cy.get('#saveBtn').click();
      
      cy.get('.edit-btn').first().click();
      cy.get('#expenseName').clear().type('Jantar Editado');
      cy.get('#expenseValue').clear().type('35.00');
      cy.get('#saveBtn').click();
      cy.get('.toast.success').should('be.visible');
      cy.get('#expensesTableBody').should('contain', 'Jantar Editado');
    });

    it('deve excluir despesa', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa para Excluir');
      cy.get('#expenseValue').type('15.00');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-02-15');
      cy.get('#saveBtn').click();
      
      cy.get('.delete-btn').first().click();
      cy.get('#confirmOk').click();
      cy.get('.toast.success').should('be.visible');
    });

    it('deve filtrar por categoria', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Supermercado');
      cy.get('#expenseValue').type('100.00');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-02-15');
      cy.get('#saveBtn').click();
      
      cy.get('#categoryFilter').select('Alimentação');
      cy.get('#expensesTableBody').should('contain', 'Supermercado');
    });
  });

  describe('Validações', () => {
    it('deve validar campos obrigatórios', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#saveBtn').click();
      cy.get('#expenseNameError').should('contain', 'Nome da despesa é obrigatório.');
      cy.get('#expenseValueError').should('contain', 'Valor deve ser maior que zero.');
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
});