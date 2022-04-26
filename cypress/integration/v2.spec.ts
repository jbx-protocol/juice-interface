import {v4 as UUIDv4} from 'uuid'

context('V2 Testing', () => {
  before(() => {
    cy.setupMetaMask()
  })

  after(() => {
    cy.lockMetaMask()
  })

  it('foo', () => {
    cy.visit('/#/v2/create')
    const projectName = UUIDv4()
    cy.findByLabelText(/project name/i).type(projectName)

    cy.findByRole('button', {  name: /next: funding cycle/i}).click()
    cy.findByRole('button', {  name: /next: review and deploy/i}).click()
    cy.findByRole('button', {  name: /connect wallet to deploy/i}).click()
    cy.findByRole('button', {  name: /metamask metamask/i}).click()
    cy.acceptMetaMaskAccess()
    cy.findByRole('button', {  name: /deploy project to .*/i}).click()
    cy.confirmMetaMaskTransaction()
  })
})