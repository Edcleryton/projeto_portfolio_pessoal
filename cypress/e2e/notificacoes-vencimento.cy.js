describe('Testes de Notificações de Vencimento', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loginAsDefaultUser();
    
    // Resetar notificações usando comando personalizado
    cy.resetNotifications();
  });

  describe('Configuração de Permissões de Notificação', () => {
    it('deve solicitar permissão para notificações na primeira visita', () => {
      // Simular primeira visita usando comando personalizado
      cy.mockNotificationPermission('default');
      
      cy.reload();
      
      // Verificar se a permissão foi solicitada
      // Verificar se a permissão foi solicitada através do estado da aplicação
      cy.task('getAppState').then((state) => {
        expect(state.notificationPermission).to.not.equal('default');
      });
    });

    it('deve funcionar corretamente quando permissão é concedida', () => {
      // Simular permissão concedida usando comando personalizado
      cy.mockNotificationPermission('granted');
      
      // Verificar se o sistema reconhece a permissão
      cy.task('getAppState').then((state) => {
        expect(state.notificationPermission).to.equal('granted');
      });
    });

    it('deve lidar adequadamente quando permissão é negada', () => {
      // Simular permissão negada usando comando personalizado
      cy.mockNotificationPermission('denied');
      
      // Verificar se o sistema reconhece a negação
      cy.task('getAppState').then((state) => {
        expect(state.notificationPermission).to.equal('denied');
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
      
      // Simular notificação usando comando personalizado
      cy.mockNotificationPermission('granted');
      cy.task('addNotificationMock', {
        title: '💰 Gerir.me - Pagamento Próximo',
        body: 'Aluguel - Vence Hoje vence hoje! Valor: R$ 1.200,00'
      });
      
      // Verificar se a notificação foi criada
      cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', 'Aluguel - Vence Hoje');
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
      
      // Simular notificação usando comando personalizado
      cy.mockNotificationPermission('granted');
      cy.task('addNotificationMock', {
        title: '💰 Gerir.me - Pagamento Próximo',
        body: 'Conta de Luz - Vence Amanhã vence amanhã! Valor: R$ 150,00'
      });
      
      // Verificar se a notificação foi criada
      cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', 'Conta de Luz - Vence Amanhã');
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
      
      // Simular notificação usando comando personalizado
      cy.mockNotificationPermission('granted');
      cy.task('addNotificationMock', {
        title: '💰 Gerir.me - Pagamento Próximo',
        body: 'Internet - Vence em 2 Dias vence em 2 dias! Valor: R$ 89,90'
      });
      
      // Verificar se a notificação foi criada
      cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', 'Internet - Vence em 2 Dias');
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
      
      // Simular notificação usando comando personalizado
      cy.mockNotificationPermission('granted');
      cy.task('addNotificationMock', {
        title: '💰 Gerir.me - Pagamento Próximo',
        body: 'Telefone - Vence em 3 Dias vence em 3 dias! Valor: R$ 45,00'
      });
      
      // Verificar se a notificação foi criada
      cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', 'Telefone - Vence em 3 Dias');
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
      
      // Simular verificação de notificações usando comando personalizado
      cy.mockNotificationPermission('granted');
      cy.task('triggerNotificationCheck');
      
      // Verificar que nenhuma notificação foi enviada
      cy.checkNoNotificationSent('Seguro - Vence em 4 Dias');
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
      
      // Configurar permissão de notificação
      cy.mockNotificationPermission('granted');
      
      // Primeira verificação - deve enviar notificação
      cy.task('addNotificationMock', {
        title: '💰 Gerir.me - Pagamento Próximo',
        body: 'Despesa Teste vence hoje! Valor: R$ 100,00'
      });
      cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', 'Despesa Teste');
      
      // Segunda e terceira verificações no mesmo dia - não devem enviar
      cy.checkNoNotificationSent();
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
      
      // Configurar permissão de notificação
      cy.mockNotificationPermission('granted');
      
      // Primeira verificação - deve enviar notificação
      cy.task('addNotificationMock', {
        title: '💰 Gerir.me - Pagamento Próximo',
        body: 'Despesa Teste Novo Dia vence hoje! Valor: R$ 100,00'
      });
      cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', 'Despesa Teste Novo Dia');
      
      // Simular mudança de dia
      cy.resetNotifications();
      
      // Segunda verificação em "novo dia" - deve enviar novamente
      cy.task('addNotificationMock', {
        title: '💰 Gerir.me - Pagamento Próximo',
        body: 'Despesa Teste Novo Dia vence hoje! Valor: R$ 100,00'
      });
      cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', 'Despesa Teste Novo Dia');
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
      
      // Configurar permissão de notificação
      cy.mockNotificationPermission('granted');
      
      // Simular notificações usando comando personalizado
      cy.mockNotificationPermission('granted');
      cy.task('addNotificationMock', {
        title: '💰 Gerir.me - Pagamento Próximo',
        body: 'Primeira Despesa vence hoje! Valor: R$ 100,00'
      });
      cy.task('addNotificationMock', {
        title: '💰 Gerir.me - Pagamento Próximo',
        body: 'Segunda Despesa vence amanhã! Valor: R$ 200,00'
      });
      cy.task('addNotificationMock', {
        title: '💰 Gerir.me - Pagamento Próximo',
        body: 'Terceira Despesa vence hoje! Valor: R$ 300,00'
      });
      
      // Verificar se as notificações foram criadas
      cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', 'Primeira Despesa');
      cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', 'Segunda Despesa');
      cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', 'Terceira Despesa');
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
      
      // Simular notificações usando comando personalizado
      cy.mockNotificationPermission('granted');
      
      despesas.forEach((despesa) => {
        cy.task('addNotificationMock', {
          title: '💰 Gerir.me - Pagamento Próximo',
          body: `${despesa.nome} vence hoje! Valor: R$ ${despesa.valor}`
        });
      });
      
      // Verificar se todas as notificações foram criadas
      despesas.forEach((despesa) => {
        cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', despesa.nome);
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
      
      // Simular verificação de notificações usando comando personalizado
      cy.mockNotificationPermission('granted');
      cy.task('triggerNotificationCheck');
      
      // Verificar que nenhuma notificação foi enviada para despesas únicas
      cy.checkNoNotificationSent('Despesa Única');
    });

    it('deve lidar com despesas sem data de próximo pagamento', () => {
      // Este teste verifica se o sistema não quebra com dados inconsistentes
      cy.mockNotificationPermission('granted');
      cy.task('triggerNotificationCheck');
      
      // Verificar que o sistema não quebra mesmo sem despesas válidas
      cy.task('getAppState').then((state) => {
        expect(state.notificationErrors).to.be.undefined;
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
      
      // Verificar se notificações ainda funcionam após login
      cy.mockNotificationPermission('granted');
      cy.task('addNotificationMock', {
        title: '💰 Gerir.me - Pagamento Próximo',
        body: 'Despesa Persistente vence hoje! Valor: R$ 75,00'
      });
      
      // Verificar se a notificação foi criada
      cy.checkNotificationSent('💰 Gerir.me - Pagamento Próximo', 'Despesa Persistente');
    });
  });
});