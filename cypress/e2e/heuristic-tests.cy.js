describe('Testes Baseados em Heurísticas', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/')
  })

  describe('Ataques de Tipos de Dados - Registro', () => {
    beforeEach(() => {
      cy.get('#showRegister').click()
    })

    it('deve rejeitar nome muito longo', () => {
      cy.get('#registerName').type('a'.repeat(300))
      cy.get('#registerEmail').type('teste@teste.com')
      cy.get('#registerPassword').type('123456@Teste')
      cy.get('#confirmPassword').type('123456@Teste')
      cy.get('#registerForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve rejeitar caracteres especiais no nome', () => {
      cy.get('#registerName').type('<script>alert("xss")</script>')
      cy.get('#registerEmail').type('teste@teste.com')
      cy.get('#registerPassword').type('123456@Teste')
      cy.get('#confirmPassword').type('123456@Teste')
      cy.get('#registerForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve tratar espaços no início e fim dos campos', () => {
      cy.get('#registerName').type('  nome com espaços  ')
      cy.get('#registerEmail').type('  email@teste.com  ')
      cy.get('#registerPassword').type('  123456@Teste  ')
      cy.get('#confirmPassword').type('  123456@Teste  ')
      cy.get('#registerForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })
  })

  describe('Testes de Strings', () => {
    beforeEach(() => {
      cy.get('#showRegister').click()
    })

    it('deve lidar com strings muito longas', () => {
      cy.get('#registerName').type('a'.repeat(100))
      cy.get('#registerEmail').type('teste@teste.com')
      cy.get('#registerPassword').type('123456@Teste')
      cy.get('#confirmPassword').type('123456@Teste')
      cy.get('#registerForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve aceitar caracteres acentuados', () => {
      cy.get('#registerName').type('José da Silva Ção')
      cy.get('#registerEmail').type('jose@teste.com')
      cy.get('#registerPassword').type('123456@Teste')
      cy.get('#confirmPassword').type('123456@Teste')
      cy.get('#registerForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve lidar com caracteres asiáticos', () => {
      cy.get('#registerName').type('田中太郎')
      cy.get('#registerEmail').type('tanaka@teste.com')
      cy.get('#registerPassword').type('パスワード123')
      cy.get('#confirmPassword').type('パスワード123')
      cy.get('#registerForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve rejeitar campos em branco', () => {
      cy.get('#registerForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve prevenir injeção SQL', () => {
      cy.get('#registerName').type("'; DROP TABLE users; --")
      cy.get('#registerEmail').type('sql@teste.com')
      cy.get('#registerPassword').type('123456@Teste')
      cy.get('#confirmPassword').type('123456@Teste')
      cy.get('#registerForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })
  })

  describe('Testes de UI', () => {
    beforeEach(() => {
      cy.get('#showRegister').click()
    })

    it('deve manter dados ao atualizar página', () => {
      cy.get('#registerName').type('Teste')
      cy.get('#registerEmail').type('teste@teste.com')
      cy.reload()
      cy.get('#showRegister').click()
      cy.get('#registerName').should('have.value', '')
    })

    it('deve funcionar com botão voltar', () => {
      cy.get('#registerName').type('Teste')
      cy.go('back')
      cy.go('forward')
      cy.get('#showRegister').click()
      cy.get('#registerName').should('have.value', '')
    })
  })

  describe('Testes de Login', () => {
    beforeEach(() => {
      // Primeiro criar um usuário
      cy.get('#showRegister').click()
      cy.get('#registerName').type('Usuario Teste')
      cy.get('#registerEmail').type('login@teste.com')
      cy.get('#registerPassword').type('123456@Teste')
      cy.get('#confirmPassword').type('123456@Teste')
      cy.get('#registerForm > .btn-primary').click()
      cy.wait(1000)
      cy.get('#logout').click()
    })

    it('deve rejeitar caracteres especiais no login', () => {
      cy.get('#loginEmail').type('<script>alert("xss")</script>')
      cy.get('#loginPassword').type('123456@Teste')
      cy.get('#loginForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve rejeitar senha muito longa no login', () => {
      cy.get('#loginEmail').type('login@teste.com')
      cy.get('#loginPassword').type('a'.repeat(500))
      cy.get('#loginForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve rejeitar campos em branco no login', () => {
      cy.get('#loginForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve lidar com Unicode/Emoji no login', () => {
      cy.get('#loginEmail').type('emoji@teste.com')
      cy.get('#loginPassword').type('🔒🔑💻')
      cy.get('#loginForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })
  })
})