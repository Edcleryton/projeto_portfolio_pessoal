describe('Testes de Validação', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/')
  })

  describe('Validação de HTML/CSS', () => {
    it('deve validar estrutura HTML', () => {
      cy.get('html').should('exist')
      cy.get('head').should('exist')
      cy.get('body').should('exist')
      cy.get('title').should('exist')
    })

    it('deve validar acessibilidade dos formulários', () => {
      cy.get('main, section, article, header, footer').should('exist')
    })

    it('deve validar estilos CSS', () => {
      cy.get('body').should('have.css', 'margin')
      cy.get('body').should('have.css', 'padding')
    })
  })

  describe('Testes de Responsividade', () => {
    const viewports = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1024, height: 768, name: 'iPad Landscape' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ]

    viewports.forEach(viewport => {
      it(`Testar layout em ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        cy.viewport(viewport.width, viewport.height)
        
        // Verificar se elementos principais são visíveis
        cy.get('#loginForm').should('be.visible')
        cy.get('#loginEmail').should('be.visible')
        cy.get('#loginPassword').should('be.visible')
        cy.get('#loginForm > .btn-primary').should('be.visible')
        
        // Verificar se não há overflow horizontal
        cy.get('body').then(($body) => {
          expect($body[0].scrollWidth).to.be.at.most(viewport.width + 20) // 20px de tolerância
        })
        
        // Testar formulário de registro
        cy.get('#showRegister').click()
        cy.get('#registerForm').should('be.visible')
        cy.get('#registerName').should('be.visible')
        cy.get('#registerEmail').should('be.visible')
        cy.get('#registerPassword').should('be.visible')
        cy.get('#confirmPassword').should('be.visible')
      })
    })
  })

  describe('Testes de Performance', () => {
    it('Verificar tempo de carregamento da página', () => {
      const startTime = Date.now()
      
      cy.visit('http://localhost:8080/').then(() => {
        const loadTime = Date.now() - startTime
        expect(loadTime).to.be.lessThan(5000) // Menos de 5 segundos
      })
    })

    it('Verificar se recursos são carregados', () => {
      // Verificar se CSS está carregado
      cy.get('link[rel="stylesheet"], style').should('exist')
      
      // Verificar se JavaScript está funcionando
      cy.get('#showRegister').click()
      cy.get('#registerForm').should('be.visible')
    })

    it('Testar com conexão lenta (simulação)', () => {
      // Simular conexão lenta
      cy.intercept('**/*', (req) => {
        req.reply((res) => {
          // Adicionar delay de 2 segundos
          return new Promise(resolve => {
            setTimeout(() => resolve(res), 2000)
          })
        })
      })
      
      cy.visit('http://localhost:8080/')
      cy.get('#loginForm').should('be.visible')
    })
  })

  describe('Testes de Segurança', () => {
    it('Verificar se não há informações sensíveis expostas', () => {
      // Verificar se não há senhas em texto plano no HTML
      cy.get('body').should('not.contain', 'password=')
      cy.get('body').should('not.contain', 'senha=')
      
      // Verificar se inputs de senha têm type="password"
      cy.get('input[type="password"]').should('exist')
      cy.get('input').each(($input) => {
        const id = $input.attr('id') || ''
        const name = $input.attr('name') || ''
        const placeholder = $input.attr('placeholder') || ''
        
        if (id.toLowerCase().includes('password') || 
            name.toLowerCase().includes('password') ||
            placeholder.toLowerCase().includes('senha')) {
          cy.wrap($input).should('have.attr', 'type', 'password')
        }
      })
    })

    it('Verificar headers de segurança (simulação)', () => {
      cy.request('http://localhost:8080/').then((response) => {
        // Verificar se a resposta não contém informações sensíveis
        expect(response.body).to.not.include('password')
        expect(response.body).to.not.include('secret')
        expect(response.body).to.not.include('token')
      })
    })

    it('Testar proteção contra XSS', () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        'javascript:alert("XSS")',
        '<svg onload=alert("XSS")>',
        '"><script>alert("XSS")</script>'
      ]
      
      cy.get('#showRegister').click()
      
      xssPayloads.forEach(payload => {
        cy.get('#registerName').clear().type(payload)
        cy.get('#registerEmail').clear().type('xss@test.com')
        cy.get('#registerPassword').clear().type('123456@Test')
        cy.get('#confirmPassword').clear().type('123456@Test')
        cy.get('#registerForm > .btn-primary').click()
        
        // Verificar se não há execução de script
        cy.on('window:alert', (str) => {
          expect(str).to.not.equal('XSS')
        })
        
        cy.wait(1000)
      })
    })
  })

  describe('Testes de Usabilidade', () => {
    it('Verificar navegação por teclado', () => {
      // Testar navegação com Tab
      cy.get('body').tab()
      cy.focused().should('be.visible')
      
      // Continuar navegação
      cy.focused().tab()
      cy.focused().should('be.visible')
      
      cy.focused().tab()
      cy.focused().should('be.visible')
    })

    it('Verificar feedback visual para estados de foco', () => {
      cy.get('#loginEmail').focus()
      cy.get('#loginEmail').should('have.css', 'outline').and('not.equal', 'none')
      
      cy.get('#loginPassword').focus()
      cy.get('#loginPassword').should('have.css', 'outline').and('not.equal', 'none')
    })

    it('Verificar mensagens de erro são claras', () => {
      // Tentar login com dados inválidos
      cy.get('#loginEmail').type('email-invalido')
      cy.get('#loginPassword').type('senha-errada')
      cy.get('#loginForm > .btn-primary').click()
      
      // Verificar se aparece mensagem de erro clara
      cy.get('.toast').should('be.visible')
      cy.get('.toast').should('contain.text', 'erro')
    })

    it('Verificar consistência de design', () => {
      // Verificar se botões têm estilo consistente
      cy.get('button').then(($buttons) => {
        if ($buttons.length > 1) {
          const firstButtonStyles = {
            fontFamily: $buttons.eq(0).css('font-family'),
            fontSize: $buttons.eq(0).css('font-size'),
            borderRadius: $buttons.eq(0).css('border-radius')
          }
          
          $buttons.each((index, button) => {
            if (index > 0) {
              const $btn = Cypress.$(button)
              // Verificar se mantém consistência (com alguma tolerância)
              expect($btn.css('font-family')).to.equal(firstButtonStyles.fontFamily)
            }
          })
        }
      })
    })
  })

  describe('Testes com JavaScript Desabilitado', () => {
    it('deve degradar graciosamente sem JavaScript', () => {
      // Verificar se flexbox está sendo usado
      cy.get('*').then(($elements) => {
        let hasFlexbox = false
        $elements.each((index, element) => {
          const display = Cypress.$(element).css('display')
          if (display === 'flex' || display === 'inline-flex') {
            hasFlexbox = true
          }
        })
        // Se usar flexbox, verificar se está funcionando
        if (hasFlexbox) {
          cy.log('Aplicação usa Flexbox')
        }
      })
    })

    it('deve mostrar mensagem apropriada quando JS está desabilitado', () => {
      // Desabilitar JavaScript não é possível no Cypress,
      // mas podemos verificar se elementos HTML básicos existem
      cy.get('form').should('exist')
      cy.get('input').should('exist')
      cy.get('button').should('exist')
      
      // Verificar se formulários têm action e method
      cy.get('form').each(($form) => {
        // Formulários devem ter pelo menos um método de submissão
        cy.wrap($form).should('satisfy', ($el) => {
          return $el.attr('action') !== undefined || 
                 $el.find('button[type="submit"], input[type="submit"]').length > 0
        })
      })
    })
  })

  describe('Testes de Dados e Estado', () => {
    it('Verificar persistência de dados no localStorage', () => {
      // Fazer login
      cy.get('#loginEmail').type('eddie@gerir.me')
      cy.get('#loginPassword').type('Eddie123')
      cy.get('#loginForm > .btn-primary').click()
      
      cy.wait(2000)
      
      // Verificar se dados foram salvos no localStorage
      cy.window().then((win) => {
        const userData = win.localStorage.getItem('currentUser')
        expect(userData).to.not.be.null
      })
      
      // Recarregar página e verificar se ainda está logado
      cy.reload()
      cy.get('#dashboard').should('be.visible')
    })

    it('Verificar limpeza de dados sensíveis', () => {
      // Fazer login
      cy.get('#loginEmail').type('eddie@gerir.me')
      cy.get('#loginPassword').type('Eddie123')
      cy.get('#loginForm > .btn-primary').click()
      
      cy.wait(2000)
      
      // Fazer logout
      cy.get('#logoutBtn').click()
      
      // Verificar se dados sensíveis foram limpos
      cy.window().then((win) => {
        const userData = win.localStorage.getItem('currentUser')
        if (userData) {
          const user = JSON.parse(userData)
          expect(user.password).to.be.undefined
        }
      })
    })
  })
})