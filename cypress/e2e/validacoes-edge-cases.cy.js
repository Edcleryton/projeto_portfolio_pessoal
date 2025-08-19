describe('Validações e Edge Cases', () => {
  it('deve abrir a página', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
    cy.get('#auth-container').should('be.visible');
  });

  it('deve validar campos obrigatórios no cadastro', () => {
    cy.visit('/');
    cy.get('#showRegister').click();
    cy.get('#registerForm > .btn-primary').click();
    
    // Verificar mensagens de erro para campos obrigatórios
    cy.get('.toast.error').should('be.visible');
    cy.get('.toast-title').should('contain', 'Nome é obrigatório');
  });

  it('deve validar email inválido no cadastro', () => {
    cy.visit('/');
    cy.get('#showRegister').click();
    cy.get('#registerName').type('João Silva');
    cy.get('#registerEmail').type('email-invalido');
    cy.get('#registerPassword').type('MinhaSenh@123');
    cy.get('#confirmPassword').type('MinhaSenh@123');
    cy.get('#registerForm > .btn-primary').click();
    
    cy.get('.toast.error').should('be.visible');
    cy.get('.toast-title').should('contain', 'Email inválido');
  });

  it('deve validar senhas que não coincidem', () => {
    cy.visit('/');
    cy.get('#showRegister').click();
    cy.get('#registerName').type('João Silva');
    cy.get('#registerEmail').type('joao@email.com');
    cy.get('#registerPassword').type('MinhaSenh@123');
    cy.get('#confirmPassword').type('SenhasDiferentes');
    cy.get('#registerForm > .btn-primary').click();
    
    cy.get('.toast.error').should('be.visible');
    cy.get('.toast-title').should('contain', 'Senhas não coincidem');
  });

  it('deve validar campos obrigatórios na despesa', () => {
    cy.visit('/');
    // Login primeiro
    cy.get('#loginEmail').type('joao@email.com');
    cy.get('#loginPassword').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').click();
    
    // Navegar para despesas e tentar salvar sem preencher
    cy.get('[data-section="expenses"]').click();
    cy.get('#addExpenseBtn').click();
    cy.get('#saveBtn').click();
    
    cy.get('.toast.error').should('be.visible');
    cy.get('.toast-title').should('contain', 'Nome da despesa é obrigatório.');
  });

  it('deve validar valor inválido na despesa', () => {
    cy.visit('/');
    // Login primeiro
    cy.get('#loginEmail').type('joao@email.com');
    cy.get('#loginPassword').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').click();
    
    // Navegar para despesas e inserir valor inválido
    cy.get('[data-section="expenses"]').click();
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Teste');
    cy.get('#expenseValue').type('0');
    cy.get('#saveBtn').click();
    
    cy.get('.toast.error').should('be.visible');
    cy.get('.toast-title').should('contain', 'Valor deve ser maior que zero.');
  });

  it('deve validar data no passado', () => {
    cy.visit('/');
    // Login primeiro
    cy.get('#loginEmail').type('joao@email.com');
    cy.get('#loginPassword').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').click();
    
    // Navegar para despesas e inserir data no passado
    cy.get('[data-section="expenses"]').click();
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Despesa Passado');
    cy.get('#expenseValue').type('100.00');
    cy.get('#expenseCategory').select('Outros');
    cy.get('#expenseType').select('unica');
    cy.get('#expenseDate').type('2020-01-01');
    cy.get('#saveBtn').click();
    
    cy.get('.toast.error').should('be.visible');
    cy.get('.toast-title').should('contain', 'Data não pode ser no passado.');
  });

  it('deve validar despesa recorrente sem próxima data', () => {
    cy.visit('/');
    // Login primeiro
    cy.get('#loginEmail').type('joao@email.com');
    cy.get('#loginPassword').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').click();
    
    // Navegar para despesas e criar despesa recorrente sem próxima data
    cy.get('[data-section="expenses"]').click();
    cy.get('#addExpenseBtn').click();
    cy.get('#expenseName').type('Despesa Recorrente');
    cy.get('#expenseValue').type('100.00');
    cy.get('#expenseCategory').select('Outros');
    cy.get('#expenseType').select('recorrente');
    cy.get('#expenseDate').type('2025-02-15');
    // Não preencher próxima data de cobrança
    cy.get('#saveBtn').click();
    
    cy.get('.toast.error').should('be.visible');
    cy.get('.toast-title').should('contain', 'Próxima data de cobrança é obrigatória.');
  });
});