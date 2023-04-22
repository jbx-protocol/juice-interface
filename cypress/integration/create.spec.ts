import { ProviderSupport } from '../support/provider'

context('/Create', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.on('window:before:load', (win: any) => {
      win.ethereum = ProviderSupport()
    })

    cy.visit('/create')
    cy.connectWallet()
  })

  it('creates a project with all default settings successfully', () => {
    // Project details
    cy.findByRole('textbox', { name: /project name/i, timeout: 10000 }).type(
      'test',
    )
    cy.findByRole('button', { name: /next arrow-right/i }).click()

    // Cycles
    cy.findByRole('button', { name: /unlocked cycles/i }).click()
    cy.findByRole('button', { name: /next arrow-right/i }).click()

    // Payouts
    cy.findByRole('button', { name: /next arrow-right/i }).click()

    // Token
    cy.findByRole('button', { name: /basic token rules default/i }).click()
    cy.findByRole('button', { name: /next arrow-right/i }).click()

    // NFTs
    cy.findByRole('button', { name: /next arrow-right/i }).click()

    // Deadline
    cy.findByRole('button', { name: /next arrow-right/i }).click()

    // Review
    cy.findByRole('checkbox').click()
    cy.findByRole('button', { name: /^deploy project.*$/i }).click()

    cy.findByText('Transaction pending...', { timeout: 10000 }).should('exist')
    cy.findByText('Congratulations!', { timeout: 10000 }).should('exist')
  })

  it('shows error when project details has no project name', () => {
    cy.findByRole('button', { name: /next arrow-right/i }).click()
    cy.findByText(/project name is required/i).should('exist')
  })
})
