describe('Testes Abrangentes - Gerenciamento de Usuários', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('RN-USU-001: Unicidade de E-mail', () => {
    it('Deve permitir cadastro com e-mail único', () => {
      const uniqueEmail = `usuario${Date.now()}@teste.com`;
      
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuário Teste');
      cy.get('#registerEmail').type(uniqueEmail);
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('.toast').should('be.visible')
        .and('contain.text', 'sucesso');
    });

    // Teste de e-mail duplicado movido para testes-cenarios-funcionais-avancados.cy.js
    // onde há cenários mais completos (case insensitive, espaços extras, etc.)

    it('Deve validar formato de e-mail', () => {
      const invalidEmails = [
        'email-sem-arroba.com',
        '@dominio-sem-usuario.com',
        'usuario@',
        'usuario@dominio',
        'usuario.dominio.com',
        'usuario@dominio.',
        'usuario com espaço@dominio.com'
      ];

      invalidEmails.forEach(email => {
        cy.get('#showRegister').click();
        cy.get('#registerName').type('Usuário Teste');
        cy.get('#registerEmail').clear().type(email);
        cy.get('#registerPassword').type('MinhaSenh@123');
        cy.get('#registerForm > .btn-primary').click();
        
        cy.get('.toast').should('be.visible')
          .and('satisfy', (toast) => {
            const text = toast.text().toLowerCase();
            return text.includes('inválido') || text.includes('formato') || text.includes('erro');
          });
        
        cy.reload();
      });
    });
  });

  describe('RN-USU-002: Política de Senha', () => {
    it('Deve aceitar senha que atende à política', () => {
      const validPasswords = [
        'MinhaSenh@123',
        'Senha123!',
        'Test@456',
        'Abcd1234',
        'Password1@'
      ];

      validPasswords.forEach((password, index) => {
        const email = `usuario${index}${Date.now()}@teste.com`;
        
        cy.get('#showRegister').click();
        cy.get('#registerName').type('Usuário Teste');
        cy.get('#registerEmail').type(email);
        cy.get('#registerPassword').type(password);
        cy.get('#registerForm > .btn-primary').click();
        
        cy.get('.toast').should('be.visible')
          .and('contain.text', 'sucesso');
        
        cy.wait(1000);
        cy.reload();
      });
    });

    it('Deve rejeitar senhas que não atendem à política', () => {
      const invalidPasswords = [
        { password: '123', reason: 'muito curta' },
        { password: 'senha', reason: 'sem números' },
        { password: '12345678', reason: 'só números' },
        { password: 'SENHA123', reason: 'sem minúsculas' },
        { password: 'senha123', reason: 'sem maiúsculas' },
        { password: 'Sen123', reason: 'menos de 8 caracteres' }
      ];

      invalidPasswords.forEach(({ password, reason }, index) => {
        const email = `usuario${index}${Date.now()}@teste.com`;
        
        cy.get('#showRegister').click();
        cy.get('#registerName').type('Usuário Teste');
        cy.get('#registerEmail').type(email);
        cy.get('#registerPassword').type(password);
        cy.get('#registerForm > .btn-primary').click();
        
        cy.get('.toast').should('be.visible')
          .and('satisfy', (toast) => {
            const text = toast.text().toLowerCase();
            return text.includes('senha') && (text.includes('fraca') || text.includes('inválida') || text.includes('erro'));
          });
        
        cy.reload();
      });
    });
  });

  describe('RN-USU-003: Bloqueio por Tentativas de Login', () => {
    it('Deve bloquear após múltiplas tentativas incorretas', () => {
      const email = 'usuario@bloqueio.com';
      const senhaCorreta = 'MinhaSenh@123';
      const senhaIncorreta = 'SenhaErrada123';
      
      // Primeiro, criar o usuário
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuário Bloqueio');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type(senhaCorreta);
      cy.get('#registerForm > .btn-primary').click();
      
      cy.wait(2000);
      cy.reload();
      
      // Fazer múltiplas tentativas incorretas
      for (let i = 0; i < 5; i++) {
        cy.get('#loginEmail').clear().type(email);
        cy.get('#loginPassword').clear().type(senhaIncorreta);
        cy.get('#loginForm > .btn-primary').click();
        
        cy.wait(1000);
      }
      
      // Tentar login com senha correta após bloqueio
      cy.get('#loginEmail').clear().type(email);
      cy.get('#loginPassword').clear().type(senhaCorreta);
      cy.get('#loginForm > .btn-primary').click();
      
      cy.get('.toast').should('be.visible')
        .and('satisfy', (toast) => {
          const text = toast.text().toLowerCase();
          return text.includes('bloqueado') || text.includes('tentativas') || text.includes('aguarde');
        });
    });
  });

  describe('RN-USU-004: Autenticação Obrigatória', () => {
    it('Deve redirecionar usuário não autenticado para login', () => {
      // Tentar acessar dashboard diretamente
      cy.visit('/dashboard.html');
      
      // Deve ser redirecionado para página de login
      cy.url().should('include', 'index.html');
      cy.get('#loginForm').should('be.visible');
    });

    it('Deve permitir acesso ao dashboard após login válido', () => {
      const email = `usuario${Date.now()}@teste.com`;
      const senha = 'MinhaSenh@123';
      
      // Criar usuário
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuário Dashboard');
      cy.get('#registerEmail').type(email);
      cy.get('#registerPassword').type(senha);
      cy.get('#registerForm > .btn-primary').click();
      
      cy.wait(2000);
      
      // Verificar se foi redirecionado para dashboard
      cy.url().should('include', 'dashboard.html');
      cy.get('#expenseList').should('be.visible');
    });
  });

  describe('RN-USU-005: Segregação de Dados', () => {
    it('Deve mostrar apenas dados do usuário logado', () => {
      const usuario1 = {
        email: `usuario1${Date.now()}@teste.com`,
        senha: 'MinhaSenh@123',
        nome: 'Usuário Um'
      };
      
      const usuario2 = {
        email: `usuario2${Date.now()}@teste.com`,
        senha: 'MinhaSenh@456',
        nome: 'Usuário Dois'
      };
      
      // Criar primeiro usuário e adicionar despesa
      cy.get('#showRegister').click();
      cy.get('#registerName').type(usuario1.nome);
      cy.get('#registerEmail').type(usuario1.email);
      cy.get('#registerPassword').type(usuario1.senha);
      cy.get('#registerForm > .btn-primary').click();
      
      cy.wait(2000);
      
      // Adicionar despesa para usuário 1
      cy.get('#addExpenseBtn').click();
      cy.get('#expenseName').type('Despesa Usuário 1');
      cy.get('#expenseValue').type('100');
      cy.get('#expenseCategory').select('Alimentação');
      cy.get('#expenseType').select('unica');
      cy.get('#expenseDate').type('2025-01-15');
      cy.get('#saveExpenseBtn').click();
      
      cy.wait(1000);
      
      // Fazer logout
      cy.get('#logout').click();
      
      cy.wait(1000);
      
      // Criar segundo usuário
      cy.get('#showRegister').click();
      cy.get('#registerName').type(usuario2.nome);
      cy.get('#registerEmail').type(usuario2.email);
      cy.get('#registerPassword').type(usuario2.senha);
      cy.get('#registerForm > .btn-primary').click();
      
      cy.wait(2000);
      
      // Verificar que não vê despesas do usuário 1
      cy.get('#expenseList tbody tr').should('not.contain', 'Despesa Usuário 1');
      cy.get('#monthlyTotal').should('contain', 'R$ 0,00');
    });
  });

  describe('HU01: Cadastro de Novo Usuário - Cenários Completos', () => {
    it('Deve cadastrar usuário com dados válidos e redirecionar para dashboard', () => {
      const userData = {
        nome: 'João Silva Santos',
        email: `joao${Date.now()}@exemplo.com`,
        senha: 'MinhaSenh@123'
      };
      
      cy.get('#showRegister').click();
      cy.get('#registerName').type(userData.nome);
      cy.get('#registerEmail').type(userData.email);
      cy.get('#registerPassword').type(userData.senha);
      cy.get('#registerForm > .btn-primary').click();
      
      // Verificar redirecionamento para dashboard
      cy.url().should('include', 'dashboard.html');
      cy.get('#expenseList').should('be.visible');
      cy.get('#monthlyTotal').should('be.visible');
    });

    it('Deve validar campos obrigatórios no cadastro', () => {
      cy.get('#showRegister').click();
      
      // Tentar cadastrar sem preencher campos
      cy.get('#registerForm > .btn-primary').click();
      
      // Verificar validação HTML5 ou mensagem de erro
      cy.get('#registerName:invalid').should('exist')
        .or(cy.get('.toast').should('contain.text', 'obrigatório'));
    });
  });

  describe('HU02: Login de Usuário - Cenários Completos', () => {
    it('Deve fazer login com credenciais corretas', () => {
      const userData = {
        email: `login${Date.now()}@teste.com`,
        senha: 'MinhaSenh@123'
      };
      
      // Criar usuário primeiro
      cy.get('#showRegister').click();
      cy.get('#registerName').type('Usuário Login');
      cy.get('#registerEmail').type(userData.email);
      cy.get('#registerPassword').type(userData.senha);
      cy.get('#registerForm > .btn-primary').click();
      
      cy.wait(2000);
      
      // Fazer logout
      cy.get('#logout').click();
      
      cy.wait(1000);
      
      // Fazer login
      cy.get('#loginEmail').type(userData.email);
      cy.get('#loginPassword').type(userData.senha);
      cy.get('#loginForm > .btn-primary').click();
      
      // Verificar redirecionamento para dashboard
      cy.url().should('include', 'dashboard.html');
    });

    it('Deve mostrar erro para credenciais incorretas', () => {
      cy.get('#loginEmail').type('usuario@inexistente.com');
      cy.get('#loginPassword').type('SenhaErrada123');
      cy.get('#loginForm > .btn-primary').click();
      
      cy.get('.toast').should('be.visible')
        .and('satisfy', (toast) => {
          const text = toast.text().toLowerCase();
          return text.includes('erro') || text.includes('inválido') || text.includes('incorreto');
        });
    });

    it('Deve validar campos obrigatórios no login', () => {
      // Tentar login sem preencher campos
      cy.get('#loginForm > .btn-primary').click();
      
      // Verificar validação HTML5
      cy.get('#loginEmail:invalid').should('exist');
    });
  });
});