describe('Registro', () => {
  it('Criação de conta com dados válidos deve permitir o registro com sucesso', () => {
    cy.visit('http://localhost:8080/')
    cy.get('#showRegister').click()   
    cy.get('#registerName').click().type('teste2')
    cy.get('#registerEmail').click().type('teste2@teste.com')
    cy.get('#registerPassword').click().type('123456@Teste')
    cy.get('#confirmPassword').click().type('123456@Teste')
    cy.get('#registerForm > .btn-primary').click()
    
    // Verificar se a mensagem de sucesso aparece
    cy.get('.toast').should('be.visible')
    cy.contains('.toast-title', 'Conta criada com sucesso!').should('be.visible')
    cy.contains('.toast-message', 'Bem-vindo ao Gerir.me!').should('be.visible')
  })

  it('Criação de conta com dados inválidos não deve permitir o registro', () => {
    cy.visit('http://localhost:8080/')
    cy.get('#showRegister').click()   
    cy.get('#registerName').click().type('')
    cy.get('#registerEmail').click().type('')
    cy.get('#registerPassword').click().type('')
    cy.get('#confirmPassword').click().type('')
    cy.get('#registerForm > .btn-primary').click()
    cy.get('.toast').should('be.visible')
   })

})