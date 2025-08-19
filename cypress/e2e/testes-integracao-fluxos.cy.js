describe('Testes de Integração - Fluxos Completos de Usuário', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Fluxo Completo: Primeiro Uso da Aplicação', () => {
    it('Deve guiar usuário do cadastro até primeira despesa', () => {
      const email = `primeiro${Date.now()}@teste.com`;
      
      // Estado inicial - sem usuário
      cy.get('#loginForm').should('be.visible');
      cy.get('#dashboard').should('not.exist');
      
      // Cadastro
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Primeiro Usuario');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      
      // Dashboard vazio
      cy.get('#dashboard').should('be.visible');
      cy.get('#monthlyTotal').should('contain', 'R$ 0,00');
      cy.get('.empty-message').should('contain', 'Nenhuma despesa');
      
      // Primeira despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Primeira Compra');
      cy.get('#expenseValue').type('25.50');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      // Verificar resultado
      cy.get('#monthlyTotal').should('contain', 'R$ 25,50');
      cy.get('#expenseList').should('contain', 'Primeira Compra');
      cy.get('.empty-message').should('not.exist');
      cy.get('.toast.success').should('contain', 'sucesso');
    });

    it('Deve mostrar onboarding para novo usuário', () => {
      const email = `onboarding${Date.now()}@teste.com`;
      
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Novo');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Senha123');
      cy.get('#registerForm > .btn-primary').click();
      
      // Deve mostrar dicas ou tutorial
      cy.get('.welcome-message').should('be.visible');
      cy.get('.welcome-message').should('contain', 'Bem-vindo');
      
      // Deve destacar botão de adicionar despesa
      cy.get('#addExpenseBtn').should('have.class', 'highlight');
    });
  });

  describe('Fluxo Completo: Gerenciamento Mensal de Despesas', () => {
    beforeEach(() => {
      const email = `mensal${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Mensal');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve gerenciar orçamento mensal completo', () => {
      // Adicionar despesas fixas mensais
      const despesasFixas = [
        { nome: 'Aluguel', valor: '1200', categoria: 'Outros', tipo: 'mensal' },
        { nome: 'Internet', valor: '100', categoria: 'Outros', tipo: 'mensal' },
        { nome: 'Energia', valor: '150', categoria: 'Outros', tipo: 'mensal' }
      ];
      
      despesasFixas.forEach(despesa => {
        cy.get('#addExpenseBtn').click();
        cy.get('#expenseName').type(despesa.nome);
        cy.get('#expenseValue').type(despesa.valor);
        cy.get('#expenseCategory').select(despesa.categoria);
        cy.get('#expenseType').select(despesa.tipo);
        cy.get('#expenseDate').type('2025-01-05');
        cy.get('#saveExpenseBtn').click();
        cy.wait(300);
      });
      
      // Verificar total das fixas
      cy.get('#monthlyTotal').should('contain', 'R$ 1.450,00');
      
      // Adicionar despesas variáveis
      const despesasVariaveis = [
        { nome: 'Supermercado', valor: '300', categoria: 'Alimentação' },
        { nome: 'Gasolina', valor: '200', categoria: 'Transporte' },
        { nome: 'Farmácia', valor: '80', categoria: 'Saúde' }
      ];
      
      despesasVariaveis.forEach(despesa => {
        cy.get('#addExpenseBtn').click();
        cy.get('#expenseName').type(despesa.nome);
        cy.get('#expenseValue').type(despesa.valor);
        cy.get('#expenseCategory').select(despesa.categoria);
        cy.get('#expenseType').select('unica');
        cy.get('#expenseDate').type('2025-01-15');
        cy.get('#saveExpenseBtn').click();
        cy.wait(300);
      });
      
      // Total final
      cy.get('#monthlyTotal').should('contain', 'R$ 2.030,00');
      
      // Verificar categorização
      cy.get('#categoryFilter').select('Alimentação');
      cy.get('#expenseList tbody tr').should('have.length', 1);
      cy.get('#monthlyTotal').should('contain', 'R$ 300,00');
      
      cy.get('#categoryFilter').select('Transporte');
      cy.get('#expenseList tbody tr').should('have.length', 1);
      cy.get('#monthlyTotal').should('contain', 'R$ 200,00');
      
      // Voltar para todas
      cy.get('#categoryFilter').select('');
      cy.get('#expenseList tbody tr').should('have.length', 6);
      cy.get('#monthlyTotal').should('contain', 'R$ 2.030,00');
    });

    it('Deve ajustar orçamento durante o mês', () => {
      // Adicionar despesa inicial
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Plano Original');
      cy.get('#expenseValue').type('500');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-10');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('#monthlyTotal').should('contain', 'R$ 500,00');
      
      // Ajustar valor
      cy.get('.edit-btn').first().click();
      cy.get('#expenseValue').clear().type('600');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('#monthlyTotal').should('contain', 'R$ 600,00');
      
      // Adicionar despesa extra
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Extra');
      cy.get('#expenseValue').type('150');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-20');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('#monthlyTotal').should('contain', 'R$ 750,00');
      
      // Remover despesa desnecessária
      cy.get('.delete-btn').eq(1).click();
      cy.get('#confirmDeleteBtn').click();
      cy.wait(500);
      
      cy.get('#monthlyTotal').should('contain', 'R$ 600,00');
      cy.get('#expenseList tbody tr').should('have.length', 1);
    });
  });

  describe('Fluxo Completo: Planejamento Anual', () => {
    beforeEach(() => {
      const email = `anual${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Anual');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve planejar despesas anuais e calcular impacto mensal', () => {
      // Adicionar despesas anuais
      const despesasAnuais = [
        { nome: 'IPVA', valor: '1200', data: '2025-03-15' },
        { nome: 'Seguro Carro', valor: '2400', data: '2025-06-01' },
        { nome: 'IPTU', valor: '1800', data: '2025-01-31' }
      ];
      
      despesasAnuais.forEach(despesa => {
        cy.get('#addExpenseBtn').click();
        cy.get('#expenseName').type(despesa.nome);
        cy.get('#expenseValue').type(despesa.valor);
        cy.get('#expenseCategory').select('Outros');
        cy.get('#expenseType').select('anual');
        cy.get('#expenseDate').type(despesa.data);
        cy.get('#saveExpenseBtn').click();
        cy.wait(300);
      });
      
      // Total mensal deve ser (1200 + 2400 + 1800) / 12 = 450
      cy.get('#monthlyTotal').should('contain', 'R$ 450,00');
      
      // Verificar no calendário
      cy.get('#calendar').should('contain', 'IPVA');
      cy.get('#calendar').should('contain', 'Seguro');
      cy.get('#calendar').should('contain', 'IPTU');
      
      // Adicionar despesa mensal para ver soma
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Aluguel');
      cy.get('#expenseValue').type('1000');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-05');
      cy.get('#saveExpenseBtn').click();
      
      // Total deve ser 450 + 1000 = 1450
      cy.get('#monthlyTotal').should('contain', 'R$ 1.450,00');
    });

    it('Deve mostrar notificações de vencimento para despesas anuais', () => {
      const hoje = new Date();
      const em3Dias = new Date(hoje);
      em3Dias.setDate(hoje.getDate() + 3);
      const dataVencimento = em3Dias.toISOString().split('T')[0];
      
      // Adicionar despesa anual vencendo em 3 dias
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Seguro Vencendo');
      cy.get('#expenseValue').type('1200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('anual');
      cy.get('#expenseDate').type(dataVencimento);
      cy.get('#saveExpenseBtn').click();
      
      // Deve mostrar notificação
      cy.get('.notification').should('be.visible');
      cy.get('.notification').should('contain', 'Seguro Vencendo');
      cy.get('.notification').should('contain', '3 dias');
    });
  });

  describe('Fluxo Completo: Múltiplos Usuários', () => {
    it('Deve manter segregação total entre usuários', () => {
      // Primeiro usuário
      const email1 = `usuario1${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Um');
      cy.get('#registerEmail').type(email1);
      cy.get('#registerPassword').type('Senha123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Adicionar despesas do usuário 1
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Usuario 1');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
      
      // Logout
      cy.get('#logoutBtn').click();
      
      // Segundo usuário
      const email2 = `usuario2${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Dois');
      cy.get('#registerEmail').type(email2);
      cy.get('#registerPassword').type('Senha456');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Dashboard deve estar vazio
      cy.get('#monthlyTotal').should('contain', 'R$ 0,00');
      cy.get('.empty-message').should('be.visible');
      cy.get('#expenseList').should('not.contain', 'Despesa Usuario 1');
      
      // Adicionar despesas do usuário 2
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Usuario 2');
      cy.get('#expenseValue').type('200');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-10');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('#monthlyTotal').should('contain', 'R$ 200,00');
      cy.get('#expenseList').should('contain', 'Despesa Usuario 2');
      cy.get('#expenseList').should('not.contain', 'Despesa Usuario 1');
      
      // Logout e login do primeiro usuário
      cy.get('#logoutBtn').click();
      cy.get('#loginEmail').type(email1);
      cy.get('#loginPassword').type('Senha123');
      cy.get('#loginForm > .btn-primary').click();
      cy.wait(1000);
      
      // Deve ver apenas suas despesas
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
      cy.get('#expenseList').should('contain', 'Despesa Usuario 1');
      cy.get('#expenseList').should('not.contain', 'Despesa Usuario 2');
    });
  });

  describe('Fluxo Completo: Recuperação de Sessão', () => {
    it('Deve manter sessão após recarregar página', () => {
      const email = `sessao${Date.now()}@teste.com`;
      
      // Login
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Sessao');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Sessao');
      cy.get('#expenseValue').type('150');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Alterar tema
      cy.get('#themeToggle').click();
      cy.get('body').should('have.class', 'dark-theme');
      
      // Aplicar filtro
      cy.get('#categoryFilter').select('Outros');
      
      // Recarregar página
      cy.reload();
      
      // Verificar persistência
      cy.get('#dashboard').should('be.visible'); // Ainda logado
      cy.get('#monthlyTotal').should('contain', 'R$ 150,00');
      cy.get('#expenseList').should('contain', 'Despesa Sessao');
      cy.get('body').should('have.class', 'dark-theme');
      cy.get('#categoryFilter').should('have.value', 'Outros');
    });

    it('Deve redirecionar para login após logout', () => {
      const email = `logout${Date.now()}@teste.com`;
      
      // Login
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Logout');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Verificar dashboard
      cy.get('#dashboard').should('be.visible');
      cy.get('#loginForm').should('not.exist');
      
      // Logout
      cy.get('#logoutBtn').click();
      
      // Deve voltar para login
      cy.get('#loginForm').should('be.visible');
      cy.get('#dashboard').should('not.exist');
      
      // Tentar acessar dashboard diretamente
      cy.visit('/#dashboard');
      cy.get('#loginForm').should('be.visible');
      cy.get('#dashboard').should('not.exist');
    });
  });

  describe('Fluxo Completo: Cenários de Erro e Recuperação', () => {
    beforeEach(() => {
      const email = `erro${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Erro');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve recuperar de erro ao salvar despesa', () => {
      // Simular erro (campo obrigatório vazio)
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Erro');
      // Não preencher valor
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      // Deve mostrar erro
      cy.get('.toast.error').should('be.visible');
      cy.get('#expenseModal').should('be.visible'); // Modal não fecha
      
      // Corrigir erro
      cy.get('#expenseValue').type('100');
      cy.get('#saveExpenseBtn').click();
      
      // Deve salvar com sucesso
      cy.get('.toast.success').should('be.visible');
      cy.get('#expenseModal').should('not.be.visible');
      cy.get('#expenseList').should('contain', 'Despesa Erro');
    });

    it('Deve manter dados do formulário após erro', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Nome Longo Para Teste');
      cy.get('#expenseValue').type('250.75');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('mensal');
      // Não preencher data obrigatória
      cy.get('#saveExpenseBtn').click();
      
      // Erro deve aparecer
      cy.get('.toast.error').should('be.visible');
      
      // Dados devem permanecer
      cy.get('#expenseName').should('have.value', 'Nome Longo Para Teste');
      cy.get('#expenseValue').should('have.value', '250.75');
      cy.get('#expenseCategory').should('have.value', 'Alimentação');
      cy.get('#expenseType').should('have.value', 'mensal');
      
      // Corrigir e salvar
      cy.get('#expenseDate').type('2025-01-20');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast.success').should('be.visible');
      cy.get('#expenseList').should('contain', 'Nome Longo Para Teste');
    });

    it('Deve recuperar de tentativa de edição cancelada', () => {
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Original');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Iniciar edição
      cy.get('.edit-btn').first().click();
      cy.get('#expenseName').clear().type('Nome Alterado');
      cy.get('#expenseValue').clear().type('999');
      
      // Cancelar
      cy.get('#cancelExpenseBtn').click();
      
      // Dados originais devem permanecer
      cy.get('#expenseList').should('contain', 'Despesa Original');
      cy.get('#expenseList').should('contain', 'R$ 100,00');
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
      
      // Tentar editar novamente
      cy.get('.edit-btn').first().click();
      cy.get('#expenseName').should('have.value', 'Despesa Original');
      cy.get('#expenseValue').should('have.value', '100');
    });
  });

  describe('Fluxo Completo: Performance com Muitos Dados', () => {
    beforeEach(() => {
      const email = `performance${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Performance');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve lidar com 50 despesas sem degradação', () => {
      // Adicionar 50 despesas rapidamente
      for (let i = 1; i <= 50; i++) {
        cy.get('#addExpenseBtn').click();
        cy.get('#expenseName').type(`Despesa ${i}`);
        cy.get('#expenseValue').type((i * 10).toString());
        cy.get('#expenseCategory').select(i % 2 === 0 ? 'Alimentação' : 'Transporte');
        cy.get('#expenseType').select(i % 3 === 0 ? 'mensal' : 'unica');
        cy.get('#expenseDate').type('2025-01-15');
        cy.get('#saveExpenseBtn').click();
        
        // Não esperar muito para simular uso rápido
        if (i % 10 === 0) {
          cy.wait(200);
        }
      }
      
      // Verificar que todas foram adicionadas
      cy.get('#expenseList tbody tr').should('have.length', 50);
      
      // Testar filtros com muitos dados
      cy.get('#categoryFilter').select('Alimentação');
      cy.get('#expenseList tbody tr').should('have.length', 25);
      
      cy.get('#categoryFilter').select('Transporte');
      cy.get('#expenseList tbody tr').should('have.length', 25);
      
      // Voltar para todas
      cy.get('#categoryFilter').select('');
      cy.get('#expenseList tbody tr').should('have.length', 50);
      
      // Testar edição com muitos dados
      cy.get('.edit-btn').first().click();
      cy.get('#expenseName').clear().type('Despesa Editada');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Despesa Editada');
      
      // Testar remoção
      cy.get('.delete-btn').first().click();
      cy.get('#confirmDeleteBtn').click();
      
      cy.get('#expenseList tbody tr').should('have.length', 49);
      cy.get('#expenseList').should('not.contain', 'Despesa Editada');
    });
  });
});