describe('Testes de Interface e Notificações', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve abrir a página', () => {
    cy.get('body').should('be.visible');
    cy.get('#auth-container').should('be.visible');
  });

  it('deve mostrar notificação de sucesso após login', () => {
    // Fazer login para gerar notificação de sucesso
    cy.get('#showRegister').click();
    cy.get('#registerName').type('João Silva');
    cy.get('#registerEmail').type('joao@teste.com');
    cy.get('#registerPassword').type('MinhaSenh@123');
    cy.get('#confirmPassword').type('MinhaSenh@123');
    cy.get('#registerForm > .btn-primary').click();
    
    // Verificar toast de sucesso
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain', 'Conta criada com sucesso!');
    cy.get('.toast-icon .fa-check-circle').should('exist');
  });

  it('deve mostrar notificação de erro', () => {
    // Tentar login com credenciais inválidas para gerar erro
    cy.get('#loginEmail').type('usuario@inexistente.com');
    cy.get('#loginPassword').type('senhaerrada');
    cy.get('#loginForm > .btn-primary').click();
    
    // Verificar toast de erro
    cy.get('.toast.error').should('be.visible');
    cy.get('.toast-title').should('contain', 'Credenciais inválidas.');
    cy.get('.toast-icon .fa-exclamation-circle').should('exist');
  });

  it('deve abrir modal de cadastro', () => {
    cy.get('#showRegister').should('be.visible').click();
    cy.get('#register-form').should('be.visible');
    cy.get('#register-form').should('have.class', 'auth-form');
    cy.get('#register-form h2').should('contain', 'Criar nova conta');
  });

  it('deve alternar entre formulários de login e cadastro', () => {
    // Ir para cadastro
    cy.get('#showRegister').should('be.visible').click();
    cy.get('#register-form').should('be.visible');
    cy.get('#login-form').should('not.have.class', 'active');
    
    // Voltar para login
    cy.get('#showLogin').should('be.visible').click();
    cy.get('#login-form').should('be.visible');
    cy.get('#login-form').should('have.class', 'active');
  });

  it('deve mostrar visibilidade de senha', () => {
    cy.get('.toggle-password').first().should('be.visible');
    cy.get('.toggle-password .fa-eye').should('exist');
    
    // Testar toggle de visibilidade
    cy.get('#loginPassword').should('have.attr', 'type', 'password');
    cy.get('.toggle-password').first().click();
    cy.get('#loginPassword').should('have.attr', 'type', 'text');
  });

  it('deve ser responsivo', () => {
    // Testar em viewport mobile
    cy.viewport(375, 667);
    cy.get('.auth-container').should('be.visible');
    cy.get('.auth-card').should('be.visible');
    
    // Verificar se elementos se adaptam
    cy.get('.auth-form').should('be.visible');
    cy.get('.btn-primary').should('be.visible');
  });

  it('deve fechar toast manualmente', () => {
    // Gerar um toast de erro
    cy.get('#loginForm > .btn-primary').click();
    cy.get('#loginEmailError').should('contain', 'E-mail é obrigatório.');
    
    // Fazer login para gerar toast de sucesso
    cy.get('#loginEmail').type('teste@email.com');
    cy.get('#loginPassword').type('MinhaSenh@123');
    cy.get('#showRegister').click();
    cy.get('#registerName').type('Teste');
    cy.get('#registerEmail').type('teste@email.com');
    cy.get('#registerPassword').type('MinhaSenh@123');
    cy.get('#confirmPassword').type('MinhaSenh@123');
    cy.get('#registerForm > .btn-primary').click();
    
    // Verificar e fechar toast
    cy.get('.toast').should('be.visible');
    cy.get('.toast-close').should('be.visible').click();
    cy.get('.toast').should('not.exist');
  });
});