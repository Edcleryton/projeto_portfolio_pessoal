describe('Testes - Cálculos e Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // Login rápido
    const email = `usuario${Date.now()}@teste.com`;
    const senha = 'Teste123';
    
    cy.get('#showRegister').click();
    cy.get('#registerName').type('Usuario Teste');
    cy.get('#registerEmail').type(email);
    cy.get('#registerPassword').type(senha);
    cy.get('#registerForm > .btn-primary').click();
    
    cy.wait(2000);
  });

  describe('Cálculo do Gasto Mensal', () => {
    it('Deve calcular apenas despesas únicas do mês atual', () => {
      // Adicionar despesa única do mês atual
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Supermercado');
      cy.get('#expenseValue').type('150');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#monthlyTotal').should('contain', 'R$ 150,00');
    });

    it('Deve incluir despesas recorrentes mensais', () => {
      // Adicionar despesa recorrente mensal
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Aluguel');
      cy.get('#expenseValue').type('1000');
      cy.get('#expenseCategory').select('Moradia');
      cy.get('#expenseType').select('recorrente');
      cy.get('#expenseCycle').select('mensal');
      cy.get('#expenseNextDate').type('2025-02-05');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#monthlyTotal').should('contain', 'R$ 1.000,00');
    });

    it('Deve calcular despesas recorrentes anuais divididas por 12', () => {
      // Adicionar despesa recorrente anual
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('IPVA');
      cy.get('#expenseValue').type('1200');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('recorrente');
      cy.get('#expenseCycle').select('anual');
      cy.get('#expenseNextDate').type('2025-03-01');
      cy.get('#saveExpenseBtn').click();
      
      // 1200 / 12 = 100
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
    });

    it('Deve somar todos os tipos de despesas', () => {
      // Despesa única: 50
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Farmácia');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Saúde');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);

      // Despesa recorrente mensal: 200
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Internet');
      cy.get('#expenseValue').type('200');
      cy.get('#expenseCategory').select('Moradia');
      cy.get('#expenseType').select('recorrente');
      cy.get('#expenseCycle').select('mensal');
      cy.get('#expenseNextDate').type('2025-02-01');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);

      // Despesa recorrente anual: 600 (600/12 = 50)
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Seguro');
      cy.get('#expenseValue').type('600');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('recorrente');
      cy.get('#expenseCycle').select('anual');
      cy.get('#expenseNextDate').type('2025-12-01');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);

      // Total: 50 + 200 + 50 = 300
      cy.get('#monthlyTotal').should('contain', 'R$ 300,00');
    });

    it('Deve atualizar total ao editar despesa', () => {
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Original');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);

      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');

      // Editar valor
      cy.get('.edit-btn').first().click();
      cy.get('#expenseValue').clear().type('200');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#monthlyTotal').should('contain', 'R$ 200,00');
    });

    it('Deve atualizar total ao remover despesa', () => {
      // Adicionar duas despesas
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa 1');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);

      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa 2');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);

      cy.get('#monthlyTotal').should('contain', 'R$ 150,00');

      // Remover uma despesa
      cy.get('.delete-btn').first().click();
      cy.on('window:confirm', () => true);
      
      cy.get('#monthlyTotal').should('contain', 'R$ 50,00');
    });
  });

  describe('Formato Monetário', () => {
    it('Deve exibir valores no formato brasileiro', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste Formato');
      cy.get('#expenseValue').type('1234.56');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      // Verificar formato na lista
      cy.get('#expenseList').should('contain', 'R$ 1.234,56');
      
      // Verificar formato no total
      cy.get('#monthlyTotal').should('contain', 'R$ 1.234,56');
    });

    it('Deve exibir centavos mesmo quando zero', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Valor Inteiro');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'R$ 100,00');
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
    });
  });

  describe('Calendário de Pagamentos', () => {
    it('Deve mostrar despesas recorrentes no calendário', () => {
      // Adicionar despesa recorrente
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Conta de Luz');
      cy.get('#expenseValue').type('150');
      cy.get('#expenseCategory').select('Moradia');
      cy.get('#expenseType').select('recorrente');
      cy.get('#expenseCycle').select('mensal');
      cy.get('#expenseNextDate').type('2025-02-10');
      cy.get('#saveExpenseBtn').click();
      
      // Verificar se aparece no calendário
      cy.get('#calendar').should('be.visible');
      cy.get('.calendar-day[data-date="2025-02-10"]').should('have.class', 'has-expense');
    });

    it('Não deve mostrar despesas únicas no calendário', () => {
      // Adicionar despesa única
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Compra Única');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-20');
      cy.get('#saveExpenseBtn').click();
      
      // Verificar que não aparece no calendário
      cy.get('.calendar-day[data-date="2025-01-20"]').should('not.have.class', 'has-expense');
    });

    it('Deve navegar entre meses no calendário', () => {
      cy.get('#calendar').should('be.visible');
      
      // Navegar para próximo mês
      cy.get('.calendar-next').click();
      cy.get('.calendar-month').should('contain', 'Fevereiro');
      
      // Navegar para mês anterior
      cy.get('.calendar-prev').click();
      cy.get('.calendar-month').should('contain', 'Janeiro');
    });
  });

  describe('Dashboard Inicial', () => {
    it('Deve mostrar R$ 0,00 quando não há despesas', () => {
      cy.get('#monthlyTotal').should('contain', 'R$ 0,00');
    });

    it('Deve mostrar mensagem quando lista está vazia', () => {
      cy.get('.empty-message').should('be.visible')
        .and('contain.text', 'Nenhuma despesa cadastrada');
    });

    it('Deve esconder mensagem vazia quando há despesas', () => {
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Primeira Despesa');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.empty-message').should('not.be.visible');
      cy.get('#expenseList tbody tr').should('have.length', 1);
    });
  });

  describe('Atualização em Tempo Real', () => {
    it('Deve atualizar dashboard imediatamente após adicionar', () => {
      cy.get('#monthlyTotal').should('contain', 'R$ 0,00');
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste Tempo Real');
      cy.get('#expenseValue').type('75');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      // Verificar atualização imediata
      cy.get('#monthlyTotal').should('contain', 'R$ 75,00');
      cy.get('#expenseList').should('contain', 'Teste Tempo Real');
    });

    it('Deve manter dados após recarregar página', () => {
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Persistente');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      // Recarregar página
      cy.reload();
      
      // Verificar se dados persistiram
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
      cy.get('#expenseList').should('contain', 'Despesa Persistente');
    });
  });
});