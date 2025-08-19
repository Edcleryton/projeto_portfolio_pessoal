describe('Testes - Notificações e Interface', () => {
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

  describe('Notificações de Vencimento', () => {
    it('Deve mostrar notificação para despesa vencendo em 3 dias', () => {
      // Calcular data 3 dias à frente
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      const dateString = futureDate.toISOString().split('T')[0];
      
      // Adicionar despesa recorrente vencendo em 3 dias
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Conta Vencendo');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Moradia');
      cy.get('#expenseType').select('recorrente');
      cy.get('#expenseCycle').select('mensal');
      cy.get('#expenseNextDate').type(dateString);
      cy.get('#saveExpenseBtn').click();
      
      // Recarregar para verificar notificação
      cy.reload();
      
      cy.get('.notification').should('be.visible')
        .and('contain.text', 'Conta Vencendo');
    });

    it('Deve mostrar notificação para despesa vencendo hoje', () => {
      // Data de hoje
      const today = new Date().toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Vence Hoje');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('recorrente');
      cy.get('#expenseCycle').select('mensal');
      cy.get('#expenseNextDate').type(today);
      cy.get('#saveExpenseBtn').click();
      
      cy.reload();
      
      cy.get('.notification').should('be.visible')
        .and('contain.text', 'Vence Hoje');
    });

    it('Não deve mostrar notificação para despesa vencendo em mais de 3 dias', () => {
      // Data 5 dias à frente
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const dateString = futureDate.toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Vence Longe');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Moradia');
      cy.get('#expenseType').select('recorrente');
      cy.get('#expenseCycle').select('mensal');
      cy.get('#expenseNextDate').type(dateString);
      cy.get('#saveExpenseBtn').click();
      
      cy.reload();
      
      cy.get('.notification').should('not.contain', 'Vence Longe');
    });

    it('Não deve mostrar notificação para despesas únicas', () => {
      const today = new Date().toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Única');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type(today);
      cy.get('#saveExpenseBtn').click();
      
      cy.reload();
      
      cy.get('.notification').should('not.contain', 'Despesa Única');
    });
  });

  describe('Alternância de Tema', () => {
    it('Deve alternar para modo escuro', () => {
      cy.get('#themeToggle').click();
      
      cy.get('body').should('have.class', 'dark-theme');
      cy.get('.toast').should('be.visible')
        .and('contain.text', 'Tema escuro ativado');
    });

    it('Deve alternar para modo claro', () => {
      // Primeiro ativar modo escuro
      cy.get('#themeToggle').click();
      cy.wait(500);
      
      // Depois voltar para claro
      cy.get('#themeToggle').click();
      
      cy.get('body').should('not.have.class', 'dark-theme');
      cy.get('.toast').should('be.visible')
        .and('contain.text', 'Tema claro ativado');
    });

    it('Deve persistir tema após recarregar página', () => {
      // Ativar modo escuro
      cy.get('#themeToggle').click();
      cy.wait(500);
      
      // Recarregar página
      cy.reload();
      
      // Verificar se tema persistiu
      cy.get('body').should('have.class', 'dark-theme');
    });

    it('Deve mostrar ícone correto no botão de tema', () => {
      // Modo claro - deve mostrar ícone de lua
      cy.get('#themeToggle').should('contain', '🌙');
      
      // Alternar para escuro - deve mostrar ícone de sol
      cy.get('#themeToggle').click();
      cy.get('#themeToggle').should('contain', '☀️');
    });
  });

  describe('Feedback Visual', () => {
    it('Deve mostrar toast de sucesso ao adicionar despesa', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste Toast');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast').should('be.visible')
        .and('have.class', 'success')
        .and('contain.text', 'sucesso');
    });

    it('Deve mostrar toast de erro para dados inválidos', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste Erro');
      cy.get('#expenseValue').type('-50'); // Valor inválido
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast').should('be.visible')
        .and('have.class', 'error')
        .and('contain.text', 'erro');
    });

    it('Deve destacar campos obrigatórios não preenchidos', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseName').should('have.class', 'error')
        .or('have.css', 'border-color', 'rgb(255, 0, 0)');
    });

    it('Deve mostrar loading durante operações', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste Loading');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      
      cy.get('#saveExpenseBtn').click();
      
      // Verificar se botão mostra loading
      cy.get('#saveExpenseBtn').should('contain.text', 'Salvando...')
        .or('have.class', 'loading');
    });
  });

  describe('Navegação e Usabilidade', () => {
    it('Deve fechar modal ao clicar em cancelar', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseModal').should('be.visible');
      
      cy.get('#cancelExpenseBtn').click();
      cy.get('#expenseModal').should('not.be.visible');
    });

    it('Deve fechar modal ao pressionar ESC', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseModal').should('be.visible');
      
      cy.get('body').type('{esc}');
      cy.get('#expenseModal').should('not.be.visible');
    });

    it('Deve focar no primeiro campo ao abrir modal', () => {
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').should('be.focused');
    });

    it('Deve navegar por TAB entre campos', () => {
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').focus().tab();
      cy.get('#expenseValue').should('be.focused');
      
      cy.tab();
      cy.get('#expenseCategory').should('be.focused');
    });
  });

  describe('Responsividade', () => {
    it('Deve funcionar em tela pequena', () => {
      cy.viewport(375, 667); // iPhone SE
      
      cy.get('#addExpenseBtn').should('be.visible').click();
      cy.get('#expenseModal').should('be.visible');
      
      cy.get('#expenseName').type('Teste Mobile');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Teste Mobile');
    });

    it('Deve funcionar em tablet', () => {
      cy.viewport(768, 1024); // iPad
      
      cy.get('#monthlyTotal').should('be.visible');
      cy.get('#expenseList').should('be.visible');
      cy.get('#calendar').should('be.visible');
    });
  });

  describe('Acessibilidade', () => {
    it('Deve ter labels nos campos de formulário', () => {
      cy.get('#addExpenseBtn').click();
      
      cy.get('label[for="expenseName"]').should('exist');
      cy.get('label[for="expenseValue"]').should('exist');
      cy.get('label[for="expenseCategory"]').should('exist');
    });

    it('Deve ter atributos ARIA apropriados', () => {
      cy.get('#addExpenseBtn').should('have.attr', 'aria-label');
      cy.get('#themeToggle').should('have.attr', 'aria-label');
      cy.get('#logout').should('have.attr', 'aria-label');
    });

    it('Deve anunciar mudanças para leitores de tela', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste Acessibilidade');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('[aria-live="polite"]').should('contain.text', 'Despesa adicionada');
    });
  });

  describe('Controle de Duplicação', () => {
    it('Deve evitar múltiplos cliques no botão salvar', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste Duplicação');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      
      // Clicar múltiplas vezes rapidamente
      cy.get('#saveExpenseBtn').click().click().click();
      
      // Deve haver apenas uma despesa na lista
      cy.get('#expenseList tbody tr').should('have.length', 1);
    });

    it('Deve desabilitar botão durante processamento', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste Desabilitar');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      
      cy.get('#saveExpenseBtn').click();
      
      // Botão deve ficar desabilitado temporariamente
      cy.get('#saveExpenseBtn').should('be.disabled');
    });
  });
});