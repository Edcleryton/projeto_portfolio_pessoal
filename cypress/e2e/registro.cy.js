// Testes de Registro - Versão Simples para Iniciantes
describe('Testes de Registro', () => {
  
  // Executa antes de cada teste
  beforeEach(() => {
    cy.visit('/'); // Visita a página inicial
    
    // Vai para a tela de registro
    cy.get('#showRegister').click();
  });

  // Teste 1: Verificar se a tela de registro carrega
  it('deve abrir a tela de registro', () => {
    // Verifica se o formulário de registro está visível
    cy.get('#registerForm').should('be.visible');
    
    // Verifica se tem todos os campos necessários
    cy.get('#registerName').should('be.visible');
    cy.get('#registerEmail').should('be.visible');
    cy.get('#registerPassword').should('be.visible');
    cy.get('#confirmPassword').should('be.visible');
  });

  // Teste 2: Registro com dados válidos
  it('deve registrar um novo usuário com sucesso', () => {
    // Preenche os dados do registro
    cy.get('#registerName').type('João Silva');
    cy.get('#registerEmail').type('joao@teste.com');
    cy.get('#registerPassword').type('MinhaSenh@123');
    cy.get('#confirmPassword').type('MinhaSenh@123');
    
    // Clica no botão de registrar
    cy.get('#registerForm > .btn-primary').click();
    
    // Verifica se apareceu mensagem de sucesso
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast-title').should('contain.text', 'Cadastro realizado');
  });

  // Teste 3: Registro sem preencher nome
  it('deve mostrar erro quando nome está vazio', () => {
    // Preenche só os outros campos
    cy.get('#registerEmail').type('teste@email.com');
    cy.get('#registerPassword').type('MinhaSenh@123');
    cy.get('#confirmPassword').type('MinhaSenh@123');
    
    // Clica no botão de registrar
    cy.get('#registerForm > .btn-primary').click();
    
    // Verifica se apareceu erro de nome obrigatório
    cy.get('#registerNameError').should('be.visible');
    cy.get('#registerNameError').should('contain', 'Nome é obrigatório');
  });

  // Teste 4: Registro sem preencher email
  it('deve mostrar erro quando email está vazio', () => {
    // Preenche só os outros campos
    cy.get('#registerName').type('João Silva');
    cy.get('#registerPassword').type('MinhaSenh@123');
    cy.get('#confirmPassword').type('MinhaSenh@123');
    
    // Clica no botão de registrar
    cy.get('#registerForm > .btn-primary').click();
    
    // Verifica se apareceu erro de email obrigatório
    cy.get('#registerEmailError').should('be.visible');
    cy.get('#registerEmailError').should('contain', 'E-mail é obrigatório');
  });

  // Teste 5: Registro com senhas diferentes
  it('deve mostrar erro quando senhas não coincidem', () => {
    // Preenche os dados com senhas diferentes
    cy.get('#registerName').type('João Silva');
    cy.get('#registerEmail').type('joao@teste.com');
    cy.get('#registerPassword').type('MinhaSenh@123');
    cy.get('#confirmPassword').type('SenhaDiferente@123');
    
    // Clica no botão de registrar
    cy.get('#registerForm > .btn-primary').click();
    
    // Verifica se apareceu erro de senhas não coincidem
    cy.get('#confirmPasswordError').should('be.visible');
    cy.get('#confirmPasswordError').should('contain', 'Senhas não coincidem');
  });

  // Teste 6: Registro com senha fraca
  it('deve mostrar erro para senha fraca', () => {
    // Preenche os dados com senha fraca
    cy.get('#registerName').type('João Silva');
    cy.get('#registerEmail').type('joao@teste.com');
    cy.get('#registerPassword').type('123');
    cy.get('#confirmPassword').type('123');
    
    // Clica no botão de registrar
    cy.get('#registerForm > .btn-primary').click();
    
    // Verifica se apareceu erro de senha fraca
    cy.get('#registerPasswordError').should('be.visible');
    cy.get('#registerPasswordError').should('contain', 'Senha deve ter pelo menos');
  });

  // Teste 7: Registro com email inválido
  it('deve mostrar erro para email inválido', () => {
    // Preenche os dados com email inválido
    cy.get('#registerName').type('João Silva');
    cy.get('#registerEmail').type('emailinvalido');
    cy.get('#registerPassword').type('MinhaSenh@123');
    cy.get('#confirmPassword').type('MinhaSenh@123');
    
    // Clica no botão de registrar
    cy.get('#registerForm > .btn-primary').click();
    
    // Verifica se apareceu erro de email inválido
    cy.get('#registerEmailError').should('be.visible');
    cy.get('#registerEmailError').should('contain', 'E-mail inválido');
  });

  // Teste 8: Voltar para tela de login
  it('deve conseguir voltar para a tela de login', () => {
    // Clica no link para voltar ao login
    cy.get('#showLogin').click();
    
    // Verifica se voltou para a tela de login
    cy.get('#loginForm').should('be.visible');
    
    // Verifica se a tela de registro não está mais visível
    cy.get('#registerForm').should('not.be.visible');
  });
});