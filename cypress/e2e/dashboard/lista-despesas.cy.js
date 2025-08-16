describe('lista de despesas', () => {
  it('mostra lista de despesas após login válido', () => {
    cy.visit('/')
    cy.get('#login-email').type('email@teste.com')
    cy.get('#login-password').type('123456')
    cy.get('#login-form-element').submit()
    cy.get('#app-container').should('be.visible')
    cy.get('[data-section="subscriptions"]').click()
    cy.get('#subscriptions-list').should('be.visible')
    cy.get('#category-filter').select('streaming')
    cy.get('#status-filter').select('active')
  })
})