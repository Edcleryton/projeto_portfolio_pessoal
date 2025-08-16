describe('lista de assinaturas', () => {
  it('deve visualizar lista de assinaturas', () => {
    cy.visit('http://localhost:8080/')
    cy.get('#login-email').type('email@teste.com')
    cy.get('#login-password').type('123456')
    cy.get('#login-form-element').submit()
    cy.get('[data-section="subscriptions"]').click()
    cy.get('#subscriptions-list').should('be.visible')
    cy.get('#category-filter').select('streaming')
    cy.get('#status-filter').select('active')
  })
})