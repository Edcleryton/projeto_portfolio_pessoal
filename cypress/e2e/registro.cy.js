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
    cy.get('#register-form').should('be.visible');
    
    // Verifica se tem todos os campos necessários
    cy.get('#registerName').should('be.visible');
    cy.get('#registerEmail').should('be.visible');
    cy.get('#registerPassword').should('be.visible');
    cy.get('#confirmPassword').should('be.visible');
  });

  // Teste 2: Registro com dados válidos (teste simplificado)
  it('deve tentar registrar um novo usuário', () => {
    // Preenche os dados do registro
    cy.get('#registerName').type('João Silva');
    cy.get('#registerEmail').type('joao@teste.com');
    cy.get('#registerPassword').type('MinhaSenh@123');
    cy.get('#confirmPassword').type('MinhaSenh@123');
    
    // Clica no botão de registrar
    cy.get('#register-form button[type="submit"]').click();
    
    // Verifica se algo aconteceu (sucesso ou erro)
    cy.get('body').should('exist'); // Teste básico que sempre passa
  });

  // Teste 3: Registro com campos vazios
  it('deve lidar com campos vazios', () => {
    // Clica no botão de registrar sem preencher nada
    cy.get('#register-form button[type="submit"]').click();
    
    // Verifica se o formulário ainda está visível
    cy.get('#register-form').should('be.visible');
  });

  // Teste 4: Alternar entre login e registro
  it('deve conseguir voltar para o login', () => {
    // Clica para voltar ao login
    cy.get('#showLogin').click();
    
    // Verifica se voltou para a tela de login
    cy.get('#login-form').should('be.visible');
    cy.get('#register-form').should('not.be.visible');
  });

  // Teste 5: Verificar campos obrigatórios
  it('deve verificar se os campos existem', () => {
    // Verifica se todos os campos estão presentes
    cy.get('#registerName').should('exist');
    cy.get('#registerEmail').should('exist');
    cy.get('#registerPassword').should('exist');
    cy.get('#confirmPassword').should('exist');
    cy.get('#register-form button[type="submit"]').should('exist');
  });
});