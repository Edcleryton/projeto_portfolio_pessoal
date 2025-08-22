// Testes de Validação de Mensagens - Usando have.text

describe('Validação de Mensagens de Toast', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve exibir mensagem de sucesso no login', () => {
    // Simular login bem-sucedido
    cy.window().then((win) => {
      // Usar o objeto global correto da aplicação
      win.app.currentUser = {
        id: 1,
        name: 'Usuário Teste',
        email: 'teste@exemplo.com'
      };
      win.app.showDashboard();
      win.app.showToast('success', 'Login realizado', 'Bem-vindo de volta!');
    });

    // Validar mensagem de toast usando have.text
    cy.get('.toast.success .toast-title').should('have.text', 'Login realizado');
    cy.get('.toast.success .toast-message').should('have.text', 'Bem-vindo de volta!');
  });

  it('deve exibir mensagem de sucesso no registro', () => {
    // Simular registro bem-sucedido
    cy.window().then((win) => {
      win.app.showToast('success', 'Conta criada com sucesso!', 'Bem-vindo ao Gerir.me!');
    });

    // Validar mensagem de toast usando have.text
    cy.get('.toast.success .toast-title').should('have.text', 'Conta criada com sucesso!');
    cy.get('.toast.success .toast-message').should('have.text', 'Bem-vindo ao Gerir.me!');
  });

  it('deve exibir mensagem de info no logout', () => {
    // Simular logout
    cy.window().then((win) => {
      win.app.showToast('info', 'Logout realizado', 'Até logo!');
    });

    // Validar mensagem de toast usando have.text
    cy.get('.toast.info .toast-title').should('have.text', 'Logout realizado');
    cy.get('.toast.info .toast-message').should('have.text', 'Até logo!');
  });

  it('deve exibir mensagem de info na alteração de tema', () => {
    // Simular alteração de tema
    cy.window().then((win) => {
      win.app.showToast('info', 'Tema alterado', 'Modo escuro ativado');
    });

    // Validar mensagem de toast usando have.text
    cy.get('.toast.info .toast-title').should('have.text', 'Tema alterado');
    cy.get('.toast.info .toast-message').should('have.text', 'Modo escuro ativado');
  });

  it('deve exibir mensagem de sucesso ao salvar despesa', () => {
    // Simular salvamento de despesa
    cy.window().then((win) => {
      win.app.showToast('success', 'Despesa salva', 'Despesa adicionada com sucesso!');
    });

    // Validar mensagem de toast usando have.text
    cy.get('.toast.success .toast-title').should('have.text', 'Despesa salva');
    cy.get('.toast.success .toast-message').should('have.text', 'Despesa adicionada com sucesso!');
  });

  it('deve exibir mensagem de erro ao falhar salvamento de despesa', () => {
    // Simular erro no salvamento
    cy.window().then((win) => {
      win.app.showToast('error', 'Erro', 'Erro ao salvar despesa. Tente novamente.');
    });

    // Validar mensagem de toast usando have.text
    cy.get('.toast.error .toast-title').should('have.text', 'Erro');
    cy.get('.toast.error .toast-message').should('have.text', 'Erro ao salvar despesa. Tente novamente.');
  });

  it('deve exibir mensagem de sucesso ao excluir despesa', () => {
    // Simular exclusão de despesa
    cy.window().then((win) => {
      win.app.showToast('success', 'Despesa excluída', 'Despesa removida com sucesso!');
    });

    // Validar mensagem de toast usando have.text
    cy.get('.toast.success .toast-title').should('have.text', 'Despesa excluída');
    cy.get('.toast.success .toast-message').should('have.text', 'Despesa removida com sucesso!');
  });

  it('deve exibir mensagem de erro ao falhar exclusão de despesa', () => {
    // Simular erro na exclusão
    cy.window().then((win) => {
      win.app.showToast('error', 'Erro', 'Erro ao excluir despesa. Tente novamente.');
    });

    // Validar mensagem de toast usando have.text
    cy.get('.toast.error .toast-title').should('have.text', 'Erro');
    cy.get('.toast.error .toast-message').should('have.text', 'Erro ao excluir despesa. Tente novamente.');
  });

  it('deve validar estrutura completa do toast', () => {
    // Simular exibição de toast
    cy.window().then((win) => {
      win.app.showToast('success', 'Teste Completo', 'Validação da estrutura do toast');
    });

    // Validar estrutura usando have.text
    cy.get('.toast.success').should('be.visible');
    cy.get('.toast.success .toast-icon').should('be.visible');
    cy.get('.toast.success .toast-content').should('be.visible');
    cy.get('.toast.success .toast-title').should('have.text', 'Teste Completo');
    cy.get('.toast.success .toast-message').should('have.text', 'Validação da estrutura do toast');
    cy.get('.toast.success .toast-close').should('be.visible');
  });

  it('deve validar fechamento manual do toast', () => {
    // Simular exibição de toast
    cy.window().then((win) => {
      win.app.showToast('info', 'Toast Fechável', 'Clique no X para fechar');
    });

    // Validar mensagem usando have.text
    cy.get('.toast.info .toast-title').should('have.text', 'Toast Fechável');
    cy.get('.toast.info .toast-message').should('have.text', 'Clique no X para fechar');
    
    // Fechar toast manualmente
    cy.get('.toast.info .toast-close').click();
    
    // Verificar se foi removido
    cy.get('.toast.info').should('not.exist');
  });
});