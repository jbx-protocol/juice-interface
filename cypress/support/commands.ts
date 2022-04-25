// Imports

import '@testing-library/cypress/add-commands'

// Commands

Cypress.Commands.add('setupMetaMask', () => {
  return cy.task('setupMetaMask')
})