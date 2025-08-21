describe('Testes de registro de usário', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#showRegister').should('be.visible').click();
  });

  describe('Validação de campos obrigatórios', () => {
    it('deve validar campo nome vazio', () => {
      cy.get('#registerEmail').type('teste@email.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerNameError').should('contain', 'Nome é obrigatório.');
    });

    it('deve validar campo email vazio', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail é obrigatório.');
    });

    it('deve validar campo senha vazio', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao@teste.com');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerPasswordError').should('contain', 'Senha é obrigatória.');
    });

    it('deve validar campo confirmação de senha vazio', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao@teste.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#confirmPasswordError').should('contain', 'Confirmação de senha é obrigatória.');
    });

    it('deve validar todos os campos vazios', () => {
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerNameError').should('contain', 'Nome é obrigatório.');
      cy.get('#registerEmailError').should('contain', 'E-mail é obrigatório.');
      cy.get('#registerPasswordError').should('contain', 'Senha é obrigatória.');
      cy.get('#confirmPasswordError').should('contain', 'Confirmação de senha é obrigatória.');
    });
  });

  describe('Validação de formato de e-mail', () => {
    it('deve validar e-mail duplicado', () => {
      // Primeiro cadastro
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao@teste.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('.toast.success').should('be.visible');
      
      // Logout para tentar cadastrar novamente
      cy.get('#logoutBtn').click();
      cy.get('#showRegister').click();
      
      // Tentativa de cadastro com mesmo e-mail
      cy.get('#registerName').type('Maria Silva');
      cy.get('#registerEmail').type('joao@teste.com');
      cy.get('#registerPassword').type('OutraSenh@456');
      cy.get('#confirmPassword').type('OutraSenh@456');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail já cadastrado.');
    });

    it('deve validar e-mail sem @', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('emailinvalido.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail inválido.');
    });

    it('deve validar e-mail sem domínio', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('email@');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail inválido.');
    });

    it('deve validar e-mail sem extensão', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('email@dominio');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail inválido.');
    });

    it('deve validar e-mail com espaços', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('email @dominio.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#registerEmailError').should('contain', 'E-mail inválido.');
    });
  });


  describe('Validação de senhas', () => {
    // Testes de Política de Senha Forte
  describe('Validação de Complexidade de Senha', () => {
    it('deve aceitar senha que atende todos os critérios', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao.teste@email.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123');
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('.toast.success').should('be.visible');
      cy.get('#registerPasswordError').should('not.exist');
    });

    it('deve rejeitar senha com menos de 8 caracteres', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao.teste@email.com');
      cy.get('#registerPassword').type('Abc@1');
      cy.get('#confirmPassword').type('Abc@1');
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('#registerPasswordError').should('contain', 'Senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e símbolos.');
    });

    it('deve rejeitar senha sem letra maiúscula', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao.teste@email.com');
      cy.get('#registerPassword').type('minhasen@123');
      cy.get('#confirmPassword').type('minhasen@123');
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('#registerPasswordError').should('contain', 'Senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e símbolos.');
    });

    it('deve rejeitar senha sem letra minúscula', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao.teste@email.com');
      cy.get('#registerPassword').type('MINHASEN@123');
      cy.get('#confirmPassword').type('MINHASEN@123');
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('#registerPasswordError').should('contain', 'Senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e símbolos.');
    });

    it('deve rejeitar senha sem número', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao.teste@email.com');
      cy.get('#registerPassword').type('MinhaSen@ha');
      cy.get('#confirmPassword').type('MinhaSen@ha');
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('#registerPasswordError').should('contain', 'Senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e símbolos.');
    });

    it('deve rejeitar senha sem caractere especial', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao.teste@email.com');
      cy.get('#registerPassword').type('MinhaSenha123');
      cy.get('#confirmPassword').type('MinhaSenha123');
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('#registerPasswordError').should('contain', 'Senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e símbolos.');
    });

    it('deve validar senha com exatamente 8 caracteres', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao.teste@email.com');
      cy.get('#registerPassword').type('Abc@123d');
      cy.get('#confirmPassword').type('Abc@123d');
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('.toast.success').should('be.visible');
    });

    it('deve aceitar senha com múltiplos caracteres especiais', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao.teste@email.com');
      cy.get('#registerPassword').type('Minh@Sen#a123!');
      cy.get('#confirmPassword').type('Minh@Sen#a123!');
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('.toast.success').should('be.visible');
    });
  });

  describe('Validação Avançada de Confirmação de Senha', () => {
    it('deve detectar diferenças sutis entre senhas', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao.teste@email.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@123 '); // Espaço extra
      cy.get('#registerForm > .btn-primary').click();
      
      cy.get('#confirmPasswordError').should('contain', 'Senhas não coincidem.');
    });
  });

    it('deve validar senhas não coincidem', () => {
      cy.get('#registerName').type('João Silva');
      cy.get('#registerEmail').type('joao@teste.com');
      cy.get('#registerPassword').type('MinhaSenh@123');
      cy.get('#confirmPassword').type('MinhaSenh@456');
      cy.get('#registerForm > .btn-primary').click();
      cy.get('#confirmPasswordError').should('contain', 'Senhas não coincidem.');
    });
  });

  // Teste de cadastro bem-sucedido por último para evitar interferências
  describe('Cadastro bem-sucedido', () => {
    it('deve fazer cadastro com dados válidos', () => {
      cy.get('#registerName').should('be.visible').type('Eddie Silva');
      cy.get('#registerEmail').should('be.visible').type('eddieteste@teste.com');
      cy.get('#registerPassword').should('be.visible').type('Eddie@123');
      cy.get('#confirmPassword').should('be.visible').type('Eddie@123');
      cy.get('#registerForm > .btn-primary').should('be.enabled').click();
      cy.get('.toast.success').should('be.visible');
      cy.get('.toast-title').should('contain', 'Conta criada com sucesso!');
      cy.get('#dashboard-container').should('be.visible');
    });
  });

});