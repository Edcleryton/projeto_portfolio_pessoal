describe('tela de login', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080/')
    cy.get('#login-email').click()
    cy.get('#login-email').type('email@teste.com')
  })
})
