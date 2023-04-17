// Imports

import '@testing-library/cypress/add-commands'

// Custom commands go here

Cypress.Commands.add('clickIfExist', (selector, options = {}) => {
  const { timeout = 10000 } = options
  cy.get('body').then($body => {
    if ($body.find(selector).length > 0) {
      cy.get(selector, { timeout }).click()
    }
  })
})

Cypress.Commands.add('connectWallet', () => {
  cy.findByRole('button', { name: /connect/i }).click()
  cy.get('onboard-v2')
    .shadow()
    .findByRole('button', { name: /metamask/i })
    .click()
    .then(() => {
      cy.clickIfExist('#modal-exit-button')
    })
})
