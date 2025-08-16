// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Comando personalizado para login rápido
Cypress.Commands.add('loginAsTestUser', () => {
  cy.visit('/');
  cy.get('#login-email').type(Cypress.env('testUser').email);
  cy.get('#login-password').type(Cypress.env('testUser').password);
  cy.get('#login-form-element').submit();
  cy.get('#app-container').should('be.visible');
});

// Comando para screenshots com configurações otimizadas
Cypress.Commands.add('takeScreenshot', (name, options = {}) => {
  const defaultOptions = {
    capture: 'viewport',
    disableTimersAndAnimations: true,
    ...options
  };
  
  return cy.screenshot(name, defaultOptions);
});