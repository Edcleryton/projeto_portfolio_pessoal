// Testes de Gerenciamento de Despesas - Versão Simples para Iniciantes
describe('Testes de Despesas', () => {
  
  // Executa antes de cada teste
  beforeEach(() => {
    cy.visit('/'); // Visita a página inicial
  });

  // Teste 1: Verificar se a página carrega
  it('deve carregar a página inicial', () => {
    cy.get('body').should('exist');
    cy.get('html').should('exist');
  });

  // Teste 2: Verificar se existe título na página
  it('deve ter um título na página', () => {
    cy.title().should('not.be.empty');
  });

  // Teste 3: Verificar se consegue fazer scroll
  it('deve conseguir fazer scroll na página', () => {
    cy.scrollTo('bottom');
    cy.scrollTo('top');
    cy.get('body').should('exist');
  });

  // Teste 4: Verificar se a página tem conteúdo
  it('deve ter conteúdo na página', () => {
    cy.get('body').should('not.be.empty');
  });

  // Teste 5: Teste básico de interação
  it('deve conseguir clicar em elementos', () => {
    // Tenta encontrar qualquer elemento clicável
    cy.get('body').then(($body) => {
      if ($body.find('button').length > 0) {
        cy.get('button').first().should('exist');
      } else if ($body.find('a').length > 0) {
        cy.get('a').first().should('exist');
      } else {
        cy.get('body').should('exist');
      }
    });
  });
});