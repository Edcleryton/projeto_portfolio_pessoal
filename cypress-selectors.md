# Seletores Cypress - Data TestID

Este documento lista todos os atributos `data-testid` disponíveis na aplicação para facilitar a criação de testes automatizados com Cypress.

## Formulários de Autenticação

### Formulário de Login
- `login-email-input` - Campo de e-mail do login
- `login-email-error` - Mensagem de erro do e-mail do login
- `login-password-input` - Campo de senha do login
- `login-password-error` - Mensagem de erro da senha do login
- `login-submit-btn` - Botão de submissão do login
- `show-register-link` - Link para alternar para o formulário de registro

### Formulário de Registro
- `register-name-input` - Campo de nome completo do registro
- `register-name-error` - Mensagem de erro do nome do registro
- `register-email-input` - Campo de e-mail do registro
- `register-email-error` - Mensagem de erro do e-mail do registro
- `register-password-input` - Campo de senha do registro
- `register-password-error` - Mensagem de erro da senha do registro
- `confirm-password-input` - Campo de confirmação de senha
- `confirm-password-error` - Mensagem de erro da confirmação de senha
- `register-submit-btn` - Botão de submissão do registro
- `show-login-link` - Link para alternar para o formulário de login

## Dashboard

### Cabeçalho
- `theme-toggle-btn` - Botão de alternância de tema
- `user-menu-btn` - Botão do menu do usuário
- `user-dropdown` - Dropdown do menu do usuário
- `logout-btn` - Botão de logout

### Navegação
- `sidebar` - Barra lateral de navegação
- `sidebar-nav` - Navegação da barra lateral
- `nav-overview` - Link de navegação para Visão Geral
- `nav-expenses` - Link de navegação para Despesas
- `nav-calendar` - Link de navegação para Calendário

### Área de Conteúdo
- `content-area` - Área principal de conteúdo
- `overview-section` - Seção de visão geral
- `expenses-section` - Seção de despesas

### Cards de Resumo
- `summary-cards` - Container dos cards de resumo
- `monthly-card` - Card de gasto mensal
- `monthly-total` - Valor do gasto mensal
- `recurring-card` - Card de despesas recorrentes
- `recurring-total` - Valor das despesas recorrentes
- `unique-card` - Card de despesas únicas
- `unique-total` - Valor das despesas únicas

### Próximos Pagamentos
- `upcoming-payments` - Container de próximos pagamentos
- `payments-list` - Lista de pagamentos
- `no-upcoming-payments` - Estado vazio quando não há pagamentos

## Gerenciamento de Despesas

### Controles
- `add-expense-btn` - Botão para adicionar nova despesa
- `category-filter` - Filtro de categoria
- `prev-month-btn` - Botão para mês anterior
- `next-month-btn` - Botão para próximo mês

### Tabela de Despesas
- `expenses-table` - Tabela de despesas
- `expense-row` - Linha da tabela de despesa
- `expense-name` - Nome da despesa
- `expense-value` - Valor da despesa
- `expense-category` - Categoria da despesa
- `expense-type` - Tipo da despesa
- `expense-date` - Data da despesa
- `expense-actions` - Ações da despesa
- `edit-expense-btn` - Botão de editar despesa
- `delete-expense-btn` - Botão de excluir despesa

## Modal de Despesas

### Formulário
- `expense-form` - Formulário de despesa
- `expense-name-input` - Campo nome da despesa
- `expense-name-error` - Mensagem de erro do nome
- `expense-value-input` - Campo valor da despesa
- `expense-value-error` - Mensagem de erro do valor
- `expense-category-select` - Seletor de categoria
- `expense-category-error` - Mensagem de erro da categoria
- `expense-type-select` - Seletor de tipo
- `expense-type-error` - Mensagem de erro do tipo

### Campos Condicionais
- `unique-fields` - Container dos campos para despesa única
- `expense-date-input` - Campo de data da despesa
- `expense-date-error` - Mensagem de erro da data
- `recurring-fields` - Container dos campos para despesa recorrente
- `expense-cycle-select` - Seletor de ciclo de cobrança
- `expense-cycle-error` - Mensagem de erro do ciclo
- `next-payment-input` - Campo de próxima data de cobrança
- `next-payment-error` - Mensagem de erro da próxima data

### Ações do Modal
- `modal-actions` - Container das ações do modal
- `close-modal-btn` - Botão de fechar modal
- `cancel-btn` - Botão de cancelar
- `save-btn` - Botão de salvar

## Modal de Confirmação
- `confirm-modal` - Modal de confirmação
- `confirm-cancel-btn` - Botão de cancelar confirmação
- `confirm-ok-btn` - Botão de confirmar ação

## Sistema de Notificações (Toast)
- `toast-container` - Container de notificações
- `toast-success` - Toast de sucesso
- `toast-error` - Toast de erro
- `toast-warning` - Toast de aviso
- `toast-info` - Toast de informação
- `toast-icon` - Ícone do toast
- `toast-content` - Conteúdo do toast
- `toast-title` - Título do toast
- `toast-message` - Mensagem do toast
- `toast-close` - Botão de fechar toast

## Exemplos de Uso no Cypress

```javascript
// Fazer login
cy.get('[data-testid="login-email-input"]').type('usuario@exemplo.com');
cy.get('[data-testid="login-password-input"]').type('senha123');
cy.get('[data-testid="login-submit-btn"]').click();

// Verificar mensagem de erro
cy.get('[data-testid="login-email-error"]').should('be.visible');
cy.get('[data-testid="login-email-error"]').should('contain', 'E-mail é obrigatório');

// Adicionar nova despesa
cy.get('[data-testid="add-expense-btn"]').click();
cy.get('[data-testid="expense-name-input"]').type('Supermercado');
cy.get('[data-testid="expense-value-input"]').type('150.00');
cy.get('[data-testid="expense-category-select"]').select('Alimentação');
cy.get('[data-testid="save-btn"]').click();

// Verificar toast de sucesso
cy.get('[data-testid="toast-success"]').should('be.visible');
cy.get('[data-testid="toast-message"]').should('contain', 'Despesa salva com sucesso');

// Filtrar despesas por categoria
cy.get('[data-testid="category-filter"]').select('Alimentação');
cy.get('[data-testid="expenses-table"]').should('contain', 'Supermercado');
```

## Notas Importantes

1. Todos os elementos de mensagem de erro possuem seletores específicos para facilitar a validação de mensagens de validação.
2. Os elementos criados dinamicamente (como linhas da tabela de despesas e toasts) também possuem atributos data-testid.
3. Os seletores seguem um padrão consistente: `[elemento]-[ação/tipo]` (ex: `login-email-input`, `expense-name-error`).
4. Para elementos de lista/tabela, use `data-expense-id` em conjunto com `data-testid` para identificar itens específicos.