// Imports

import '@testing-library/cypress/add-commands'

// Commands

Cypress.Commands.add('setupMetaMask', () => {
  return cy.task('setupMetaMask')
})

Cypress.Commands.add('acceptMetaMaskAccess', () => {
  return cy.task('acceptMetaMaskAccess')
})

Cypress.Commands.add('confirmMetaMaskTransaction', () => {
  return cy.task('confirmMetaMaskTransaction')
})

Cypress.Commands.add('lockMetaMask', () => {
  return cy.task('lockMetaMask')
})