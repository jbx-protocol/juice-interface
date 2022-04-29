/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { MetaMaskSupport } = require('../support/metamask/metaMaskSupport')
const helpers = require('../support/helpers')
const { PuppeteerSupport } = require('../support/puppeteer')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {

  on('before:browser:launch', async (browser = {}, _arguments) => {
    if (browser.name === 'chrome') {
      _arguments.args.push(
        '--remote-debugging-port=9222',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      )
    }
    const metamaskPath = await helpers.prepareMetaMask('9.4.0')
    _arguments.extensions.push(metamaskPath)
    return _arguments
  })

  on('task', {
    async setupMetaMask() {
      if (PuppeteerSupport.metamaskWindow) {
        await PuppeteerSupport.switchToCypressWindow()
        return true
      } 
      await MetaMaskSupport.initialSetup()
      return true
    },
    async acceptMetaMaskAccess() {
      return await MetaMaskSupport.acceptAccess()
    },
    async confirmMetaMaskTransaction() {
      return await MetaMaskSupport.confirmTransaction()
    },
    async lockMetaMask() {
      return await MetaMaskSupport.lock()
    }
  })

  return config
}
