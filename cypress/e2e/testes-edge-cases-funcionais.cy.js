describe('Testes Funcionais - Edge Cases e Validações Específicas', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Validações de Campos - Cenários Limites', () => {
    beforeEach(() => {
      const email = `validacao${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Validacao');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve validar nome de despesa com 1 caractere', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('A');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'A');
    });

    it('Deve validar nome de despesa com 100 caracteres', () => {
      const nome100 = 'A'.repeat(100);
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type(nome100);
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', nome100.substring(0, 50));
    });

    it('Deve rejeitar nome de despesa vazio', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').clear();
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast').should('contain.text', 'obrigatório');
    });

    it('Deve aceitar nome com caracteres especiais', () => {
      const nomeEspecial = 'Café & Açúcar - R$ 50,00 (promoção)';
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type(nomeEspecial);
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Café & Açúcar');
    });

    it('Deve aceitar nome com emojis', () => {
      const nomeEmoji = '🍕 Pizza Italiana 🇮🇹';
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type(nomeEmoji);
      cy.get('#expenseValue').type('35');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', '🍕 Pizza');
    });
  });

  describe('Validações de Valor - Casos Específicos', () => {
    beforeEach(() => {
      const email = `valor${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Valor');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve aceitar valor com ponto como separador decimal', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Valor Ponto');
      cy.get('#expenseValue').type('123.45');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#monthlyTotal').should('contain', 'R$ 123,45');
    });

    it('Deve aceitar valor inteiro sem decimais', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Valor Inteiro');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#monthlyTotal').should('contain', 'R$ 100,00');
    });

    it('Deve rejeitar valor com texto', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Valor Texto');
      cy.get('#expenseValue').type('cem reais');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast').should('contain.text', 'número');
    });

    it('Deve rejeitar valor com múltiplos pontos', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Valor Múltiplos Pontos');
      cy.get('#expenseValue').type('12.34.56');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast').should('contain.text', 'inválido');
    });

    it('Deve aceitar valor com 3 casas decimais (arredondar)', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Valor 3 Decimais');
      cy.get('#expenseValue').type('123.456');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      // Deve arredondar para 2 casas decimais
      cy.get('#monthlyTotal').should('satisfy', (element) => {
        const text = element.text();
        return text.includes('R$ 123,46') || text.includes('R$ 123,45');
      });
    });
  });

  describe('Validações de Data - Cenários Específicos', () => {
    beforeEach(() => {
      const email = `data${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Data');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve aceitar data de hoje', () => {
      const hoje = new Date().toISOString().split('T')[0];
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Hoje');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type(hoje);
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Despesa Hoje');
    });

    it('Deve aceitar data de 29 de fevereiro em ano bissexto', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Ano Bissexto');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2024-02-29'); // 2024 é bissexto
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Ano Bissexto');
    });

    it('Deve aceitar último dia do mês', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Último Dia');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-31');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Último Dia');
    });

    it('Deve aceitar primeiro dia do mês', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Primeiro Dia');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-01');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('#expenseList').should('contain', 'Primeiro Dia');
    });
  });

  describe('Comportamento de Formulários - Estados e Transições', () => {
    beforeEach(() => {
      const email = `form${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Form');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve limpar formulário após salvar despesa', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste Limpeza');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      // Abrir formulário novamente
      cy.get('#addExpenseBtn').click();
      
      // Campos devem estar limpos
      cy.get('#expenseName').should('have.value', '');
      cy.get('#expenseValue').should('have.value', '');
      cy.get('#expenseCategory').should('have.value', '');
      cy.get('#expenseType').should('have.value', '');
      cy.get('#expenseDate').should('have.value', '');
    });

    it('Deve manter dados ao cancelar edição', () => {
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Original');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Iniciar edição
      cy.get('.edit-btn').first().click();
      cy.get('#expenseName').clear().type('Nome Alterado');
      cy.get('#expenseValue').clear().type('200');
      
      // Cancelar
      cy.get('#cancelExpenseBtn').click();
      
      // Dados originais devem permanecer
      cy.get('#expenseList').should('contain', 'Despesa Original');
      cy.get('#expenseList').should('contain', 'R$ 100,00');
      cy.get('#expenseList').should('not.contain', 'Nome Alterado');
    });

    it('Deve pré-preencher formulário ao editar', () => {
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Editar');
      cy.get('#expenseValue').type('150');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type('2025-01-20');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Editar
      cy.get('.edit-btn').first().click();
      
      // Verificar pré-preenchimento
      cy.get('#expenseName').should('have.value', 'Despesa Editar');
      cy.get('#expenseValue').should('have.value', '150');
      cy.get('#expenseCategory').should('have.value', 'Transporte');
      cy.get('#expenseType').should('have.value', 'mensal');
      cy.get('#expenseDate').should('have.value', '2025-01-20');
    });

    it('Deve desabilitar botão salvar durante processamento', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Teste Processamento');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      
      // Clicar rapidamente múltiplas vezes
      cy.get('#saveExpenseBtn').click().click().click();
      
      // Deve salvar apenas uma vez
      cy.get('#expenseList tbody tr').should('have.length', 1);
    });
  });

  describe('Filtros e Busca - Cenários Avançados', () => {
    beforeEach(() => {
      const email = `filtro${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Filtro');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Adicionar despesas de teste
      const despesas = [
        { nome: 'Almoço McDonald\'s', categoria: 'Alimentação', valor: '25' },
        { nome: 'Uber para trabalho', categoria: 'Transporte', valor: '15' },
        { nome: 'Consulta médica', categoria: 'Saúde', valor: '200' },
        { nome: 'Jantar Pizza', categoria: 'Alimentação', valor: '40' },
        { nome: 'Gasolina', categoria: 'Transporte', valor: '80' }
      ];
      
      despesas.forEach(despesa => {
        cy.get('#addExpenseBtn').click();
        cy.get('#expenseName').type(despesa.nome);
        cy.get('#expenseValue').type(despesa.valor);
        cy.get('#expenseCategory').select(despesa.categoria);
        cy.get('#expenseType').select('unica');
        cy.get('#expenseDate').type('2025-01-15');
        cy.get('#saveExpenseBtn').click();
        cy.wait(300);
      });
    });

    it('Deve filtrar por categoria e mostrar total correto', () => {
      // Filtrar por Alimentação
      cy.get('#categoryFilter').select('Alimentação');
      cy.get('#expenseList tbody tr').should('have.length', 2);
      cy.get('#expenseList').should('contain', 'Almoço');
      cy.get('#expenseList').should('contain', 'Jantar');
      
      // Total deve ser apenas das despesas filtradas (25 + 40 = 65)
      cy.get('#monthlyTotal').should('contain', 'R$ 65,00');
    });

    it('Deve filtrar por categoria e manter filtro ao adicionar nova despesa', () => {
      // Filtrar por Transporte
      cy.get('#categoryFilter').select('Transporte');
      cy.get('#expenseList tbody tr').should('have.length', 2);
      
      // Adicionar nova despesa de Transporte
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Metrô');
      cy.get('#expenseValue').type('5');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      // Deve mostrar 3 despesas de Transporte
      cy.get('#expenseList tbody tr').should('have.length', 3);
      cy.get('#expenseList').should('contain', 'Metrô');
    });

    it('Deve limpar filtro ao selecionar "Todas"', () => {
      // Aplicar filtro
      cy.get('#categoryFilter').select('Saúde');
      cy.get('#expenseList tbody tr').should('have.length', 1);
      
      // Limpar filtro
      cy.get('#categoryFilter').select('');
      cy.get('#expenseList tbody tr').should('have.length', 5);
      
      // Total deve voltar ao valor completo
      cy.get('#monthlyTotal').should('contain', 'R$ 360,00');
    });
  });

  describe('Calendário - Funcionalidades Específicas', () => {
    beforeEach(() => {
      const email = `calendario${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Calendario');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve mostrar despesas recorrentes no calendário', () => {
      const hoje = new Date();
      const dataHoje = hoje.toISOString().split('T')[0];
      
      // Adicionar despesa mensal
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Aluguel Mensal');
      cy.get('#expenseValue').type('1000');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(dataHoje);
      cy.get('#saveExpenseBtn').click();
      
      // Verificar no calendário
      cy.get('#calendar').should('contain', 'Aluguel Mensal');
    });

    it('Deve mostrar múltiplas despesas no mesmo dia', () => {
      const data = '2025-01-15';
      
      // Adicionar duas despesas mensais no mesmo dia
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Aluguel');
      cy.get('#expenseValue').type('1000');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(data);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Internet');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(data);
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Ambas devem aparecer no calendário
      cy.get('#calendar').should('contain', 'Aluguel');
      cy.get('#calendar').should('contain', 'Internet');
    });

    it('Não deve mostrar despesas únicas no calendário', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Compra Única');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      // Não deve aparecer no calendário
      cy.get('#calendar').should('not.contain', 'Compra Única');
    });

    it('Deve navegar entre meses no calendário', () => {
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      
      // Adicionar despesa mensal
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Recorrente');
      cy.get('#expenseValue').type('200');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('mensal');
      cy.get('#expenseDate').type(`${anoAtual}-${(mesAtual + 1).toString().padStart(2, '0')}-15`);
      cy.get('#saveExpenseBtn').click();
      
      // Navegar para próximo mês
      cy.get('#nextMonth').click();
      cy.get('#calendar').should('contain', 'Despesa Recorrente');
      
      // Voltar para mês anterior
      cy.get('#prevMonth').click();
      cy.get('#calendar').should('contain', 'Despesa Recorrente');
    });
  });

  describe('Persistência de Dados - Cenários de Integridade', () => {
    it('Deve manter dados após múltiplas operações', () => {
      const email = `persistencia${Date.now()}@teste.com`;
      
      // Cadastro
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Persistencia');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Adicionar 5 despesas
      for (let i = 1; i <= 5; i++) {
        cy.get('#addExpenseBtn').click();
        cy.get('#expenseName').type(`Despesa ${i}`);
        cy.get('#expenseValue').type((i * 100).toString());
        cy.get('#expenseCategory').select('Outros');
        cy.get('#expenseType').select('unica');
        cy.get('#expenseDate').type('2025-01-15');
        cy.get('#saveExpenseBtn').click();
        cy.wait(300);
      }
      
      // Editar algumas despesas
      cy.get('.edit-btn').eq(0).click();
      cy.get('#expenseName').clear().type('Despesa Editada 1');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('.edit-btn').eq(2).click();
      cy.get('#expenseValue').clear().type('999');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Remover uma despesa
      cy.get('.delete-btn').eq(1).click();
      cy.get('#confirmDeleteBtn').click();
      cy.wait(500);
      
      // Recarregar página
      cy.reload();
      
      // Verificar integridade dos dados
      cy.get('#expenseList tbody tr').should('have.length', 4);
      cy.get('#expenseList').should('contain', 'Despesa Editada 1');
      cy.get('#expenseList').should('contain', 'R$ 999,00');
      cy.get('#expenseList').should('not.contain', 'Despesa 2');
    });

    it('Deve manter configurações de tema e filtros', () => {
      const email = `config${Date.now()}@teste.com`;
      
      // Cadastro
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Config');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
      
      // Adicionar despesas de diferentes categorias
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Alimentação');
      cy.get('#expenseValue').type('50');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Transporte');
      cy.get('#expenseValue').type('30');
      cy.get('#expenseCategory').select('Transporte');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Alterar tema e filtro
      cy.get('#themeToggle').click();
      cy.get('#categoryFilter').select('Alimentação');
      
      // Recarregar página
      cy.reload();
      
      // Verificar persistência
      cy.get('body').should('have.class', 'dark-theme');
      cy.get('#categoryFilter').should('have.value', 'Alimentação');
      cy.get('#expenseList tbody tr').should('have.length', 1);
      cy.get('#expenseList').should('contain', 'Despesa Alimentação');
    });
  });

  describe('Mensagens de Feedback - Cenários de UX', () => {
    beforeEach(() => {
      const email = `feedback${Date.now()}@teste.com`;
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuario Feedback');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type('Teste123');
      cy.get('#registerForm > .btn-primary').click();
      cy.wait(1000);
    });

    it('Deve mostrar mensagem de sucesso ao adicionar despesa', () => {
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Sucesso');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast.success').should('be.visible');
      cy.get('.toast').should('contain.text', 'sucesso');
    });

    it('Deve mostrar mensagem de sucesso ao editar despesa', () => {
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Original');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Editar
      cy.get('.edit-btn').first().click();
      cy.get('#expenseName').clear().type('Despesa Editada');
      cy.get('#saveExpenseBtn').click();
      
      cy.get('.toast.success').should('be.visible');
      cy.get('.toast').should('contain.text', 'atualizada');
    });

    it('Deve mostrar mensagem de confirmação ao remover despesa', () => {
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Remover');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      cy.wait(500);
      
      // Remover
      cy.get('.delete-btn').first().click();
      
      // Deve mostrar modal de confirmação
      cy.get('#deleteModal').should('be.visible');
      cy.get('#deleteModal').should('contain.text', 'Tem certeza');
      
      cy.get('#confirmDeleteBtn').click();
      
      cy.get('.toast.success').should('be.visible');
      cy.get('.toast').should('contain.text', 'removida');
    });

    it('Deve mostrar mensagem quando lista está vazia', () => {
      cy.get('.empty-message').should('be.visible');
      cy.get('.empty-message').should('contain.text', 'Nenhuma despesa');
      
      // Adicionar despesa
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Primeira Despesa');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Outros');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      // Mensagem deve desaparecer
      cy.get('.empty-message').should('not.exist');
      
      // Remover despesa
      cy.get('.delete-btn').first().click();
      cy.get('#confirmDeleteBtn').click();
      
      // Mensagem deve voltar
      cy.get('.empty-message').should('be.visible');
    });
  });
});