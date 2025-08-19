describe('Testes - Gerenciamento de Despesas', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // Login rápido
    const email = 'usuario@teste.com';
    const senha = 'Teste123';
    
    cy.get('#showRegister').click();
    cy.get('#registerName').type('Usuario Teste');
    cy.get('#registerEmail').type(email);
    cy.get('#registerPassword').type(senha);
    cy.get('#registerForm > .btn-primary').click();
    
    cy.wait(2000);
  });

  describe('Adicionar Despesas', () => {
    it('Deve adicionar despesa única', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Supermercado');
      cy.get('#expenseValue').type('150.50');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Supermercado');
      cy.get('#expenseList').should('contain', 'R$ 150,50');
    });

    it('Deve adicionar despesa recorrente', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Aluguel');
      cy.get('#expenseValue').type('1200');
      cy.get('#expenseCategory').select('Moradia');
      cy.get('#expenseType').select('recorrente');
      cy.get('#expenseCycle').select('mensal');
      cy.get('#expenseNextDate').type('2025-02-05');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Aluguel');
      cy.get('#expenseList').should('contain', 'R$ 1.200,00');
    });

    it('Deve validar campos obrigatórios', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast').should('be.visible')
        .and('contain.text', 'obrigatório');
    });

    it('Deve validar valor numérico', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste');
      cy.get('#expenseValue').type('abc');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast').should('be.visible')
        .and('contain.text', 'inválido');
    });
  });

  describe('Editar Despesas', () => {
    beforeEach(() => {
      // Adicionar despesa para editar
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Original');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(1000);
    });

    it('Deve editar despesa existente', () => {
      cy.get('.edit-btn').first().click();
      cy.get('#expenseName').clear().type('Despesa Editada');
      cy.get('#expenseValue').clear().type('200');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Despesa Editada');
      cy.get('#expenseList').should('contain', 'R$ 200,00');
    });

    it('Deve alterar tipo de despesa', () => {
      cy.get('.edit-btn').first().click();
      cy.get('#expenseType').select('recorrente');
      cy.get('#expenseCycle').select('mensal');
      cy.get('#expenseNextDate').type('2025-02-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Recorrente');
    });
  });

  describe('Remover Despesas', () => {
    beforeEach(() => {
      // Adicionar despesa para remover
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa para Remover');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(1000);
    });

    it('Deve remover despesa com confirmação', () => {
      cy.get('.delete-btn').first().click();
      
      // Confirmar remoção
      cy.on('window:confirm', () => true);
      
      cy.get('#expenseList').should('not.contain', 'Despesa para Remover');
    });

    it('Deve cancelar remoção', () => {
      cy.get('.delete-btn').first().click();
      
      // Cancelar remoção
      cy.on('window:confirm', () => false);
      
      cy.get('#expenseList').should('contain', 'Despesa para Remover');
    });
  });

  describe('Visualizar Despesas', () => {
    it('Deve mostrar lista vazia inicialmente', () => {
      cy.get('#expenseList tbody tr').should('have.length', 0);
      cy.get('.empty-message').should('be.visible');
    });

    it('Deve mostrar despesas na lista', () => {
      // Adicionar algumas despesas
      const despesas = [
        { nome: 'Mercado', valor: '100', categoria: 'Alimentação' },
        { nome: 'Gasolina', valor: '80', categoria: 'Transporte' },
        { nome: 'Cinema', valor: '30', categoria: 'Lazer' }
      ];

      despesas.forEach(despesa => {
        cy.get('#addExpenseBtn').click();
        cy.get('#expenseName').type(despesa.nome);
        cy.get('#expenseValue').type(despesa.valor);
        cy.get('#expenseCategory').select(despesa.categoria);
        cy.get('#expenseType').select('unica');
        cy.get('#expenseDate').type('2025-01-15');
        cy.get('#saveExpenseBtn').click();
        cy.wait(500);
      });

      cy.get('#expenseList tbody tr').should('have.length', 3);
      cy.get('#expenseList').should('contain', 'Mercado');
      cy.get('#expenseList').should('contain', 'Gasolina');
      cy.get('#expenseList').should('contain', 'Cinema');
    });

    it('Deve diferenciar despesas únicas e recorrentes', () => {
      // Despesa única
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Compra Única');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);

      // Despesa recorrente
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Assinatura');
      cy.get('#expenseValue').type('29.90');
      cy.get('#expenseCategory').select('Lazer');
      cy.get('#expenseType').select('recorrente');
      cy.get('#expenseCycle').select('mensal');
      cy.get('#expenseNextDate').type('2025-02-01');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);

      cy.get('#expenseList').should('contain', 'Única');
      cy.get('#expenseList').should('contain', 'Recorrente');
    });
  });

  describe('Filtrar por Categoria', () => {
    beforeEach(() => {
      // Adicionar despesas de diferentes categorias
      const despesas = [
        { nome: 'Supermercado', categoria: 'Alimentação' },
        { nome: 'Uber', categoria: 'Transporte' },
        { nome: 'Netflix', categoria: 'Lazer' }
      ];

      despesas.forEach(despesa => {
        cy.get('#addExpenseBtn').click();
        cy.get('#expenseName').type(despesa.nome);
        cy.get('#expenseValue').type('50');
        cy.get('#expenseCategory').select(despesa.categoria);
        cy.get('#expenseType').select('unica');
        cy.get('#expenseDate').type('2025-01-15');
        cy.get('#saveExpenseBtn').click();
        cy.wait(500);
      });
    });

    it('Deve filtrar por categoria específica', () => {
      cy.get('#categoryFilter').select('Alimentação');
      
      cy.get('#expenseList').should('contain', 'Supermercado');
      cy.get('#expenseList').should('not.contain', 'Uber');
      cy.get('#expenseList').should('not.contain', 'Netflix');
    });

    it('Deve mostrar todas quando selecionar "Todas"', () => {
      cy.get('#categoryFilter').select('Alimentação');
      cy.get('#categoryFilter').select('Todas');
      
      cy.get('#expenseList').should('contain', 'Supermercado');
      cy.get('#expenseList').should('contain', 'Uber');
      cy.get('#expenseList').should('contain', 'Netflix');
    });
  });

  describe('Validações de Valor', () => {
    it('Deve aceitar valores decimais', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste Decimal');
      cy.get('#expenseValue').type('123.45');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'R$ 123,45');
    });

    // Testes de validação de valor movidos para testes-cenarios-funcionais-avancados.cy.js
    // para evitar duplicação e manter cenários mais completos
  });
});