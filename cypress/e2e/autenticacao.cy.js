describe('Testes de Autenticação', () => {
  it('deve abrir a página', () => {
    cy.visit('/');
    cy.get('#loginForm').should('be.visible');
    cy.get('#loginForm h2').should('contain', 'Entrar na sua conta');
  });

  it('deve fazer cadastro', () => {
    cy.visit('/');
    cy.get('#showRegister').should('be.visible').click();
    cy.get('#registerName').should('be.visible').type('João Silva');
    cy.get('#registerEmail').should('be.visible').type('joao@email.com');
    cy.get('#registerPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#confirmPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#registerForm > .btn-primary').should('be.enabled').click();
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain', 'Conta criada com sucesso!');
    cy.get('#dashboard-container').should('be.visible');
  });

  it('deve fazer login', () => {
    cy.visit('/');
    cy.get('#loginEmail').should('be.visible').type('joao@email.com');
    cy.get('#loginPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').should('be.enabled').click();
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain', 'Login realizado');
    cy.get('#dashboard-container').should('be.visible');
  });

  it('deve fazer logout', () => {
    cy.visit('/');
    cy.get('#loginEmail').should('be.visible').type('joao@email.com');
    cy.get('#loginPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').should('be.enabled').click();
    cy.get('#logoutBtn').should('be.visible').click();
    cy.get('#auth-container').should('be.visible');
    cy.get('#loginForm').should('be.visible');
  });

  it('deve validar campos obrigatórios no login', () => {
    cy.visit('/');
    cy.get('#loginForm > .btn-primary').should('be.enabled').click();
    cy.get('#loginEmailError').should('contain', 'E-mail é obrigatório.');
    cy.get('#loginPasswordError').should('contain', 'Senha é obrigatória.');
  });

  it('deve validar e-mail inválido', () => {
    cy.visit('/');
    cy.get('#loginEmail').should('be.visible').type('email-invalido');
    cy.get('#loginPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#loginForm > .btn-primary').should('be.enabled').click();
    cy.get('#loginEmailError').should('contain', 'E-mail inválido.');
  });

  it('deve validar credenciais inválidas', () => {
    cy.visit('/');
    cy.get('#loginEmail').should('be.visible').type('usuario@inexistente.com');
    cy.get('#loginPassword').should('be.visible').type('senhaerrada');
    cy.get('#loginForm > .btn-primary').should('be.enabled').click();
    cy.get('.toast.error').should('be.visible');
    cy.get('.toast-title').should('contain', 'Credenciais inválidas.');
  });

  it('deve validar senha fraca no cadastro', () => {
    cy.visit('/');
    cy.get('#showRegister').should('be.visible').click();
    cy.get('#registerName').should('be.visible').type('João Silva');
    cy.get('#registerEmail').should('be.visible').type('joao@teste.com');
    cy.get('#registerPassword').should('be.visible').type('123');
    cy.get('#confirmPassword').should('be.visible').type('123');
    cy.get('#registerForm > .btn-primary').should('be.enabled').click();
    cy.get('#registerPasswordError').should('contain', 'Senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e símbolos.');
  });

  it('deve validar senhas não coincidem', () => {
    cy.visit('/');
    cy.get('#showRegister').should('be.visible').click();
    cy.get('#registerName').should('be.visible').type('João Silva');
    cy.get('#registerEmail').should('be.visible').type('joao@teste.com');
    cy.get('#registerPassword').should('be.visible').type('MinhaSenh@123');
    cy.get('#confirmPassword').should('be.visible').type('MinhaSenh@456');
    cy.get('#registerForm > .btn-primary').should('be.enabled').click();
    cy.get('#confirmPasswordError').should('contain', 'Senhas não coincidem.');
  });
});