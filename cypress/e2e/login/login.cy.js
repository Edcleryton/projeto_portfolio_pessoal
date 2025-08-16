describe('tela de login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('faz login com sucesso', () => {
    cy.get('#login-email').type('email@teste.com')
    cy.get('#login-password').type('123456')
    cy.get('#login-form-element').submit()
    cy.url().should('include', '/dashboard')
  })

  it('mostra erro quando email é inválido', () => {
    cy.get('#login-email').type('email-invalido')
    cy.get('#login-password').type('123456')
    cy.get('#login-form-element').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Email inválido')
  })

  it('mostra erro quando senha é muito curta', () => {
    cy.get('#login-email').type('email@teste.com')
    cy.get('#login-password').type('123')
    cy.get('#login-form-element').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'A senha deve ter pelo menos 6 caracteres')
  })

  it('mostra erro quando credenciais estão incorretas', () => {
    cy.get('#login-email').type('email@teste.com')
    cy.get('#login-password').type('senhaerrada')
    cy.get('#login-form-element').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Email ou senha incorretos')
  })

  it('mostra erro quando campos estão vazios', () => {
    cy.get('#login-form-element').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Preencha todos os campos')
  })
})
