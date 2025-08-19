describe('Testes de Integração e Fluxos', () => {
  it('deve abrir a página', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
    cy.get('#auth-container').should('be.visible');
  });

  it('deve fazer cadastro e adicionar despesa', () => {
    cy.visit('/');
    // Cadastro
    cy.get('#showRegister').should('be.visible').click();
    cy.get('#registerName').should('be.visible').type('João Silva');
    cy.get('#registerEmail').should('be.visible').type('joao@email.com');
    cy.get('#registerPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#confirmPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#registerForm > .btn-primary').should('be.enabled').click();
    
    // Verificar toast de sucesso do cadastro
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain', 'Conta criada com sucesso!');
    cy.get('#dashboard-container').should('be.visible');
    
    // Navegar para despesas e adicionar
    cy.get('[data-section="expenses"]').click();
    cy.get('#addExpenseBtn').should('be.visible').click();
    cy.get('#expenseName').should('be.visible').type('Almoço');
    cy.get('#expenseValue').should('be.visible').type('25.50');
    cy.get('#expenseCategory').should('be.visible').select('Alimentação');
    cy.get('#expenseType').should('be.visible').select('unica');
    cy.get('#expenseDate').should('be.visible').type('2025-02-15');
    cy.get('#saveBtn').should('be.enabled').click();
    
    // Verificar toast de sucesso da despesa
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain', 'Despesa adicionada com sucesso!');
    cy.get('#expensesTableBody').should('contain', 'Almoço');
  });

  it('deve fazer login e adicionar múltiplas despesas', () => {
    cy.visit('/');
    // Login
    cy.get('#loginEmail').should('be.visible').type('joao@email.com');
    cy.get('#loginPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').should('be.enabled').click();
    
    // Verificar toast de sucesso do login
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain', 'Login realizado');
    cy.get('#dashboard-container').should('be.visible');
    
    // Navegar para despesas
    cy.get('[data-section="expenses"]').click();
    
    // Primeira despesa
    cy.get('#addExpenseBtn').should('be.visible').click();
    cy.get('#expenseName').should('be.visible').type('Supermercado');
    cy.get('#expenseValue').should('be.visible').type('150.00');
    cy.get('#expenseCategory').should('be.visible').select('Alimentação');
    cy.get('#expenseType').should('be.visible').select('unica');
    cy.get('#expenseDate').should('be.visible').type('2025-02-15');
    cy.get('#saveBtn').should('be.enabled').click();
    cy.get('.toast.success').should('be.visible');
    cy.get('#expensesTableBody').should('contain', 'Supermercado');
    
    // Segunda despesa
    cy.get('#addExpenseBtn').should('be.visible').click();
    cy.get('#expenseName').should('be.visible').type('Gasolina');
    cy.get('#expenseValue').should('be.visible').type('80.00');
    cy.get('#expenseCategory').should('be.visible').select('Transporte');
    cy.get('#expenseType').should('be.visible').select('unica');
    cy.get('#expenseDate').should('be.visible').type('2025-02-15');
    cy.get('#saveBtn').should('be.enabled').click();
    cy.get('.toast.success').should('be.visible');
    cy.get('#expensesTableBody').should('contain', 'Gasolina');
  });

  it('deve editar e excluir despesas', () => {
    cy.visit('/');
    // Login
    cy.get('#loginEmail').should('be.visible').type('joao@email.com');
    cy.get('#loginPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').should('be.enabled').click();
    cy.get('#dashboard-container').should('be.visible');
    
    // Navegar para despesas e adicionar uma despesa primeiro
    cy.get('[data-section="expenses"]').click();
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Despesa Original');
    cy.get('#expenseValue').type('100.00');
    cy.get('#expenseCategory').select('Outros');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-15');
    cy.get('#saveBtn').click();
    
    // Editar despesa
    cy.get('.edit-btn').first().should('be.visible').click();
    cy.get('#expenseName').should('be.visible').clear().type('Despesa Editada');
    cy.get('#expenseValue').should('be.visible').clear().type('200.00');
    cy.get('#saveBtn').should('be.enabled').click();
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain', 'Despesa atualizada com sucesso!');
    cy.get('#expensesTableBody').should('contain', 'Despesa Editada');
    
    // Excluir despesa
    cy.get('.delete-btn').first().should('be.visible').click();
    cy.get('#confirmModal').should('be.visible');
    cy.get('#confirmOk').should('be.visible').click();
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain', 'Despesa removida com sucesso!');
  });

  it('deve filtrar por categoria', () => {
    cy.visit('/');
    // Login
    cy.get('#loginEmail').should('be.visible').type('joao@email.com');
    cy.get('#loginPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').should('be.enabled').click();
    cy.get('#dashboard-container').should('be.visible');
    
    // Navegar para despesas e adicionar despesas de diferentes categorias
    cy.get('[data-section="expenses"]').click();
    
    // Adicionar despesa de alimentação
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Restaurante');
    cy.get('#expenseValue').type('50.00');
    cy.get('#expenseCategory').select('Alimentação');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-15');
    cy.get('#saveBtn').click();
    
    // Adicionar despesa de transporte
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Ônibus');
    cy.get('#expenseValue').type('15.00');
    cy.get('#expenseCategory').select('Transporte');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-15');
    cy.get('#saveBtn').click();
    
    // Filtrar por categoria
    cy.get('#categoryFilter').should('be.visible').select('Alimentação');
    cy.get('#expensesTableBody').should('contain', 'Restaurante');
    cy.get('#expensesTableBody').should('not.contain', 'Ônibus');
  });

  it('deve persistir dados após recarregar página', () => {
    cy.visit('/');
    // Login
    cy.get('#loginEmail').should('be.visible').type('joao@email.com');
    cy.get('#loginPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').should('be.enabled').click();
    cy.get('#dashboard-container').should('be.visible');
    
    // Adicionar uma despesa
    cy.get('[data-section="expenses"]').click();
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Despesa Persistente');
    cy.get('#expenseValue').type('75.00');
    cy.get('#expenseCategory').select('Outros');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2025-02-15');
    cy.get('#saveBtn').click();
    
    // Recarregar página e verificar persistência
    cy.reload();
    cy.get('#dashboard-container').should('be.visible');
    cy.get('[data-section="expenses"]').click();
    cy.get('#expensesTableBody').should('contain', 'Despesa Persistente');
  });





});