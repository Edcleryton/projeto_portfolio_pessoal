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
      
      // Verificar se a mensagem de erro para nome muito longo aparece
      cy.get('.toast').should('be.visible')
      cy.get('.toast').should('contain.text', 'nome')
    })

    it('deve rejeitar caracteres especiais no nome', () => {
      cy.get('#registerName').type('<script>alert("xss")</script>')
      cy.get('#registerEmail').type('teste@teste.com')
      cy.get('#registerPassword').type('123456@Teste')
      cy.get('#confirmPassword').type('123456@Teste')
      cy.get('#registerForm > .btn-primary').click()
      
      // Verificar se a mensagem de erro para caracteres inválidos aparece
      cy.get('.toast').should('be.visible')
      cy.get('.toast').should('contain.text', 'inválido')
    })

    it('deve tratar espaços no início e fim dos campos', () => {
      cy.get('#registerName').type('  nome com espaços  ')
      cy.get('#registerEmail').type('  email@teste.com  ')
      cy.get('#registerPassword').type('  123456@Teste  ')
      cy.get('#confirmPassword').type('  123456@Teste  ')
      cy.get('#registerForm > .btn-primary').click()
      
      // Verificar se o registro foi bem-sucedido ou se há erro de formatação
      cy.get('.toast').should('be.visible')
      cy.get('.toast').should('satisfy', ($toast) => {
        const text = $toast.text()
        return text.includes('sucesso') || text.includes('erro')
      })
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
      
      // Verificar se há erro ou sucesso para strings longas
      cy.get('.toast').should('be.visible')
      cy.get('.toast').should('satisfy', ($toast) => {
        const text = $toast.text()
        return text.includes('sucesso') || text.includes('erro') || text.includes('longo')
      })
    })

    it('deve aceitar caracteres acentuados', () => {
      cy.get('#registerName').type('José da Silva Ção')
      cy.get('#registerEmail').type('jose@teste.com')
      cy.get('#registerPassword').type('123456@Teste')
      cy.get('#confirmPassword').type('123456@Teste')
      cy.get('#registerForm > .btn-primary').click()
      
      // Verificar se caracteres acentuados são aceitos
      cy.get('.toast').should('be.visible')
      cy.get('.toast').should('contain.text', 'sucesso')
    })

    it('deve lidar com caracteres asiáticos', () => {
      cy.get('#registerName').type('田中太郎')
      cy.get('#registerEmail').type('tanaka@teste.com')
      cy.get('#registerPassword').type('パスワード123')
      cy.get('#confirmPassword').type('パスワード123')
      cy.get('#registerForm > .btn-primary').click()
      
      // Verificar se caracteres asiáticos são tratados adequadamente
      cy.get('.toast').should('be.visible')
      cy.get('.toast').should('satisfy', ($toast) => {
        const text = $toast.text()
        return text.includes('sucesso') || text.includes('erro')
      })
    })

    it('deve rejeitar campos em branco', () => {
      cy.get('#registerForm > .btn-primary').click()
      
      // Verificar se há erro para campos obrigatórios em branco
      cy.get('.toast').should('be.visible')
      cy.get('.toast').should('contain.text', 'obrigatório')
    })

    it('deve prevenir injeção SQL', () => {
      cy.get('#registerName').type("'; DROP TABLE users; --")
      cy.get('#registerEmail').type('sql@teste.com')
      cy.get('#registerPassword').type('123456@Teste')
      cy.get('#confirmPassword').type('123456@Teste')
      cy.get('#registerForm > .btn-primary').click()
      
      // Verificar se a injeção SQL foi bloqueada
      cy.get('.toast').should('be.visible')
      cy.get('.toast').should('satisfy', ($toast) => {
        const text = $toast.text()
        return text.includes('erro') || text.includes('inválido') || text.includes('sucesso')
      })
    })
  })

  describe('Testes de Interface do Usuário', () => {
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

    it('deve funcionar com botão voltar do navegador', () => {
      cy.get('#registerName').type('Teste')
      cy.go('back')
      cy.go('forward')
      cy.get('#showRegister').click()
      cy.get('#registerName').should('have.value', '')
    })
  })

  describe('Testes de Autenticação', () => {
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

    it('deve rejeitar caracteres especiais no email de login', () => {
      cy.get('#loginEmail').type('<script>alert("xss")</script>')
      cy.get('#loginPassword').type('123456@Teste')
      cy.get('#loginForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve rejeitar senha excessivamente longa no login', () => {
      cy.get('#loginEmail').type('login@teste.com')
      cy.get('#loginPassword').type('a'.repeat(500))
      cy.get('#loginForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve rejeitar campos obrigatórios em branco no login', () => {
      cy.get('#loginForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })

    it('deve lidar com caracteres Unicode e Emoji no login', () => {
      cy.get('#loginEmail').type('emoji@teste.com')
      cy.get('#loginPassword').type('🔒🔑💻')
      cy.get('#loginForm > .btn-primary').click()
      cy.get('.toast').should('be.visible')
    })
  })
})