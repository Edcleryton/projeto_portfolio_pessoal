// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hook para capturar falhas de teste e gerar relatórios automáticos
Cypress.on('test:after:run', (test, runnable) => {
  // Se o teste falhou, adicionar ao relatório de defeitos
  if (test.state === 'failed') {
    const testResult = {
      title: test.titlePath,
      spec: {
        name: test.invocationDetails.relativeFile
      },
      displayError: test.displayError || test.err?.message || 'Erro não especificado'
    };
    
    // Chamar task para adicionar defeito
    cy.task('addDefect', testResult, { log: false });
  }
});

// Hook para gerar relatórios ao final de todos os testes
Cypress.on('run:end', () => {
  cy.task('generateDefectReports', null, { log: false });
});

// Limpar defeitos no início de uma nova execução
Cypress.on('run:start', () => {
  cy.task('clearDefects', null, { log: false });
});