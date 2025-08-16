describe('registro de usuário', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#register-link').click()
  })

  it('registra usuário com sucesso', () => {
    cy.get('#register-name').type('João Silva')
    cy.get('#register-email').type('joao@teste.com')
    cy.get('#register-password').type('123456')
    cy.get('#register-confirm-password').type('123456')
    cy.get('#register-form').submit()
    cy.get('.success-message').should('be.visible')
  })

  it('mostra erro quando email é inválido', () => {
    cy.get('#register-name').type('João Silva')
    cy.get('#register-email').type('email-invalido')
    cy.get('#register-password').type('123456')
    cy.get('#register-confirm-password').type('123456')
    cy.get('#register-form').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Email inválido')
  })

  it('mostra erro quando senha é muito curta', () => {
    cy.get('#register-name').type('João Silva')
    cy.get('#register-email').type('joao@teste.com')
    cy.get('#register-password').type('123')
    cy.get('#register-confirm-password').type('123')
    cy.get('#register-form').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'A senha deve ter pelo menos 6 caracteres')
  })

  it('mostra erro quando senhas não coincidem', () => {
    cy.get('#register-name').type('João Silva')
    cy.get('#register-email').type('joao@teste.com')
    cy.get('#register-password').type('123456')
    cy.get('#register-confirm-password').type('654321')
    cy.get('#register-form').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'As senhas não coincidem')
  })

  it('mostra erro quando email já está cadastrado', () => {
    cy.get('#register-name').type('João Silva')
    cy.get('#register-email').type('email@teste.com')
    cy.get('#register-password').type('123456')
    cy.get('#register-confirm-password').type('123456')
    cy.get('#register-form').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Este email já está cadastrado')
  })

  it('mostra erro quando campos estão vazios', () => {
    cy.get('#register-form').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'Preencha todos os campos obrigatórios')
  })

  it('mostra erro quando nome é muito curto', () => {
    cy.get('#register-name').type('Jo')
    cy.get('#register-email').type('joao@teste.com')
    cy.get('#register-password').type('123456')
    cy.get('#register-confirm-password').type('123456')
    cy.get('#register-form').submit()
    cy.get('.error-message').should('be.visible')
    cy.get('.error-message').should('contain', 'O nome deve ter pelo menos 3 caracteres')
  })
})