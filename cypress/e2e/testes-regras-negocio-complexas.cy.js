describe('Testes de Regras de Negócio Complexas', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Regras de Unicidade e Duplicação', () => {
    beforeEach(() => {
      const email = `unicidade${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Unicidade');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve permitir despesas com mesmo nome mas categorias diferentes', () => {
      // Primeira despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Uber');
      cy.get('#expenseValue').type('25');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Segunda despesa com mesmo nome, categoria diferente
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Uber');
      cy.get('#expenseValue').type('30');
      cy.get('#expenseCategory').select('Alimentação'); // Uber Eats
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-16');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Ambas devem existir
      cy.get('#expenseList tbody tr').should('have.length', 2);
      cy.get('#monthlyTotal').should('contain', 'R$ 55,00');
      
      // Filtrar por categoria
      cy.get('#categoryFilter').select('Transporte');
      cy.get('#expenseList tbody tr').should('have.length', 1);
      cy.get('#expenseList').should('contain', 'R$ 25,00');
      
      cy.get('#categoryFilter').select('Alimentação');
      cy.get('#expenseList tbody tr').should('have.length', 1);
      cy.get('#expenseList').should('contain', 'R$ 30,00');
    });

    it('Deve permitir despesas idênticas em datas diferentes', () => {
      const despesa = {
        nome: 'Café da Manhã',
        valor: '15',
        categoria: 'Alimentação'
      };
      
      // Despesa na segunda-feira
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type(despesa.nome);
      cy.get('#expenseValue').type(despesa.valor);
      cy.get('#expenseCategory').select(despesa.categoria);
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-13'); // Segunda
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa na terça-feira
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type(despesa.nome);
      cy.get('#expenseValue').type(despesa.valor);
      cy.get('#expenseCategory').select(despesa.categoria);
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-14'); // Terça
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa na quarta-feira
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type(despesa.nome);
      cy.get('#expenseValue').type(despesa.valor);
      cy.get('#expenseCategory').select(despesa.categoria);
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15'); // Quarta
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Todas devem existir
      cy.get('#expenseList tbody tr').should('have.length', 3);
      cy.get('#monthlyTotal').should('contain', 'R$ 45,00');
    });

    it('Deve permitir mesmo usuário ter despesas similares a outros usuários', () => {
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Aluguel');
      cy.get('#expenseValue').type('1000');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-05');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Logout e criar segundo usuário
      cy.get('#logoutBtn').click();
      
      const email2 = `segundo${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Segundo Usuario');
      cy.get('#registerEmail').type(email2);
      cy.get('#registerPassword').type('Teste456');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Adicionar despesa idêntica
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Aluguel');
      cy.get('#expenseValue').type('1000');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-05');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Deve permitir (segregação por usuário)
      cy.get('#expenseList tbody tr').should('have.length', 1);
      cy.get('#monthlyTotal').should('contain', 'R$ 1.000,00');
    });
  });

  describe('Regras de Cálculo Complexas', () => {
    beforeEach(() => {
      const email = `calculo${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Calculo');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve calcular corretamente mix de despesas com diferentes tipos', () => {
      // Despesa única do mês atual
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Compra Única');
      cy.get('#expenseValue').type('150');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa mensal
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Assinatura Mensal');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-10');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa anual (1200 / 12 = 100)
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Seguro Anual');
      cy.get('#expenseValue').type('1200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('anual');
      cy.get('#expenseDate').type('2025-06-01');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Total: 150 (única) + 50 (mensal) + 100 (anual/12) = 300
      cy.get('#monthlyTotal').should('contain', 'R$ 300,00');
    });

    it('Deve excluir despesas únicas de meses diferentes do cálculo', () => {
      const hoje = new Date();
      const mesAtual = hoje.getMonth() + 1;
      const anoAtual = hoje.getFullYear();
      const mesAnterior = mesAtual === 1 ? 12 : mesAtual - 1;
      const anoAnterior = mesAtual === 1 ? anoAtual - 1 : anoAtual;
      
      // Despesa única do mês atual
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Mês Atual');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type(`${anoAtual}-${mesAtual.toString().padStart(2, '0')}-15`);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa única do mês anterior
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Mês Anterior');
      cy.get('#expenseValue').type('200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type(`${anoAnterior}-${mesAnterior.toString().padStart(2, '0')}-15`);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa mensal (sempre conta)
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Mensal');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(`${anoAtual}-${mesAtual.toString().padStart(2, '0')}-10`);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Total deve ser apenas: 100 (única atual) + 50 (mensal) = 150
      // Não deve incluir os 200 do mês anterior
      cy.get('#monthlyTotal').should('contain', 'R$ 150,00');
    });

    it('Deve recalcular total ao editar valores', () => {
      // Adicionar despesas iniciais
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa A');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa B');
      cy.get('#expenseValue').type('200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-10');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Total inicial: 100 + 200 = 300
      cy.get('#monthlyTotal').should('contain', 'R$ 300,00');
      
      // Editar primeira despesa
      cy.get('.edit-btn').first().click();
      cy.get('#expenseValue').clear().type('150');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Novo total: 150 + 200 = 350
      cy.get('#monthlyTotal').should('contain', 'R$ 350,00');
      
      // Editar segunda despesa
      cy.get('.edit-btn').eq(1).click();
      cy.get('#expenseValue').clear().type('250');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Novo total: 150 + 250 = 400
      cy.get('#monthlyTotal').should('contain', 'R$ 400,00');
    });

    it('Deve recalcular total ao alterar tipo de despesa', () => {
      // Adicionar despesa anual
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Variável');
      cy.get('#expenseValue').type('1200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('anual');
      cy.get('#expenseDate').type('2025-06-01');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Total inicial: 1200 / 12 = 100
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
      
      // Alterar para mensal
      cy.get('.edit-btn').first().click();
      cy.get('#expenseType').select('mensal');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Novo total: 1200 (valor integral)
      cy.get('#monthlyTotal').should('contain', 'R$ 1.200,00');
      
      // Alterar para única
      cy.get('.edit-btn').first().click();
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').clear().type('2025-01-20'); // Mês atual
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Continua 1200 (única do mês atual)
      cy.get('#monthlyTotal').should('contain', 'R$ 1.200,00');
    });
  });

  describe('Regras de Validação de Data Complexas', () => {
    beforeEach(() => {
      const email = `data${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Data');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve validar datas de despesas recorrentes corretamente', () => {
      // Despesa mensal com data futura
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Mensalidade Futura');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-12-31');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Deve aparecer no calendário
      cy.get('#calendar').should('contain', 'Mensalidade');
      
      // Deve contar no total mensal
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
      
      // Despesa anual com data passada
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Seguro Passado');
      cy.get('#expenseValue').type('1200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('anual');
      cy.get('#expenseDate').type('2024-06-01');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Deve aparecer no calendário
      cy.get('#calendar').should('contain', 'Seguro');
      
      // Total: 100 + (1200/12) = 200
      cy.get('#monthlyTotal').should('contain', 'R$ 200,00');
    });

    it('Deve lidar com anos bissextos corretamente', () => {
      // 2024 é bissexto, 29 de fevereiro existe
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Bissexto');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2024-02-29');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Deve aceitar
      cy.get('#expenseList').should('contain', 'Despesa Bissexto');
      
      // 2023 não é bissexto, mas vamos testar 28 de fevereiro
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Fevereiro Normal');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2023-02-28');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Deve aceitar
      cy.get('#expenseList').should('contain', 'Fevereiro Normal');
    });

    it('Deve validar últimos dias de cada mês', () => {
      const ultimosDias = [
        { mes: '01', dia: '31', nome: 'Janeiro' },
        { mes: '02', dia: '28', nome: 'Fevereiro' },
        { mes: '03', dia: '31', nome: 'Março' },
        { mes: '04', dia: '30', nome: 'Abril' },
        { mes: '05', dia: '31', nome: 'Maio' },
        { mes: '06', dia: '30', nome: 'Junho' }
      ];
      
      ultimosDias.forEach((item, index) => {
        cy.get('#addExpenseBtn').click();
        cy.get('#expenseName').type(`Último ${item.nome}`);
        cy.get('#expenseValue').type('10');
        cy.get('#expenseCategory').select('Outros');
        cy.get('#expenseType').select('unica');
        cy.get('#expenseDate').type(`2025-${item.mes}-${item.dia}`);
        cy.get('#saveExpenseBtn').click();
        cy.wait(300);
        
        cy.get('#expenseList').should('contain', `Último ${item.nome}`);
      });
      
      // Todas devem ter sido aceitas
      cy.get('#expenseList tbody tr').should('have.length', 6);
    });
  });

  describe('Regras de Notificação Complexas', () => {
    beforeEach(() => {
      const email = `notif${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Notificacao');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve mostrar notificações apenas para despesas recorrentes próximas', () => {
      const hoje = new Date();
      
      // Despesa vencendo hoje
      const dataHoje = hoje.toISOString().split('T')[0];
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Vence Hoje');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(dataHoje);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa vencendo em 2 dias
      const em2Dias = new Date(hoje);
      em2Dias.setDate(hoje.getDate() + 2);
      const dataEm2Dias = em2Dias.toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Vence Em 2 Dias');
      cy.get('#expenseValue').type('200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('anual');
      cy.get('#expenseDate').type(dataEm2Dias);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa vencendo em 5 dias (não deve notificar)
      const em5Dias = new Date(hoje);
      em5Dias.setDate(hoje.getDate() + 5);
      const dataEm5Dias = em5Dias.toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Vence Em 5 Dias');
      cy.get('#expenseValue').type('300');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(dataEm5Dias);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa única (não deve notificar)
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Única Hoje');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type(dataHoje);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Verificar notificações
      cy.get('.notification').should('contain', 'Vence Hoje');
      cy.get('.notification').should('contain', 'Vence Em 2 Dias');
      cy.get('.notification').should('not.contain', 'Vence Em 5 Dias');
      cy.get('.notification').should('not.contain', 'Única Hoje');
    });

    it('Deve atualizar notificações ao editar datas', () => {
      const hoje = new Date();
      const em10Dias = new Date(hoje);
      em10Dias.setDate(hoje.getDate() + 10);
      const dataEm10Dias = em10Dias.toISOString().split('T')[0];
      
      // Adicionar despesa longe (sem notificação)
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Distante');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(dataEm10Dias);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Não deve ter notificação
      cy.get('.notification').should('not.contain', 'Despesa Distante');
      
      // Editar para data próxima
      const em1Dia = new Date(hoje);
      em1Dia.setDate(hoje.getDate() + 1);
      const dataEm1Dia = em1Dia.toISOString().split('T')[0];
      
      cy.get('.edit-btn').first().click();
      cy.get('#expenseDate').clear().type(dataEm1Dia);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Agora deve ter notificação
      cy.get('.notification').should('contain', 'Despesa Distante');
    });

    it('Deve remover notificações ao alterar tipo para única', () => {
      const hoje = new Date();
      const em2Dias = new Date(hoje);
      em2Dias.setDate(hoje.getDate() + 2);
      const dataEm2Dias = em2Dias.toISOString().split('T')[0];
      
      // Adicionar despesa mensal próxima
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Mensal Próxima');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(dataEm2Dias);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Deve ter notificação
      cy.get('.notification').should('contain', 'Mensal Próxima');
      
      // Alterar para única
      cy.get('.edit-btn').first().click();
      cy.get('#expenseType').select('unica');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Não deve mais ter notificação
      cy.get('.notification').should('not.contain', 'Mensal Próxima');
    });
  });

  describe('Regras de Filtro e Busca Avançadas', () => {
    beforeEach(() => {
      const email = `filtro${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Filtro');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Adicionar conjunto diverso de despesas
      const despesas = [
        { nome: 'Almoço Executivo', categoria: 'Alimentação', valor: '25', tipo: 'unica' },
        { nome: 'Uber Pool', categoria: 'Transporte', valor: '15', tipo: 'unica' },
        { nome: 'Consulta Cardiologista', categoria: 'Saúde', valor: '200', tipo: 'unica' },
        { nome: 'Academia Mensal', categoria: 'Saúde', valor: '80', tipo: 'mensal' },
        { nome: 'Netflix', categoria: 'Outros', valor: '30', tipo: 'mensal' },
        { nome: 'Seguro Vida', categoria: 'Outros', valor: '600', tipo: 'anual' }
      ];
      
      despesas.forEach((despesa, index) => {
        cy.get('#addExpenseBtn').click();
        cy.get('#expenseName').type(despesa.nome);
        cy.get('#expenseValue').type(despesa.valor);
        cy.get('#expenseCategory').select(despesa.categoria);
        cy.get('#expenseType').select(despesa.tipo);
        cy.get('#expenseDate').type('2025-01-15');
        cy.get('#saveExpenseBtn').click();
        cy.wait(300);
      });
    });

    it('Deve filtrar e calcular total correto por categoria', () => {
      // Filtrar Saúde: Consulta (200) + Academia (80) = 280
      cy.get('#categoryFilter').select('Saúde');
      cy.get('#expenseList tbody tr').should('have.length', 2);
      cy.get('#monthlyTotal').should('contain', 'R$ 280,00');
      
      // Filtrar Alimentação: Almoço (25)
      cy.get('#categoryFilter').select('Alimentação');
      cy.get('#expenseList tbody tr').should('have.length', 1);
      cy.get('#monthlyTotal').should('contain', 'R$ 25,00');
      
      // Filtrar Outros: Netflix (30) + Seguro (600/12 = 50) = 80
      cy.get('#categoryFilter').select('Outros');
      cy.get('#expenseList tbody tr').should('have.length', 2);
      cy.get('#monthlyTotal').should('contain', 'R$ 80,00');
    });

    it('Deve manter filtro ao adicionar despesa da mesma categoria', () => {
      // Filtrar por Transporte
      cy.get('#categoryFilter').select('Transporte');
      cy.get('#expenseList tbody tr').should('have.length', 1);
      cy.get('#expenseList').should('contain', 'Uber Pool');
      
      // Adicionar nova despesa de Transporte
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Gasolina');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-20');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Deve mostrar ambas e manter filtro
      cy.get('#expenseList tbody tr').should('have.length', 2);
      cy.get('#expenseList').should('contain', 'Uber Pool');
      cy.get('#expenseList').should('contain', 'Gasolina');
      cy.get('#monthlyTotal').should('contain', 'R$ 115,00');
    });

    it('Deve ocultar despesa ao alterar categoria fora do filtro', () => {
      // Filtrar por Alimentação
      cy.get('#categoryFilter').select('Alimentação');
      cy.get('#expenseList tbody tr').should('have.length', 1);
      cy.get('#expenseList').should('contain', 'Almoço Executivo');
      
      // Editar despesa para outra categoria
      cy.get('.edit-btn').first().click();
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Deve desaparecer da lista filtrada
      cy.get('#expenseList tbody tr').should('have.length', 0);
      cy.get('.empty-message').should('be.visible');
      cy.get('#monthlyTotal').should('contain', 'R$ 0,00');
      
      // Limpar filtro para ver a despesa
      cy.get('#categoryFilter').select('');
      cy.get('#expenseList').should('contain', 'Almoço Executivo');
    });

    it('Deve filtrar corretamente despesas com tipos mistos', () => {
      // Verificar total geral primeiro
      // Almoço (25) + Uber (15) + Consulta (200) + Academia (80) + Netflix (30) + Seguro (50) = 400
      cy.get('#monthlyTotal').should('contain', 'R$ 400,00');
      
      // Adicionar mais despesas da mesma categoria com tipos diferentes
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Plano Saúde');
      cy.get('#expenseValue').type('300');
      cy.get('#expenseCategory').select('Saúde');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-05');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Exame Anual');
      cy.get('#expenseValue').type('1200');
      cy.get('#expenseCategory').select('Saúde');
      cy.get('#expenseType').select('anual');
      cy.get('#expenseDate').type('2025-08-01');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Filtrar Saúde: Consulta (200) + Academia (80) + Plano (300) + Exame (100) = 680
      cy.get('#categoryFilter').select('Saúde');
      cy.get('#expenseList tbody tr').should('have.length', 4);
      cy.get('#monthlyTotal').should('contain', 'R$ 680,00');
      
      // Verificar que todos os tipos estão presentes
      cy.get('#expenseList').should('contain', 'Consulta'); // única
      cy.get('#expenseList').should('contain', 'Academia'); // mensal
      cy.get('#expenseList').should('contain', 'Plano'); // mensal
      cy.get('#expenseList').should('contain', 'Exame'); // anual
    });
  });

  describe('Regras de Persistência e Integridade', () => {
    it('Deve manter integridade após operações complexas', () => {
      const email = `integridade${Date.now()}@teste.com`;
      
      // Cadastro
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Integridade');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Operação complexa: adicionar, editar, remover, adicionar novamente
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Teste');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Editar
      cy.get('.edit-btn').first().click();
      cy.get('#expenseName').clear().type('Despesa Editada');
      cy.get('#expenseValue').clear().type('150');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Verificar estado
      cy.get('#expenseList').should('contain', 'Despesa Editada');
      cy.get('#expenseList').should('contain', 'R$ 150,00');
      cy.get('#monthlyTotal').should('contain', 'R$ 150,00');
      
      // Remover
      cy.get('.delete-btn').first().click();
      cy.get('#confirmDeleteBtn').click();
      cy.wait(500);
      
      // Verificar remoção
      cy.get('.empty-message').should('be.visible');
      cy.get('#monthlyTotal').should('contain', 'R$ 0,00');
      
      // Adicionar novamente com mesmo nome
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Editada'); // Mesmo nome
      cy.get('#expenseValue').type('200');
      cy.get('#expenseCategory').select('Saúde');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-10');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Deve permitir (não há restrição de nome)
      cy.get('#expenseList').should('contain', 'Despesa Editada');
      cy.get('#expenseList').should('contain', 'R$ 200,00');
      cy.get('#monthlyTotal').should('contain', 'R$ 200,00');
      
      // Recarregar e verificar persistência
      cy.reload();
      cy.get('#expenseList').should('contain', 'Despesa Editada');
      cy.get('#expenseList').should('contain', 'R$ 200,00');
      cy.get('#monthlyTotal').should('contain', 'R$ 200,00');
    });
  });
});