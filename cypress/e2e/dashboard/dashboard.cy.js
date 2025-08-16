describe('dashboard', () => {
  it('mostra dashboard com estatísticas após login válido', () => {
    cy.visit('/')
    cy.get('#login-email').type('email@teste.com')
    cy.get('#login-password').type('123456')
    cy.get('#login-form-element').submit()
    cy.get('#app-container').should('be.visible')
    cy.get('[data-section="dashboard"]').click()
    cy.get('#total-monthly').should('be.visible')
    cy.get('#total-yearly').should('be.visible')
    cy.get('#active-subs').should('be.visible')
    cy.get('#upcoming-payments').should('be.visible')
  })
})