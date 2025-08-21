describe('Testes de Notificações de Vencimento', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loginAsDefaultUser();
    
    // Limpar dados de notificações anteriores
    cy.window().then((win) => {
      if (win.gerirApp && win.gerirApp.notificationsSent) {
        win.gerirApp.notificationsSent = {};
      }
    });
  });

  describe('Configuração de Permissões de Notificação', () => {
    it('deve solicitar permissão para notificações na primeira visita', () => {
      // Simular primeira visita (sem permissão)
      cy.window().then((win) => {
        // Mock da API de notificações
        cy.stub(win, 'Notification').value({
          permission: 'default',
          requestPermission: cy.stub().resolves('granted')
        });
      });
      
      cy.reload();
      
      // Verificar se a permissão foi solicitada
      cy.window().then((win) => {
        expect(win.Notification.requestPermission).to.have.been.called;
      });
    });

    it('deve funcionar corretamente quando permissão é concedida', () => {
      cy.window().then((win) => {
        // Simular permissão concedida
        cy.stub(win, 'Notification').value({
          permission: 'granted',
          requestPermission: cy.stub().resolves('granted')
        });
      });
      
      // Verificar se o sistema reconhece a permissão
      cy.window().then((win) => {
        expect(win.Notification.permission).to.equal('granted');
      });
    });

    it('deve lidar adequadamente quando permissão é negada', () => {
      cy.window().then((win) => {
        // Simular permissão negada
        cy.stub(win, 'Notification').value({
          permission: 'denied',
          requestPermission: cy.stub().resolves('denied')
        });
      });
      
      // Sistema deve continuar funcionando sem notificações
      cy.get('#dashboard-container').should('be.visible');
    });
  });

  describe('Disparo de Notificações por Prazo', () => {
    it('deve disparar notificação para despesa que vence hoje', () => {
      const hoje = new Date().toISOString().split('T')[0];
      
      // Criar despesa recorrente que vence hoje
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Aluguel - Vence Hoje');
      cy.get('#expenseValue').type('1200.00');
      cy.get('#expenseCategory').select('Moradia');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(hoje);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Mock da API de notificações
      let notificationCreated = false;
      cy.window().then((win) => {
        cy.stub(win, 'Notification').callsFake((title, options) => {
          notificationCreated = true;
          expect(title).to.contain('Gerir.me - Pagamento próximo');
          expect(options.body).to.contain('Vence hoje: Aluguel - Vence Hoje');
          expect(options.body).to.contain('R$ 1.200,00');
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Simular verificação de notificações
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
      });
      
      cy.then(() => {
        expect(notificationCreated).to.be.true;
      });
    });

    it('deve disparar notificação para despesa que vence amanhã', () => {
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      const amanhaStr = amanha.toISOString().split('T')[0];
      
      // Criar despesa recorrente que vence amanhã
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Conta de Luz - Vence Amanhã');
      cy.get('#expenseValue').type('150.00');
      cy.get('#expenseCategory').select('Moradia');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(amanhaStr);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Mock da API de notificações
      let notificationCreated = false;
      cy.window().then((win) => {
        cy.stub(win, 'Notification').callsFake((title, options) => {
          notificationCreated = true;
          expect(title).to.contain('Gerir.me - Pagamento próximo');
          expect(options.body).to.contain('Vence amanhã: Conta de Luz - Vence Amanhã');
          expect(options.body).to.contain('R$ 150,00');
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Simular verificação de notificações
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
      });
      
      cy.then(() => {
        expect(notificationCreated).to.be.true;
      });
    });

    it('deve disparar notificação para despesa que vence em 2 dias', () => {
      const doisDias = new Date();
      doisDias.setDate(doisDias.getDate() + 2);
      const doisDiasStr = doisDias.toISOString().split('T')[0];
      
      // Criar despesa recorrente que vence em 2 dias
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Internet - Vence em 2 Dias');
      cy.get('#expenseValue').type('89.90');
      cy.get('#expenseCategory').select('Moradia');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(doisDiasStr);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Mock da API de notificações
      let notificationCreated = false;
      cy.window().then((win) => {
        cy.stub(win, 'Notification').callsFake((title, options) => {
          notificationCreated = true;
          expect(title).to.contain('Gerir.me - Pagamento próximo');
          expect(options.body).to.contain('Vence em 2 dias: Internet - Vence em 2 Dias');
          expect(options.body).to.contain('R$ 89,90');
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Simular verificação de notificações
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
      });
      
      cy.then(() => {
        expect(notificationCreated).to.be.true;
      });
    });

    it('deve disparar notificação para despesa que vence em 3 dias', () => {
      const tresDias = new Date();
      tresDias.setDate(tresDias.getDate() + 3);
      const tresDiasStr = tresDias.toISOString().split('T')[0];
      
      // Criar despesa recorrente que vence em 3 dias
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Telefone - Vence em 3 Dias');
      cy.get('#expenseValue').type('45.00');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(tresDiasStr);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Mock da API de notificações
      let notificationCreated = false;
      cy.window().then((win) => {
        cy.stub(win, 'Notification').callsFake((title, options) => {
          notificationCreated = true;
          expect(title).to.contain('Gerir.me - Pagamento próximo');
          expect(options.body).to.contain('Vence em 3 dias: Telefone - Vence em 3 Dias');
          expect(options.body).to.contain('R$ 45,00');
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Simular verificação de notificações
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
      });
      
      cy.then(() => {
        expect(notificationCreated).to.be.true;
      });
    });

    it('não deve disparar notificação para despesa que vence em mais de 3 dias', () => {
      const quatroDias = new Date();
      quatroDias.setDate(quatroDias.getDate() + 4);
      const quatroDiasStr = quatroDias.toISOString().split('T')[0];
      
      // Criar despesa recorrente que vence em 4 dias
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Seguro - Vence em 4 Dias');
      cy.get('#expenseValue').type('200.00');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(quatroDiasStr);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Mock da API de notificações
      let notificationCreated = false;
      cy.window().then((win) => {
        cy.stub(win, 'Notification').callsFake(() => {
          notificationCreated = true;
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Simular verificação de notificações
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
      });
      
      cy.then(() => {
        expect(notificationCreated).to.be.false;
      });
    });
  });

  describe('Controle de Duplicação de Notificações', () => {
    it('deve enviar notificação apenas uma vez por dia para a mesma despesa', () => {
      const hoje = new Date().toISOString().split('T')[0];
      
      // Criar despesa que vence hoje
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Despesa Teste Duplicação');
      cy.get('#expenseValue').type('100.00');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(hoje);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      let notificationCount = 0;
      cy.window().then((win) => {
        cy.stub(win, 'Notification').callsFake(() => {
          notificationCount++;
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Primeira verificação - deve enviar notificação
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
        
        // Segunda verificação no mesmo dia - não deve enviar
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
        
        // Terceira verificação no mesmo dia - não deve enviar
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
      });
      
      cy.then(() => {
        expect(notificationCount).to.equal(1);
      });
    });

    it('deve permitir nova notificação em dia diferente', () => {
      const hoje = new Date().toISOString().split('T')[0];
      
      // Criar despesa que vence hoje
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Despesa Teste Novo Dia');
      cy.get('#expenseValue').type('100.00');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(hoje);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      let notificationCount = 0;
      cy.window().then((win) => {
        cy.stub(win, 'Notification').callsFake(() => {
          notificationCount++;
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Primeira verificação - deve enviar notificação
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
        
        // Simular mudança de dia (limpar controle de notificações)
        if (win.gerirApp && win.gerirApp.notificationsSent) {
          win.gerirApp.notificationsSent = {};
        }
        
        // Segunda verificação em "novo dia" - deve enviar novamente
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
      });
      
      cy.then(() => {
        expect(notificationCount).to.equal(2);
      });
    });
  });

  describe('Múltiplos Vencimentos', () => {
    it('deve disparar notificações para múltiplas despesas que vencem no mesmo período', () => {
      const hoje = new Date().toISOString().split('T')[0];
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      const amanhaStr = amanha.toISOString().split('T')[0];
      
      // Criar primeira despesa
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Primeira Despesa');
      cy.get('#expenseValue').type('100.00');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(hoje);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Criar segunda despesa
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Segunda Despesa');
      cy.get('#expenseValue').type('200.00');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(amanhaStr);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Criar terceira despesa
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Terceira Despesa');
      cy.get('#expenseValue').type('300.00');
      cy.get('#expenseCategory').select('Moradia');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(hoje);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Mock da API de notificações
      let notificationCount = 0;
      const notificationMessages = [];
      
      cy.window().then((win) => {
        cy.stub(win, 'Notification').callsFake((title, options) => {
          notificationCount++;
          notificationMessages.push(options.body);
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Simular verificação de notificações
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
      });
      
      cy.then(() => {
        expect(notificationCount).to.equal(3);
        expect(notificationMessages).to.include.members([
          'Vence hoje: Primeira Despesa - R$ 100,00',
          'Vence amanhã: Segunda Despesa - R$ 200,00',
          'Vence hoje: Terceira Despesa - R$ 300,00'
        ]);
      });
    });

    it('deve lidar com cenário de muitas despesas vencendo simultaneamente', () => {
      const hoje = new Date().toISOString().split('T')[0];
      const despesas = [
        { nome: 'Aluguel', valor: '1200.00', categoria: 'Moradia' },
        { nome: 'Conta de Luz', valor: '150.00', categoria: 'Moradia' },
        { nome: 'Conta de Água', valor: '80.00', categoria: 'Moradia' },
        { nome: 'Internet', valor: '89.90', categoria: 'Moradia' },
        { nome: 'Supermercado', valor: '400.00', categoria: 'Alimentação' }
      ];
      
      cy.get('[data-section="expenses"]').click();
      
      // Criar múltiplas despesas
      despesas.forEach((despesa, index) => {
        cy.get('#addExpenseBtn').click();
        
        cy.get('#expenseName').type(despesa.nome);
        cy.get('#expenseValue').type(despesa.valor);
        cy.get('#expenseCategory').select(despesa.categoria);
        cy.get('#expenseType').select('recurring');
        cy.get('#expenseCycle').select('monthly');
        cy.get('#nextPayment').type(hoje);
        
        cy.get('#saveExpenseBtn').click();
        cy.get('.toast.success').should('be.visible');
      });
      
      // Mock da API de notificações
      let notificationCount = 0;
      
      cy.window().then((win) => {
        cy.stub(win, 'Notification').callsFake(() => {
          notificationCount++;
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Simular verificação de notificações
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
      });
      
      cy.then(() => {
        expect(notificationCount).to.equal(despesas.length);
      });
    });
  });



  describe('Casos Extremos e Validações', () => {
    it('não deve disparar notificações para despesas únicas (não recorrentes)', () => {
      const hoje = new Date().toISOString().split('T')[0];
      
      // Criar despesa única
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Despesa Única');
      cy.get('#expenseValue').type('50.00');
      cy.get('#expenseCategory').select('Lazer');
      cy.get('#expenseType').select('unique');
      cy.get('#expenseDate').type(hoje);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Mock da API de notificações
      let notificationCreated = false;
      cy.window().then((win) => {
        cy.stub(win, 'Notification').callsFake(() => {
          notificationCreated = true;
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Simular verificação de notificações
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
      });
      
      cy.then(() => {
        expect(notificationCreated).to.be.false;
      });
    });

    it('deve lidar com despesas sem data de próximo pagamento', () => {
      // Este teste verifica se o sistema não quebra com dados inconsistentes
      cy.window().then((win) => {
        let notificationCreated = false;
        cy.stub(win, 'Notification').callsFake(() => {
          notificationCreated = true;
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Simular verificação de notificações mesmo sem despesas
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
        
        // Não deve quebrar o sistema
        expect(notificationCreated).to.be.false;
      });
      
      // Dashboard deve continuar funcionando
      cy.get('#dashboard-container').should('be.visible');
    });

    it('deve funcionar corretamente após logout e login', () => {
      const hoje = new Date().toISOString().split('T')[0];
      
      // Criar despesa
      cy.get('[data-section="expenses"]').click();
      cy.get('#addExpenseBtn').click();
      
      cy.get('#expenseName').type('Despesa Persistente');
      cy.get('#expenseValue').type('75.00');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('recurring');
      cy.get('#expenseCycle').select('monthly');
      cy.get('#nextPayment').type(hoje);
      
      cy.get('#saveExpenseBtn').click();
      cy.get('.toast.success').should('be.visible');
      
      // Logout
      cy.get('#logoutBtn').click();
      
      // Login novamente
      cy.loginAsDefaultUser();
      
      // Verificar se notificações ainda funcionam
      let notificationCreated = false;
      cy.window().then((win) => {
        cy.stub(win, 'Notification').callsFake((title, options) => {
          notificationCreated = true;
          expect(options.body).to.contain('Despesa Persistente');
          return { close: cy.stub() };
        });
        win.Notification.permission = 'granted';
        
        // Simular verificação de notificações
        if (win.gerirApp && win.gerirApp.checkUpcomingPayments) {
          win.gerirApp.checkUpcomingPayments();
        }
      });
      
      cy.then(() => {
        expect(notificationCreated).to.be.true;
      });
    });
  });
});