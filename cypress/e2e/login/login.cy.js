describe('tela de login', () => {
  it('deve fazer login com sucesso', () => {
    cy.visit('/')
    cy.screenshot('01-tela-inicial')
    cy.get('#login-email').click()
    cy.get('#login-email').type('email@teste.com')
    cy.get('#login-password').click()
    cy.get('#login-password').type('123456')
    cy.screenshot('02-dados-preenchidos')
    cy.get('#login-form-element').submit()
    cy.get('#app-container').should('be.visible')
    cy.screenshot('03-login-sucesso')
  })
})
