describe('adicionar despesa', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#login-email').type('email@teste.com')
    cy.get('#login-password').type('123456')
    cy.get('#login-form-element').submit()
    cy.get('#app-container').should('be.visible')
    cy.get('[data-section="subscriptions"]').click()
    cy.get('#add-subscription-btn').click()
  })

  it('adiciona nova despesa com sucesso', () => {
    cy.get('#service-name').type('Netflix')
    cy.get('#service-price').type('29.90')
    cy.get('#service-category').select('streaming')
    cy.get('#subscription-form').submit()
    cy.get('#subscriptions-list').should('contain', 'Netflix')
  })

  it('mostra erro quando nome está vazio', () => {
    cy.get('#service-price').type('29.90')
    cy.get('#service-category').select('streaming')
    cy.get('#subscription-form').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Nome do serviço é obrigatório')
  })

  it('mostra erro quando preço é inválido', () => {
    cy.get('#service-name').type('Netflix')
    cy.get('#service-price').type('abc')
    cy.get('#service-category').select('streaming')
    cy.get('#subscription-form').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Preço deve ser um número válido')
  })

  it('mostra erro quando preço é negativo', () => {
    cy.get('#service-name').type('Netflix')
    cy.get('#service-price').type('-10')
    cy.get('#service-category').select('streaming')
    cy.get('#subscription-form').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Preço deve ser maior que zero')
  })

  it('mostra erro quando categoria não é selecionada', () => {
    cy.get('#service-name').type('Netflix')
    cy.get('#service-price').type('29.90')
    cy.get('#subscription-form').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Selecione uma categoria')
  })

  it('mostra erro quando todos os campos estão vazios', () => {
    cy.get('#subscription-form').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Preencha todos os campos obrigatórios')
  })
})