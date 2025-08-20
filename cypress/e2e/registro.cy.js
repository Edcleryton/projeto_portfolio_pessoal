describe('Testes de Registro', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#showRegister').should('be.visible').click();
  });

  describe('Validação de campos obrigatórios', () => {
    it('deve validar campo nome vazio', () => {
      cy.get('#registerEmail').type('teste@email.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerNameError').should('contain', 'Nome é obrigatório.');
    });

    it('deve validar campo email vazio', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail é obrigatório.');
    });

    it('deve validar campo senha vazio', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao@teste.com');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerPasswordError').should('contain', 'Senha é obrigatória.');
    });

    it('deve validar campo confirmação de senha vazio', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao@teste.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#confirmPasswordError').should('contain', 'Confirmação de senha é obrigatória.');
    });

    it('deve validar todos os campos vazios', () => {
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerNameError').should('contain', 'Nome é obrigatório.');
      cy.get('#registerEmailError').should('contain', 'E-mail é obrigatório.');
      cy.get('#registerPasswordError').should('contain', 'Senha é obrigatória.');
      cy.get('#confirmPasswordError').should('contain', 'Confirmação de senha é obrigatória.');
    });
  });

  describe('Validação de formato de e-mail', () => {
    it('deve validar e-mail duplicado', () => {
      // Primeiro cadastro
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao@teste.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('.toast.success').should('be.visible');
      
      // Logout para tentar cadastrar novamente
      cy.get('#logoutBtn').click();
      cy.get('#showRegister').click();
      
      // Tentativa de cadastro com mesmo e-mail
      cy.get('#registerName').type('Maria Silva');
      cy.get('#registerEmail').type('joao@teste.com');
      cy.get('#registerPassword').type('OutraSenh@456');
      cy.get('#confirmPassword').type('OutraSenh@456');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail já cadastrado.');
    });

    it('deve validar e-mail sem @', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('emailinvalido.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail inválido.');
    });

    it('deve validar e-mail sem domínio', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('email@');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail inválido.');
    });

    it('deve validar e-mail sem extensão', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('email@dominio');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail inválido.');
    });

    it('deve validar e-mail com espaços', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('email @dominio.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail inválido.');
    });
  });



  describe('Validação de senhas', () => {
    it('deve validar senha fraca', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao@teste.com');
      cy.get('#registerPassword').type('123');
      cy.get('#confirmPassword').type('123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerPasswordError').should('contain', 'Senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e símbolos.');
    });

    it('deve validar senhas não coincidem', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao@teste.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@456');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#confirmPasswordError').should('contain', 'Senhas não coincidem.');
    });
  });

  // Teste de cadastro bem-sucedido por último para evitar interferências
  describe('Cadastro bem-sucedido', () => {
    it('deve fazer cadastro com dados válidos', () => {
      cy.get('#registerName').should('be.visible').type('Eddie Silva');
      cy.get('#registerEmail').should('be.visible').type('eddie@gerir.me');
      cy.get('#registerPassword').should('be.visible').type('Eddie@123');
      cy.get('#confirmPassword').should('be.visible').type('Eddie@123');
      cy.get('#registerForm > .btn-primary').should('be.enabled').click();
      cy.get('.toast.success').should('be.visible');
      cy.get('.toast-title').should('contain', 'Conta criada com sucesso!');
      cy.get('#dashboard-container').should('be.visible');
    });
  });

});