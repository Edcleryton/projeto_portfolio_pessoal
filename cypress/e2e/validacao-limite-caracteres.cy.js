describe('Testes de Validação de Limite de Caracteres', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    describe('Validação de Campos de Login', () => {
        it('deve validar limite de 255 caracteres no campo de e-mail do login', () => {
            const emailLongo = 'a'.repeat(250) + '@test.com'; // 260 caracteres
            const emailValido = 'a'.repeat(245) + '@test.com'; // 255 caracteres
            
            // Testar e-mail muito longo
            cy.get('#loginEmail').type(emailLongo);
            cy.get('#loginPassword').type('123456');
            cy.get('#loginForm > .btn-primary').click();
            cy.get('#loginEmailError').should('contain', 'E-mail deve ter no máximo 255 caracteres.');
            
            // Limpar e testar e-mail no limite
            cy.get('#loginEmail').clear().type(emailValido);
            cy.get('#loginPassword').clear().type('123456');
            cy.get('#loginForm > .btn-primary').click();
            cy.get('#loginEmailError').should('not.contain', 'E-mail deve ter no máximo 255 caracteres.');
        });

        it('deve validar limite de 128 caracteres no campo de senha do login', () => {
            const senhaLonga = 'a'.repeat(129); // 129 caracteres
            const senhaValida = 'a'.repeat(128); // 128 caracteres
            
            // Testar senha muito longa
            cy.get('#loginEmail').type('test@test.com');
            cy.get('#loginPassword').type(senhaLonga);
            cy.get('#loginForm > .btn-primary').click();
            cy.get('#loginPasswordError').should('contain', 'Senha deve ter no máximo 128 caracteres.');
            
            // Limpar e testar senha no limite
            cy.get('#loginEmail').clear().type('test@test.com');
            cy.get('#loginPassword').clear().type(senhaValida);
            cy.get('#loginForm > .btn-primary').click();
            cy.get('#loginPasswordError').should('not.contain', 'Senha deve ter no máximo 128 caracteres.');
        });
    });

    describe('Validação de Campos de Cadastro', () => {
        beforeEach(() => {
            cy.get('#showRegister').click();
        });

        it('deve validar limite de 100 caracteres no campo de nome do cadastro', () => {
            const nomeLongo = 'a'.repeat(101); // 101 caracteres
            const nomeValido = 'a'.repeat(100); // 100 caracteres
            
            // Testar nome muito longo
            cy.get('#registerName').type(nomeLongo);
            cy.get('#registerEmail').type('test@test.com');
            cy.get('#registerPassword').type('123456');
            cy.get('#confirmPassword').type('123456');
            cy.get('#registerForm > .btn-primary').click();
            cy.get('#registerNameError').should('contain', 'Nome deve ter no máximo 100 caracteres.');
            
            // Limpar e testar nome no limite
            cy.get('#registerName').clear().type(nomeValido);
            cy.get('#registerEmail').clear().type('test@test.com');
            cy.get('#registerPassword').clear().type('123456');
            cy.get('#confirmPassword').clear().type('123456');
            cy.get('#registerForm > .btn-primary').click();
            cy.get('#registerNameError').should('not.contain', 'Nome deve ter no máximo 100 caracteres.');
        });

        it('deve validar limite de 255 caracteres no campo de e-mail do cadastro', () => {
            const emailLongo = 'a'.repeat(250) + '@test.com'; // 260 caracteres
            const emailValido = 'a'.repeat(245) + '@test.com'; // 255 caracteres
            
            // Testar e-mail muito longo
            cy.get('#registerName').type('Teste');
            cy.get('#registerEmail').type(emailLongo);
            cy.get('#registerPassword').type('123456');
            cy.get('#confirmPassword').type('123456');
            cy.get('#registerForm > .btn-primary').click();
            cy.get('#registerEmailError').should('contain', 'E-mail deve ter no máximo 255 caracteres.');
            
            // Limpar e testar e-mail no limite
            cy.get('#registerName').clear().type('Teste');
            cy.get('#registerEmail').clear().type(emailValido);
            cy.get('#registerPassword').clear().type('123456');
            cy.get('#confirmPassword').clear().type('123456');
            cy.get('#registerForm > .btn-primary').click();
            cy.get('#registerEmailError').should('not.contain', 'E-mail deve ter no máximo 255 caracteres.');
        });

        it('deve validar limite de 128 caracteres no campo de senha do cadastro', () => {
            const senhaLonga = 'a'.repeat(129); // 129 caracteres
            const senhaValida = 'a'.repeat(128); // 128 caracteres
            
            // Testar senha muito longa
            cy.get('#registerName').type('Teste');
            cy.get('#registerEmail').type('test@test.com');
            cy.get('#registerPassword').type(senhaLonga);
            cy.get('#confirmPassword').type(senhaLonga);
            cy.get('#registerForm > .btn-primary').click();
            cy.get('#registerPasswordError').should('contain', 'Senha deve ter no máximo 128 caracteres.');
            
            // Limpar e testar senha no limite
            cy.get('#registerName').clear().type('Teste');
            cy.get('#registerEmail').clear().type('test@test.com');
            cy.get('#registerPassword').clear().type(senhaValida);
            cy.get('#confirmPassword').clear().type(senhaValida);
            cy.get('#registerForm > .btn-primary').click();
            cy.get('#registerPasswordError').should('not.contain', 'Senha deve ter no máximo 128 caracteres.');
        });

        it('deve validar limite de 128 caracteres no campo de confirmação de senha', () => {
            const senhaLonga = 'a'.repeat(129); // 129 caracteres
            const senhaValida = 'a'.repeat(128); // 128 caracteres
            
            // Testar confirmação de senha muito longa
            cy.get('#registerName').type('Teste');
            cy.get('#registerEmail').type('test@test.com');
            cy.get('#registerPassword').type('123456');
            cy.get('#confirmPassword').type(senhaLonga);
            cy.get('#registerForm > .btn-primary').click();
            cy.get('#confirmPasswordError').should('contain', 'Confirmação de senha deve ter no máximo 128 caracteres.');
            
            // Limpar e testar confirmação no limite
            cy.get('#registerName').clear().type('Teste');
            cy.get('#registerEmail').clear().type('test@test.com');
            cy.get('#registerPassword').clear().type(senhaValida);
            cy.get('#confirmPassword').clear().type(senhaValida);
            cy.get('#registerForm > .btn-primary').click();
            cy.get('#confirmPasswordError').should('not.contain', 'Confirmação de senha deve ter no máximo 128 caracteres.');
        });
    });

    describe('Validação de Campos de Despesas', () => {
        beforeEach(() => {
            // Fazer login primeiro
            cy.fixture('credenciais').then(credenciais => {
                cy.get('#loginEmail').type(credenciais.validas.usuario);
                cy.get('#loginPassword').type(credenciais.validas.senha);
            });
            cy.get('#loginForm > .btn-primary').click();
            cy.get('[data-section="expenses"]').click();
            cy.get('#addExpenseBtn').click();
        });

        it('deve validar limite de 100 caracteres no campo nome da despesa', () => {
            const nomeLongo = 'a'.repeat(101); // 101 caracteres
            const nomeValido = 'a'.repeat(100); // 100 caracteres
            
            // Testar nome muito longo
            cy.get('#expenseName').type(nomeLongo);
            cy.get('#expenseValue').type('25.50');
            cy.get('#expenseCategory').select('Alimentação');
            cy.get('#expenseType').select('unique');
            cy.get('#expenseDate').type('2025-02-15');
            cy.get('#saveBtn').click();
            cy.get('#expenseNameError').should('contain', 'Nome da despesa deve ter no máximo 100 caracteres.');
            
            // Limpar e testar nome no limite
            cy.get('#expenseName').clear().type(nomeValido);
            cy.get('#expenseValue').clear().type('25.50');
            cy.get('#expenseCategory').select('Alimentação');
            cy.get('#expenseType').select('unique');
            cy.get('#expenseDate').type('2025-02-15');
            cy.get('#saveBtn').click();
            cy.get('#expenseNameError').should('not.contain', 'Nome da despesa deve ter no máximo 100 caracteres.');
        });

        it('deve validar nome da despesa com menos de 3 caracteres', () => {
            const nomeCurto = 'ab'; // 2 caracteres
            
            cy.get('#expenseName').type(nomeCurto);
            cy.get('#expenseValue').type('25.50');
            cy.get('#expenseCategory').select('Alimentação');
            cy.get('#expenseType').select('unique');
            cy.get('#expenseDate').type('2025-02-15');
            cy.get('#saveBtn').click();
            cy.get('#expenseNameError').should('contain', 'Nome da despesa deve ter pelo menos 3 caracteres.');
        });
    });

    describe('Validação de Atributos HTML maxlength', () => {
        it('deve verificar se os campos possuem atributo maxlength correto', () => {
            // Verificar campos de login
            cy.get('#loginEmail').should('have.attr', 'maxlength', '255');
            cy.get('#loginPassword').should('have.attr', 'maxlength', '128');
            
            // Verificar campos de cadastro
            cy.get('#showRegister').click();
            cy.get('#registerName').should('have.attr', 'maxlength', '100');
            cy.get('#registerEmail').should('have.attr', 'maxlength', '255');
            cy.get('#registerPassword').should('have.attr', 'maxlength', '128');
            cy.get('#confirmPassword').should('have.attr', 'maxlength', '128');
            
            // Fazer login para verificar campo de despesa
            cy.get('#showLogin').click();
            cy.fixture('credenciais').then(credenciais => {
                cy.get('#loginEmail').type(credenciais.validas.usuario);
                cy.get('#loginPassword').type(credenciais.validas.senha);
            });
            cy.get('#loginForm > .btn-primary').click();
            cy.get('[data-section="expenses"]').click();
            cy.get('#addExpenseBtn').click();
            
            // Verificar campo de nome da despesa
            cy.get('#expenseName').should('have.attr', 'maxlength', '100');
        });
    });
});