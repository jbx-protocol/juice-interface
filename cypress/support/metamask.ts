import { PuppeteerSupport } from './puppeteer'

export class MetaMaskSupport {

  static _walletAddress: string | undefined

  static get walletAddress(): string | undefined {
    return this.walletAddress
  }

  static async fixBlankPage() {
    await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000)
    for (let times = 0; times < 5; times++) {
      if (
        (await PuppeteerSupport.metaMaskWindow.$('#app-content .app')) === null
      ) {
        await PuppeteerSupport.metaMaskWindow.reload();
        await PuppeteerSupport.metaMaskWindow.waitForTimeout(2000);
      } else {
        break;
      }
    }
  }

  static async importWallet(secretWords: string, password: string) {
    if ((await PuppeteerSupport.metaMaskWindow.$('.welcome-page__wrapper')) !== null) {
      await PuppeteerSupport.waitAndClick('.welcome-page__wrapper button')
      await PuppeteerSupport.waitAndClick('.first-time-flow__button')
      await PuppeteerSupport.waitAndClick('.btn-primary')
    } else {
      await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000)
      await PuppeteerSupport.waitAndClick('.unlock-page .unlock-page__links button')
      await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000)
      if ((await PuppeteerSupport.metaMaskWindow.$('.unlock-page__form')) !== null) {
        await PuppeteerSupport.waitAndType('.MuiInputBase-root #password', password)
        await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000);
        await PuppeteerSupport.waitAndClick('.unlock-page__form .MuiButton-containedSizeLarge')
      }
    }
    await PuppeteerSupport.waitAndType('.MuiInput-formControl input', secretWords);
    await PuppeteerSupport.waitAndType('.MuiInputBase-root #password', password);
    await PuppeteerSupport.waitAndType('.MuiInputBase-root #confirm-password', password);

    if ((await PuppeteerSupport.metaMaskWindow.$('.MuiFormControl-root + .first-time-flow__checkbox-container .first-time-flow__checkbox')) !== null) {
      await PuppeteerSupport.waitAndClick('.MuiFormControl-root + .first-time-flow__checkbox-container .first-time-flow__checkbox')
      await PuppeteerSupport.waitAndClick('.MuiFormControl-root + .first-time-flow__checkbox-container .first-time-flow__checkbox')
    }

    await PuppeteerSupport.waitAndClick('.first-time-flow__button');
    await PuppeteerSupport.waitFor('.lds-spinner');
    if ((await PuppeteerSupport.metaMaskWindow.$('.popover-header__button')) !== null) {
      await PuppeteerSupport.waitAndClick('.popover-header__button');
    }

    await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000);

    if ((await PuppeteerSupport.metaMaskWindow.$('.first-time-flow__button')) !== null) {
      await PuppeteerSupport.waitAndClick('.first-time-flow__button');
    }

    return true;
  }

  // TODO: Allows dynamic switching in code - hardcoded atm
  static async changeNetwork(network: string) {
    await PuppeteerSupport.waitAndClick('.app-header__account-menu-container .network-display');
    await PuppeteerSupport.waitAndClick('.dropdown-menu-item:nth-child(6)');
    await PuppeteerSupport.waitForText('.typography', 'rinkeby');
    return true
  }

  static async initialSetup() {
    // TODO: Move out and make env vars
    const secretWords = 'test test test test test test test test test test test junk'
    const password = 'ohjhgirhDSDFGG23'

    await PuppeteerSupport.init()
    await PuppeteerSupport.assignWindows()
    await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000)
    await PuppeteerSupport.metaMaskWindow.bringToFront()
    await this.importWallet(secretWords, password)
    await this.changeNetwork('rinkeby')
    await PuppeteerSupport.switchToCypressWindow()
    return true
  }

}
