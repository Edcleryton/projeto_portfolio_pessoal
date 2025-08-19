describe('Testes Funcionais - Cenários Avançados das Regras de Negócio', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('RN-USU-001: Unicidade de E-mail - Cenários Avançados', () => {
    it('Deve rejeitar cadastro com e-mail já existente (case insensitive)', () => {
      const baseEmail = `teste${Date.now()}@exemplo.com`;
      
      // Cadastrar primeiro usuário
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Primeiro Usuario');
      cy.get('#registerEmail').type(baseEmail);
      cy.get('#registerPassword').type('Senha123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Fazer logout
      cy.get('#logoutBtn').click();
      
      // Tentar cadastrar com mesmo e-mail em maiúscula
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Segundo Usuario');
      cy.get('#registerEmail').type(baseEmail.toUpperCase());
      cy.get('#registerPassword').type('Senha456');
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('.toast').should('contain.text', 'já existe');
    });

    it('Deve rejeitar cadastro com e-mail com espaços extras', () => {
      const email = `espacos${Date.now()}@teste.com`;
      
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Espacos');
      cy.get('#registerEmail').type(`  ${email}  `);
      cy.get('#registerPassword').type('Senha123');
      cy.get('#registerForm > .btn-primary').click();
      
      // Deve trimmar ou mostrar erro
      cy.get('.toast').should('be.visible');
    });

    it('Deve validar formato de e-mail com domínios especiais', () => {
      const emailsValidos = [
        `teste${Date.now()}@gmail.com`,
        `user.name${Date.now()}@empresa.com.br`,
        `test+tag${Date.now()}@domain.co.uk`
      ];
      
      emailsValidos.forEach((email, index) => {
        cy.get('#showRegister').click();
        cy.get('#registerName').type(`Usuario ${index}`);
        cy.get('#registerEmail').type(email);
        cy.get('#registerPassword').type('Senha123');
        cy.get('#registerForm > .btn-primary').click();
        cy.wait(1000);
        
        cy.get('#expenseList').should('be.visible');
        cy.get('#logoutBtn').click();
      });
    });
  });

  describe('RN-USU-002: Política de Senha - Cenários Detalhados', () => {
    it('Deve validar senha com exatamente 6 caracteres', () => {
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Senha');
      cy.get('#registerEmail').type(`senha6${Date.now()}@teste.com`);
      cy.get('#registerPassword').type('Abc123'); // Exatamente 6 caracteres
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('#expenseList').should('be.visible');
    });

    it('Deve rejeitar senha com 5 caracteres', () => {
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Senha');
      cy.get('#registerEmail').type(`senha5${Date.now()}@teste.com`);
      cy.get('#registerPassword').type('Abc12'); // 5 caracteres
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('.toast').should('contain.text', 'senha');
    });

    it('Deve aceitar senha com caracteres especiais', () => {
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Especial');
      cy.get('#registerEmail').type(`especial${Date.now()}@teste.com`);
      cy.get('#registerPassword').type('A@b#1$'); // Com caracteres especiais
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('#expenseList').should('be.visible');
    });

    it('Deve aceitar senha apenas com letras e números', () => {
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Simples');
      cy.get('#registerEmail').type(`simples${Date.now()}@teste.com`);
      cy.get('#registerPassword').type('Abc123'); // Apenas letras e números
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('#expenseList').should('be.visible');
    });
  });

  describe('RN-USU-003: Bloqueio por Tentativas - Cenários Completos', () => {
    it('Deve bloquear após 3 tentativas de login incorretas', () => {
      const email = `bloqueio${Date.now()}@teste.com`;
      
      // Cadastrar usuário
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Bloqueio');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('SenhaCorreta123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      cy.get('#logoutBtn').click();
      
      // 3 tentativas com senha errada
      for (let i = 1; i <= 3; i++) {
        cy.get('#loginEmail').type(email);
        cy.get('#loginPassword').type('SenhaErrada');
        cy.get('#loginForm > .btn-primary').click();
        cy.wait(500);
        
        if (i < 3) {
          cy.get('.toast').should('contain.text', 'incorreta');
          cy.get('#loginEmail').clear();
          cy.get('#loginPassword').clear();
        }
      }
      
      // Deve mostrar bloqueio
      cy.get('.toast').should('contain.text', 'bloqueado');
      
      // Tentar login com senha correta (deve estar bloqueado)
      cy.get('#loginEmail').clear().type(email);
      cy.get('#loginPassword').clear().type('SenhaCorreta123');
      cy.get('#loginForm > .btn-primary').click();
      
      cy.get('.toast').should('contain.text', 'bloqueado');
    });

    it('Deve resetar contador após login bem-sucedido', () => {
      const email = `reset${Date.now()}@teste.com`;
      
      // Cadastrar usuário
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Reset');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('SenhaCorreta123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      cy.get('#logoutBtn').click();
      
      // 2 tentativas erradas
      for (let i = 1; i <= 2; i++) {
        cy.get('#loginEmail').type(email);
        cy.get('#loginPassword').type('SenhaErrada');
        cy.get('#loginForm > .btn-primary').click();
        cy.wait(500);
        cy.get('#loginEmail').clear();
        cy.get('#loginPassword').clear();
      }
      
      // Login correto
      cy.get('#loginEmail').type(email);
      cy.get('#loginPassword').type('SenhaCorreta123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#expenseList').should('be.visible');
      cy.get('#logoutBtn').click();
      
      // Mais 2 tentativas erradas (contador deve ter resetado)
      for (let i = 1; i <= 2; i++) {
        cy.get('#loginEmail').type(email);
        cy.get('#loginPassword').type('SenhaErrada');
        cy.get('#loginForm > .btn-primary').click();
        cy.wait(500);
        cy.get('#loginEmail').clear();
        cy.get('#loginPassword').clear();
      }
      
      // Deve ainda permitir mais uma tentativa
      cy.get('#loginEmail').type(email);
      cy.get('#loginPassword').type('SenhaCorreta123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#expenseList').should('be.visible');
    });
  });

  describe('RN-USU-005: Segregação de Dados - Cenários de Isolamento', () => {
    it('Deve mostrar apenas dados do usuário logado', () => {
      const email1 = `user1${Date.now()}@teste.com`;
      const email2 = `user2${Date.now()}@teste.com`;
      
      // Cadastrar primeiro usuário e adicionar despesa
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario 1');
      cy.get('#registerEmail').type(email1);
      cy.get('#registerPassword').type('Senha123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Usuario 1');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('#logoutBtn').click();
      
      // Cadastrar segundo usuário e adicionar despesa
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario 2');
      cy.get('#registerEmail').type(email2);
      cy.get('#registerPassword').type('Senha123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Usuario 2');
      cy.get('#expenseValue').type('200');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Verificar que só vê suas próprias despesas
      cy.get('#expenseList').should('contain', 'Despesa Usuario 2');
      cy.get('#expenseList').should('not.contain', 'Despesa Usuario 1');
      cy.get('#monthlyTotal').should('contain', 'R$ 200,00');
      
      cy.get('#logoutBtn').click();
      
      // Login com primeiro usuário
      cy.get('#loginEmail').type(email1);
      cy.get('#loginPassword').type('Senha123');
      cy.get('#loginForm > .btn-primary').click();
      
      // Verificar que só vê suas próprias despesas
      cy.get('#expenseList').should('contain', 'Despesa Usuario 1');
      cy.get('#expenseList').should('not.contain', 'Despesa Usuario 2');
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
    });
  });

  describe('RN-DES-001: Classificação de Despesas - Cenários Específicos', () => {
    beforeEach(() => {
      const email = `despesa${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Despesa');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve permitir todas as categorias definidas', () => {
      const categorias = ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros'];
      
      categorias.forEach((categoria, index) => {
        cy.get('#addExpenseBtn').click();
        cy.get('#expenseName').type(`Despesa ${categoria}`);
        cy.get('#expenseValue').type('100');
        cy.get('#expenseCategory').select(categoria);
        cy.get('#expenseType').select('unica');
        cy.get('#expenseDate').type('2025-01-15');
        cy.get('#saveExpenseBtn').click();
        cy.wait(500);
      });
      
      cy.get('#expenseList tbody tr').should('have.length', categorias.length);
    });

    it('Deve filtrar corretamente por categoria', () => {
      // Adicionar despesas de diferentes categorias
      const despesas = [
        { nome: 'Almoço', categoria: 'Alimentação' },
        { nome: 'Ônibus', categoria: 'Transporte' },
        { nome: 'Remédio', categoria: 'Saúde' },
        { nome: 'Jantar', categoria: 'Alimentação' }
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
      
      // Filtrar por Alimentação
      cy.get('#categoryFilter').select('Alimentação');
      cy.get('#expenseList tbody tr').should('have.length', 2);
      cy.get('#expenseList').should('contain', 'Almoço');
      cy.get('#expenseList').should('contain', 'Jantar');
      cy.get('#expenseList').should('not.contain', 'Ônibus');
      
      // Filtrar por Transporte
      cy.get('#categoryFilter').select('Transporte');
      cy.get('#expenseList tbody tr').should('have.length', 1);
      cy.get('#expenseList').should('contain', 'Ônibus');
      
      // Mostrar todas
      cy.get('#categoryFilter').select('');
      cy.get('#expenseList tbody tr').should('have.length', 4);
    });

    it('Deve manter categoria ao editar despesa', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Original');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Saúde');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Editar despesa
      cy.get('.edit-btn').first().click();
      cy.get('#expenseCategory').should('have.value', 'Saúde');
      cy.get('#expenseName').clear().type('Despesa Editada');
      cy.get('#saveExpenseBtn').click();
      
      // Verificar que categoria foi mantida
      cy.get('#expenseList').should('contain', 'Saúde');
    });
  });

  describe('RN-DES-003: Validação de Valor - Cenários Extremos', () => {
    beforeEach(() => {
      const email = `valor${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Valor');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve aceitar valor mínimo (0.01)', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Valor Mínimo');
      cy.get('#expenseValue').type('0.01');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Valor Mínimo');
      cy.get('#monthlyTotal').should('contain', 'R$ 0,01');
    });

    it('Deve rejeitar valor zero', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Valor Zero');
      cy.get('#expenseValue').type('0');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast').should('contain.text', 'maior que zero');
    });

    it('Deve rejeitar valor negativo', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Valor Negativo');
      cy.get('#expenseValue').type('-10');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast').should('contain.text', 'maior que zero');
    });

    it('Deve aceitar valores com vírgula como separador decimal', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Valor Vírgula');
      cy.get('#expenseValue').type('123,45');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Valor Vírgula');
      cy.get('#monthlyTotal').should('contain', 'R$ 123,45');
    });

    it('Deve aceitar valores grandes', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Valor Grande');
      cy.get('#expenseValue').type('99999.99');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Valor Grande');
      cy.get('#monthlyTotal').should('contain', 'R$ 99.999,99');
    });
  });

  describe('RN-DES-004 e RN-DES-005: Datas para Despesas - Cenários Complexos', () => {
    beforeEach(() => {
      const email = `datas${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Datas');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve aceitar data futura para despesa única', () => {
      const dataFutura = new Date();
      dataFutura.setDate(dataFutura.getDate() + 30);
      const dataFormatada = dataFutura.toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Futura');
      cy.get('#expenseValue').type('200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type(dataFormatada);
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Despesa Futura');
    });

    it('Deve aceitar data passada para despesa única', () => {
      const dataPassada = new Date();
      dataPassada.setDate(dataPassada.getDate() - 30);
      const dataFormatada = dataPassada.toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Passada');
      cy.get('#expenseValue').type('150');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type(dataFormatada);
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Despesa Passada');
    });

    it('Deve exigir data de início para despesa recorrente', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Recorrente Sem Data');
      cy.get('#expenseValue').type('300');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      // Não preencher data
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast').should('contain.text', 'obrigatório');
    });

    it('Deve calcular próximas ocorrências de despesa mensal', () => {
      const hoje = new Date();
      const dataInicio = hoje.toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Aluguel Mensal');
      cy.get('#expenseValue').type('1000');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(dataInicio);
      cy.get('#saveExpenseBtn').click();
      
      // Verificar se aparece no calendário
      cy.get('#calendar').should('contain', 'Aluguel Mensal');
    });

    it('Deve calcular próximas ocorrências de despesa anual', () => {
      const hoje = new Date();
      const dataInicio = hoje.toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('IPVA Anual');
      cy.get('#expenseValue').type('1200');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('anual');
      cy.get('#expenseDate').type(dataInicio);
      cy.get('#saveExpenseBtn').click();
      
      // Verificar se aparece no calendário
      cy.get('#calendar').should('contain', 'IPVA Anual');
      
      // Verificar se valor é dividido por 12 no total mensal
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
    });
  });

  describe('RN-DES-006: Atualização de Recorrência - Cenários de Edição', () => {
    beforeEach(() => {
      const email = `recorrencia${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Recorrencia');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve permitir alterar despesa única para mensal', () => {
      // Criar despesa única
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Única');
      cy.get('#expenseValue').type('500');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Editar para mensal
      cy.get('.edit-btn').first().click();
      cy.get('#expenseType').select('mensal');
      cy.get('#saveExpenseBtn').click();
      
      // Verificar mudança
      cy.get('#expenseList').should('contain', 'Mensal');
      cy.get('#calendar').should('contain', 'Despesa Única');
    });

    it('Deve permitir alterar despesa mensal para anual', () => {
      // Criar despesa mensal
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Mensal');
      cy.get('#expenseValue').type('1200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Verificar total mensal inicial
      cy.get('#monthlyTotal').should('contain', 'R$ 1.200,00');
      
      // Editar para anual
      cy.get('.edit-btn').first().click();
      cy.get('#expenseType').select('anual');
      cy.get('#saveExpenseBtn').click();
      
      // Verificar mudança no cálculo (1200/12 = 100)
      cy.get('#expenseList').should('contain', 'Anual');
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
    });
  });

  describe('RN-CAL-001: Fórmula de Gasto Mensal - Cenários Mistos', () => {
    beforeEach(() => {
      const email = `calculo${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Calculo');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve calcular corretamente mix de despesas únicas, mensais e anuais', () => {
      const hoje = new Date();
      const mesAtual = hoje.getMonth() + 1;
      const anoAtual = hoje.getFullYear();
      
      // Despesa única do mês atual
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Compra Única');
      cy.get('#expenseValue').type('500');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type(`${anoAtual}-${mesAtual.toString().padStart(2, '0')}-15`);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa mensal
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Aluguel');
      cy.get('#expenseValue').type('1000');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(`${anoAtual}-${mesAtual.toString().padStart(2, '0')}-01`);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa anual
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Seguro');
      cy.get('#expenseValue').type('1200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('anual');
      cy.get('#expenseDate').type(`${anoAtual}-${mesAtual.toString().padStart(2, '0')}-01`);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Total deve ser: 500 (única) + 1000 (mensal) + 100 (anual/12) = 1600
      cy.get('#monthlyTotal').should('contain', 'R$ 1.600,00');
    });

    it('Deve excluir despesas únicas de meses diferentes', () => {
      const hoje = new Date();
      const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 15);
      const dataPassada = mesPassado.toISOString().split('T')[0];
      
      // Despesa única do mês passado
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Compra Mês Passado');
      cy.get('#expenseValue').type('300');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type(dataPassada);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Despesa mensal atual
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Mensal');
      cy.get('#expenseValue').type('200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(hoje.toISOString().split('T')[0]);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Total deve ser apenas 200 (despesa única não conta)
      cy.get('#monthlyTotal').should('contain', 'R$ 200,00');
    });

    it('Deve atualizar total ao editar valor de despesa', () => {
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Editável');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
      
      // Editar valor
      cy.get('.edit-btn').first().click();
      cy.get('#expenseValue').clear().type('300');
      cy.get('#saveExpenseBtn').click();
      
      // Verificar atualização
      cy.get('#monthlyTotal').should('contain', 'R$ 300,00');
    });
  });

  describe('HU01 e HU02: Cadastro e Login - Cenários de Integração', () => {
    it('Deve completar fluxo completo de cadastro e primeiro uso', () => {
      const email = `completo${Date.now()}@teste.com`;
      
      // Cadastro
      cy.get('#showRegister').click();
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      
      // Deve ir direto para dashboard
      cy.get('#expenseList').should('be.visible');
      cy.get('#monthlyTotal').should('contain', 'R$ 0,00');
      cy.get('.empty-message').should('be.visible');
      
      // Adicionar primeira despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Primeira Despesa');
      cy.get('#expenseValue').type('150');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      // Verificar se tudo foi salvo
      cy.get('#expenseList').should('contain', 'Primeira Despesa');
      cy.get('#monthlyTotal').should('contain', 'R$ 150,00');
      cy.get('.empty-message').should('not.exist');
      
      // Logout e login novamente
      cy.get('#logoutBtn').click();
      cy.get('#loginEmail').type(email);
      cy.get('#loginPassword').type('MinhaSenh@123');
      cy.get('#loginForm > .btn-primary').click();
      
      // Dados devem persistir
      cy.get('#expenseList').should('contain', 'Primeira Despesa');
      cy.get('#monthlyTotal').should('contain', 'R$ 150,00');
    });

    it('Deve validar campos obrigatórios no cadastro', () => {
      cy.get('#showRegister').click();
      
      // Tentar cadastrar sem preencher nada
      cy.get('#registerForm > .btn-primary').click();
      cy.get('.toast').should('contain.text', 'obrigatório');
      
      // Preencher apenas nome
      cy.get('#registerName').type('Teste');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('.toast').should('contain.text', 'obrigatório');
      
      // Preencher nome e email
      cy.get('#registerEmail').type(`teste${Date.now()}@teste.com`);
      cy.get('#registerForm > .btn-primary').click();
      cy.get('.toast').should('contain.text', 'obrigatório');
      
      // Preencher todos os campos
      cy.get('#registerPassword').type('Senha123');
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('#expenseList').should('be.visible');
    });
  });

  describe('HU10: Notificações de Vencimento - Cenários Temporais', () => {
    beforeEach(() => {
      const email = `notif${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Notificação');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve mostrar notificação para despesa vencendo hoje', () => {
      const hoje = new Date().toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Vence Hoje');
      cy.get('#expenseValue').type('500');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(hoje);
      cy.get('#saveExpenseBtn').click();
      
      // Recarregar para verificar notificações
      cy.reload();
      
      cy.get('.notification').should('contain', 'Vence Hoje');
      cy.get('.notification').should('contain', 'hoje');
    });

    it('Deve mostrar notificação para despesa vencendo em 3 dias', () => {
      const em3Dias = new Date();
      em3Dias.setDate(em3Dias.getDate() + 3);
      const data = em3Dias.toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Vence em 3 Dias');
      cy.get('#expenseValue').type('300');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(data);
      cy.get('#saveExpenseBtn').click();
      
      cy.reload();
      
      cy.get('.notification').should('contain', 'Vence em 3 Dias');
      cy.get('.notification').should('contain', '3 dias');
    });

    it('Não deve mostrar notificação para despesa vencendo em mais de 3 dias', () => {
      const em5Dias = new Date();
      em5Dias.setDate(em5Dias.getDate() + 5);
      const data = em5Dias.toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Vence em 5 Dias');
      cy.get('#expenseValue').type('400');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(data);
      cy.get('#saveExpenseBtn').click();
      
      cy.reload();
      
      cy.get('.notification').should('not.contain', 'Vence em 5 Dias');
    });

    it('Não deve mostrar notificação para despesas únicas', () => {
      const hoje = new Date().toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Única Hoje');
      cy.get('#expenseValue').type('200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type(hoje);
      cy.get('#saveExpenseBtn').click();
      
      cy.reload();
      
      cy.get('.notification').should('not.contain', 'Despesa Única Hoje');
    });
  });

  describe('HU11: Alternância de Tema - Cenários de Persistência', () => {
    beforeEach(() => {
      const email = `tema${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Tema');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve alternar entre tema claro e escuro', () => {
      // Verificar tema inicial (claro)
      cy.get('body').should('not.have.class', 'dark-theme');
      
      // Alternar para escuro
      cy.get('#themeToggle').click();
      cy.get('body').should('have.class', 'dark-theme');
      
      // Alternar de volta para claro
      cy.get('#themeToggle').click();
      cy.get('body').should('not.have.class', 'dark-theme');
    });

    it('Deve persistir tema após recarregar página', () => {
      // Alternar para tema escuro
      cy.get('#themeToggle').click();
      cy.get('body').should('have.class', 'dark-theme');
      
      // Recarregar página
      cy.reload();
      
      // Tema deve persistir
      cy.get('body').should('have.class', 'dark-theme');
    });

    it('Deve persistir tema após logout e login', () => {
      const email = `tema-persist${Date.now()}@teste.com`;
      
      // Fazer logout e cadastrar novo usuário
      cy.get('#logoutBtn').click();
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Persistencia');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Alternar para tema escuro
      cy.get('#themeToggle').click();
      cy.get('body').should('have.class', 'dark-theme');
      
      // Logout e login novamente
      cy.get('#logoutBtn').click();
      cy.get('#loginEmail').type(email);
      cy.get('#loginPassword').type('Teste123');
      cy.get('#loginForm > .btn-primary').click();
      
      // Tema deve persistir
      cy.get('body').should('have.class', 'dark-theme');
    });
  });
});