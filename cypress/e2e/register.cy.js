describe('Testes de Registro', () => {
  it('deve registrar um novo usuário com sucesso', () => {
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

  it('deve mostrar erro para dados inválidos', () => {
    cy.visit('http://localhost:8080/')
    cy.get('#showRegister').click()   
    cy.get('#registerName').click().type('')
    cy.get('#registerEmail').click().type('')
    cy.get('#registerPassword').click().type('')
    cy.get('#confirmPassword').click().type('')
    cy.get('#registerForm > .btn-primary').click()
    cy.get('.toast').should('be.visible')
  })

  it('deve mostrar erro para email duplicado', () => {
    cy.visit('http://localhost:8080/')
    cy.get('#showRegister').click()
    cy.get('#registerName').type('Usuario Teste')
    cy.get('#registerEmail').type('teste@teste.com')
    cy.get('#registerPassword').type('123456@Teste')
    cy.get('#confirmPassword').type('123456@Teste')
    cy.get('#registerForm > .btn-primary').click()
    cy.get('.toast').should('be.visible')
  })

  it('deve validar formato do email', () => {
    cy.visit('http://localhost:8080/')
    cy.get('#showRegister').click()
    cy.get('#registerName').type('Usuario Teste')
    cy.get('#registerEmail').type('email-invalido')
    cy.get('#registerPassword').type('123456@Teste')
    cy.get('#confirmPassword').type('123456@Teste')
    cy.get('#registerForm > .btn-primary').click()
    cy.get('.toast').should('be.visible')
  })

  it('deve validar força da senha', () => {
    cy.visit('http://localhost:8080/')
    cy.get('#showRegister').click()
    cy.get('#registerName').type('Usuario Teste')
    cy.get('#registerEmail').type('novo@teste.com')
    cy.get('#registerPassword').type('123')
    cy.get('#confirmPassword').type('123')
    cy.get('#registerForm > .btn-primary').click()
    cy.get('.toast').should('be.visible')
  })

})