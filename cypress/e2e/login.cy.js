describe('Testes de Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Funcionalidades básicas', () => {
    it('deve abrir a página', () => {
      cy.get('#loginForm').should('be.visible');
      cy.get('#loginForm h2').should('contain', 'Entrar na sua conta');
    });

    it('deve fazer login', () => {
      cy.get('#loginEmail').type('eddie@gerir.me');
      cy.get('#loginPassword').type('Eddie@123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('.toast.success').should('be.visible');
      cy.get('#dashboard-container').should('be.visible');
    });

    it('deve fazer logout', () => {
      cy.get('#loginEmail').type('joao@email.com');
      cy.get('#loginPassword').type('MinhaSenh@123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#logoutBtn').click();
      cy.get('#auth-container').should('be.visible');
    });
  });

  describe('Validações', () => {
    it('deve validar campos obrigatórios', () => {
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginEmailError').should('contain', 'E-mail é obrigatório.');
      cy.get('#loginPasswordError').should('contain', 'Senha é obrigatória.');
    });

    it('deve validar e-mail inválido', () => {
      cy.get('#loginEmail').type('email-invalido');
      cy.get('#loginPassword').type('MinhaSenh@123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginEmailError').should('contain', 'E-mail inválido.');
    });

    it('deve validar credenciais inválidas', () => {
      cy.get('#loginEmail').type('usuario@inexistente.com');
      cy.get('#loginPassword').type('senhaerrada');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginPasswordError').should('contain', 'Credenciais inválidas. Tentativas restantes: 2');
    });

    it('deve validar caracteres especiais não permitidos no e-mail', () => {
      cy.get('#loginEmail').type('usuario@<script>alert(1)</script>');
      cy.get('#loginPassword').type('MinhaSenh@123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginEmailError').should('contain', 'E-mail inválido.');
    });

    it('deve validar limite máximo de caracteres no e-mail', () => {
      const longEmail = 'a'.repeat(255) + '@email.com';
      cy.get('#loginEmail').type(longEmail);
      cy.get('#loginPassword').type('MinhaSenh@123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginEmailError').should('contain', 'E-mail muito longo.');
    });

    it('deve direcionar foco para primeiro campo inválido', () => {
      cy.get('#loginForm > .btn-primary').click();
      cy.focused().should('have.id', 'loginEmail');
    });
  });

  describe('Requisitos de Senha', () => {
    it('deve validar comprimento mínimo da senha', () => {
      cy.get('#loginEmail').type('usuario@teste.com');
      cy.get('#loginPassword').type('123');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginPasswordError').should('contain', 'Senha deve ter pelo menos 8 caracteres.');
    });

    it('deve validar presença de caracteres especiais na senha', () => {
      cy.get('#loginEmail').type('usuario@teste.com');
      cy.get('#loginPassword').type('senhasemcaracterespecial');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginPasswordError').should('contain', 'Senha deve conter pelo menos um caractere especial.');
    });

    it('deve validar presença de números na senha', () => {
      cy.get('#loginEmail').type('usuario@teste.com');
      cy.get('#loginPassword').type('SenhaSemNumero@');
      cy.get('#loginForm > .btn-primary').click();
      cy.get('#loginPasswordError').should('contain', 'Senha deve conter pelo menos um número.');
    });

    it('deve validar presença de letras maiúsculas na senha', () => {
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