describe('Dashboard - Testes Heurísticos', () => {
  beforeEach(() => {
    // Criar usuário e fazer login
    cy.visit('http://localhost:8080/')
    cy.get('#showRegister').click()
    cy.get('#registerName').type('UsuarioDashboard')
    cy.get('#registerEmail').type('dashboard@teste.com')
    cy.get('#registerPassword').type('123456@Teste')
    cy.get('#confirmPassword').type('123456@Teste')
    cy.get('#registerForm > .btn-primary').click()
    cy.wait(1000)
    
    // Fazer login
    cy.visit('http://localhost:8080/')
    cy.get('#loginEmail').type('dashboard@teste.com')
    cy.get('#loginPassword').type('123456@Teste')
    cy.get('#loginForm > .btn-primary').click()
  })

  describe('CRUD de Despesas com Ataques de Dados', () => {
    it('deve criar despesa com descrição muito longa (>255 caracteres)', () => {
      const longDescription = 'Descrição muito longa '.repeat(20) // ~420 caracteres
      
      cy.get('#addExpenseBtn').click()
      cy.get('#expenseDescription').type(longDescription)
      cy.get('#expenseAmount').type('100.50')
      cy.get('#expenseCategory').select('alimentacao')
      cy.get('#expenseDate').type('2025-01-16')
      cy.get('#saveExpenseBtn').click()
      
      cy.get('.toast').should('be.visible')
    })

    it('deve criar despesa com caracteres especiais na descrição', () => {
      const specialDescriptions = [
        'Compra com "aspas" e \'apostrofes\'',
        'Descrição com <script>alert("xss")</script>',
        'Texto com & ampersand % porcentagem',
        'Descrição com \n quebra \t tab',
        'Emoji na descrição 😀💰🛒'
      ]
      
      specialDescriptions.forEach((desc, index) => {
        cy.get('#addExpenseBtn').click()
        cy.get('#expenseDescription').clear().type(desc)
        cy.get('#expenseAmount').clear().type(`${10 + index}.99`)
        cy.get('#expenseCategory').select('outros')
        cy.get('#expenseDate').type('2025-01-16')
        cy.get('#saveExpenseBtn').click()
        
        cy.get('.toast').should('be.visible')
        cy.wait(1000)
      })
    })

    it('deve criar despesa com valores monetários extremos', () => {
      const extremeValues = [
        '0.01',           // Valor mínimo
        '999999.99',      // Valor muito alto
        '-100.50',        // Valor negativo
        '0',              // Zero
        '1000000000',     // Valor astronômico
        '0.001',          // Mais de 2 casas decimais
        '100,50',         // Vírgula ao invés de ponto
        'abc',            // Texto no lugar de número
        '100.999'         // 3 casas decimais
      ]
      
      extremeValues.forEach((value, index) => {
        cy.get('#addExpenseBtn').click()
        cy.get('#expenseDescription').clear().type(`Teste valor ${value}`)
        cy.get('#expenseAmount').clear().type(value)
        cy.get('#expenseCategory').select('outros')
        cy.get('#expenseDate').type('2025-01-16')
        cy.get('#saveExpenseBtn').click()
        
        cy.get('.toast').should('be.visible')
        cy.wait(1000)
      })
    })

    it('deve criar despesa com datas inválidas', () => {
      const invalidDates = [
        '2025-02-30',     // 30 de fevereiro
        '2025-04-31',     // 31 de abril
        '2025-13-01',     // Mês 13
        '2025-00-01',     // Mês 0
        '2025-01-32',     // Dia 32
        '2025-01-00',     // Dia 0
        '1900-01-01',     // Data muito antiga
        '2100-12-31',     // Data muito futura
        'invalid-date',   // Texto inválido
        '25-01-2025'      // Formato incorreto
      ]
      
      invalidDates.forEach((date, index) => {
        cy.get('#addExpenseBtn').click()
        cy.get('#expenseDescription').clear().type(`Teste data ${date}`)
        cy.get('#expenseAmount').clear().type('50.00')
        cy.get('#expenseCategory').select('outros')
        cy.get('#expenseDate').clear().type(date)
        cy.get('#saveExpenseBtn').click()
        
        cy.get('.toast').should('be.visible')
        cy.wait(1000)
      })
    })

    it('deve testar injeção SQL em campos de despesa', () => {
      const sqlInjections = [
        "'; DROP TABLE expenses; --",
        "' OR '1'='1' --",
        "'; UPDATE expenses SET amount=0; --",
        "' UNION SELECT * FROM users --",
        "<script>alert('XSS')</script>"
      ]
      
      sqlInjections.forEach((injection, index) => {
        cy.get('#addExpenseBtn').click()
        cy.get('#expenseDescription').clear().type(injection)
        cy.get('#expenseAmount').clear().type('100.00')
        cy.get('#expenseCategory').select('outros')
        cy.get('#expenseDate').type('2025-01-16')
        cy.get('#saveExpenseBtn').click()
        
        cy.get('.toast').should('be.visible')
        cy.wait(1000)
      })
    })
  })

  describe('Testes de Interface do Dashboard', () => {
    it('deve atualizar página durante edição de despesa', () => {
      // Criar uma despesa primeiro
      cy.get('#addExpenseBtn').click()
      cy.get('#expenseDescription').type('Despesa para teste reload')
      cy.get('#expenseAmount').type('75.00')
      cy.get('#expenseCategory').select('transporte')
      cy.get('#expenseDate').type('2025-01-16')
      cy.get('#saveExpenseBtn').click()
      
      cy.wait(2000)
      
      // Tentar editar e recarregar página
      cy.get('.expense-item').first().find('.edit-btn').click()
      cy.get('#expenseDescription').clear().type('Descrição alterada')
      
      cy.reload()
      
      // Verificar se voltou ao estado original
      cy.get('#dashboard').should('be.visible')
    })

    it('deve testar botão voltar durante criação de despesa', () => {
      cy.get('#addExpenseBtn').click()
      cy.get('#expenseDescription').type('Teste botão voltar')
      cy.get('#expenseAmount').type('50.00')
      
      // Simular botão voltar
      cy.go('back')
      cy.go('forward')
      
      // Verificar estado da aplicação
      cy.get('#dashboard').should('be.visible')
    })

    it('deve manipular URL com parâmetros maliciosos', () => {
      const maliciousParams = [
        '?id=1; DROP TABLE expenses;',
        '?user=admin&debug=true',
        '?redirect=http://malicious-site.com',
        '?xss=<script>alert(1)</script>',
        '?sql=\' OR 1=1 --'
      ]
      
      maliciousParams.forEach(param => {
        cy.visit(`http://localhost:8080/${param}`)
        cy.wait(1000)
        
        // Verificar se a aplicação ainda funciona
        cy.get('#dashboard').should('be.visible')
      })
    })
  })

  describe('Testes de Filtros e Sistema de Busca', () => {
    beforeEach(() => {
      // Criar algumas despesas para testar filtros
      const testExpenses = [
        { desc: 'Supermercado', amount: '150.00', category: 'alimentacao' },
        { desc: 'Gasolina', amount: '80.00', category: 'transporte' },
        { desc: 'Cinema', amount: '25.00', category: 'entretenimento' }
      ]
      
      testExpenses.forEach(expense => {
        cy.get('#addExpenseBtn').click()
        cy.get('#expenseDescription').type(expense.desc)
        cy.get('#expenseAmount').type(expense.amount)
        cy.get('#expenseCategory').select(expense.category)
        cy.get('#expenseDate').type('2025-01-16')
        cy.get('#saveExpenseBtn').click()
        cy.wait(1000)
      })
    })

    it('deve realizar busca com caracteres especiais', () => {
      const searchTerms = [
        '*',
        '?',
        '%',
        '_',
        '\\',
        "'",
        '"',
        '<script>',
        'SELECT *'
      ]
      
      searchTerms.forEach(term => {
        cy.get('#searchExpenses').clear().type(term)
        cy.wait(500)
        
        // Verificar se a busca não quebra a aplicação
        cy.get('#expensesList').should('be.visible')
      })
    })

    it('deve aplicar filtros com valores extremos de data', () => {
      // Testar filtro de data com valores extremos
      cy.get('#filterStartDate').type('1900-01-01')
      cy.get('#filterEndDate').type('2100-12-31')
      cy.get('#applyFilters').click()
      
      cy.get('#expensesList').should('be.visible')
    })
  })

  describe('Testes de Performance e Limites do Sistema', () => {
    it('deve criar muitas despesas rapidamente', () => {
      // Criar 20 despesas em sequência
      for (let i = 0; i < 20; i++) {
        cy.get('#addExpenseBtn').click()
        cy.get('#expenseDescription').type(`Despesa em lote ${i + 1}`)
        cy.get('#expenseAmount').type(`${(i + 1) * 10}.00`)
        cy.get('#expenseCategory').select('outros')
        cy.get('#expenseDate').type('2025-01-16')
        cy.get('#saveExpenseBtn').click()
        cy.wait(200) // Pequena pausa
      }
      
      // Verificar se todas foram criadas
      cy.get('.expense-item').should('have.length.at.least', 20)
    })

    it('deve editar e cancelar múltiplas vezes', () => {
      // Criar uma despesa
      cy.get('#addExpenseBtn').click()
      cy.get('#expenseDescription').type('Despesa para edição múltipla')
      cy.get('#expenseAmount').type('100.00')
      cy.get('#expenseCategory').select('outros')
      cy.get('#expenseDate').type('2025-01-16')
      cy.get('#saveExpenseBtn').click()
      
      cy.wait(1000)
      
      // Editar e cancelar 5 vezes
      for (let i = 0; i < 5; i++) {
        cy.get('.expense-item').first().find('.edit-btn').click()
        cy.get('#expenseDescription').clear().type(`Edição ${i + 1}`)
        cy.get('#cancelEditBtn').click()
        cy.wait(500)
      }
      
      // Verificar se a despesa ainda existe
      cy.get('.expense-item').should('contain', 'Despesa para edição múltipla')
    })
  })

  describe('Testes de Interrupções de Sessão e Timeouts', () => {
    it('deve fazer logout durante criação de despesa', () => {
      cy.get('#addExpenseBtn').click()
      cy.get('#expenseDescription').type('Despesa interrompida')
      cy.get('#expenseAmount').type('50.00')
      
      // Fazer logout
      cy.get('#logoutBtn').click()
      
      // Verificar se voltou para tela de login
      cy.get('#loginForm').should('be.visible')
    })

    it('deve simular perda de conexão durante operação', () => {
      // Interceptar requisições e simular erro de rede
      cy.intercept('POST', '**/expenses', { forceNetworkError: true }).as('networkError')
      
      cy.get('#addExpenseBtn').click()
      cy.get('#expenseDescription').type('Teste erro de rede')
      cy.get('#expenseAmount').type('75.00')
      cy.get('#expenseCategory').select('outros')
      cy.get('#expenseDate').type('2025-01-16')
      cy.get('#saveExpenseBtn').click()
      
      // Verificar se há tratamento de erro
      cy.get('.toast').should('be.visible')
    })
  })

  describe('Testes de Validação e Consistência de Dados', () => {
    it('deve validar campos obrigatórios vazios', () => {
      cy.get('#addExpenseBtn').click()
      
      // Tentar salvar sem preencher nada
      cy.get('#saveExpenseBtn').click()
      cy.get('.toast').should('be.visible')
      
      // Preencher apenas descrição
      cy.get('#expenseDescription').type('Apenas descrição')
      cy.get('#saveExpenseBtn').click()
      cy.get('.toast').should('be.visible')
      
      // Preencher apenas valor
      cy.get('#expenseDescription').clear()
      cy.get('#expenseAmount').type('100.00')
      cy.get('#saveExpenseBtn').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve manter consistência de dados após múltiplas operações', () => {
      // Criar despesa
      cy.get('#addExpenseBtn').click()
      cy.get('#expenseDescription').type('Teste consistência')
      cy.get('#expenseAmount').type('100.00')
      cy.get('#expenseCategory').select('alimentacao')
      cy.get('#expenseDate').type('2025-01-16')
      cy.get('#saveExpenseBtn').click()
      
      cy.wait(1000)
      
      // Editar
      cy.get('.expense-item').first().find('.edit-btn').click()
      cy.get('#expenseAmount').clear().type('150.00')
      cy.get('#saveExpenseBtn').click()
      
      cy.wait(1000)
      
      // Verificar se o valor foi atualizado
      cy.get('.expense-item').first().should('contain', '150.00')
      
      // Deletar
      cy.get('.expense-item').first().find('.delete-btn').click()
      cy.get('#confirmDeleteBtn').click()
      
      // Verificar se foi removida
      cy.get('.expense-item').should('not.contain', 'Teste consistência')
    })
  })
})