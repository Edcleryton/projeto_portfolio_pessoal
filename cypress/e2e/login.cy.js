describe('Testes de Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Login com credenciais válidas', () => {
    it('deve fazer login com sucesso', () => {
      cy.get('#loginEmail').type('eddie@gerir.me');
      cy.get('#loginPassword').type('Eddie@123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('.toast').should('be.visible');
      cy.get('.toast-title').should('contain', 'Login realizado');
      cy.get('.toast-message').should('contain', 'Bem-vindo de volta!');
      cy.get('.toast-close > .fas').click();
      cy.get('#userMenuBtn').click();
      cy.get('#logoutBtn').click();
           
    });
  });

  describe('Login com credenciais inválidas', () => {
    it('deve exibir erro para email inválido', () => {
      cy.get('#loginEmail').type('email-invalido');
      cy.get('#loginPassword').type('MinhaSenh@123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginEmailError').should('contain', 'E-mail deve ter um formato válido.');
    });

    it('deve exibir erro para email não cadastrado', () => {
      cy.get('#loginEmail').type('naoexiste@teste.com');
      cy.get('#loginPassword').type('MinhaSenh@123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginEmailError').should('contain', 'E-mail não encontrado.');
    });

    it('deve exibir erro para senha incorreta', () => {
      cy.get('#loginEmail').type('usuario@teste.com');
      cy.get('#loginPassword').type('SenhaErrada123@');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginPasswordError').should('contain', 'Senha incorreta.');
    });
  });

  describe('Validação de campos obrigatórios', () => {
    it('deve validar campo email vazio', () => {
      cy.get('#loginPassword').type('MinhaSenh@123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginEmailError').should('contain', 'E-mail é obrigatório.');
    });

    it('deve validar campo senha vazio', () => {
      cy.get('#loginEmail').type('usuario@teste.com');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginPasswordError').should('contain', 'Senha é obrigatória.');
    });
  });

  describe('Funcionalidade de mostrar/ocultar senha', () => {
    it('deve alternar visibilidade da senha', () => {
      cy.get('#loginPassword').should('have.attr', 'type', 'password');
      cy.get('#toggleLoginPassword').click();
      cy.get('#loginPassword').should('have.attr', 'type', 'text');
      cy.get('#toggleLoginPassword').click();
      cy.get('#loginPassword').should('have.attr', 'type', 'password');
    });
  });

  describe('Validações de formato de senha', () => {
    it('deve validar senha sem número', () => {
      cy.get('#loginEmail').type('usuario@teste.com');
      cy.get('#loginPassword').type('MinhaSenh@');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginPasswordError').should('contain', 'Senha deve conter pelo menos um número.');
    });

    it('deve validar senha sem símbolo', () => {
      cy.get('#loginEmail').type('usuario@teste.com');
      cy.get('#loginPassword').type('MinhaSenh123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginPasswordError').should('contain', 'Senha deve conter pelo menos um símbolo.');
    });

    it('deve validar senha sem letra minúscula', () => {
      cy.get('#loginEmail').type('usuario@teste.com');
      cy.get('#loginPassword').type('MINHASENHA123@');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginPasswordError').should('contain', 'Senha deve conter pelo menos uma letra minúscula.');
    });

    it('deve validar senha sem letra maiúscula', () => {
      cy.get('#loginEmail').type('usuario@teste.com');
      cy.get('#loginPassword').type('senhasemmaiuscula123@');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginPasswordError').should('contain', 'Senha deve conter pelo menos uma letra maiúscula.');
    });

    it('deve exibir feedback visual sobre força da senha', () => {
      cy.get('#loginPassword').type('123');
      cy.get('.password-strength').should('contain', 'Fraca').and('have.class', 'weak');
      
      cy.get('#loginPassword').clear().type('MinhaSenh@123');
      cy.get('.password-strength').should('contain', 'Forte').and('have.class', 'strong');
    });
  });
});