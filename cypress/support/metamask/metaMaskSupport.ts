import { PuppeteerSupport } from '../puppeteer'
import { NetworkMenu, NetworkMenuType } from './networkMenu'
import { Selectors } from './selectors'

require('dotenv').config()

export class MetaMaskSupport {

  static _walletAddress: string | undefined

  static get walletAddress(): string | undefined {
    return this.walletAddress
  }

  static async fixBlankPage() {
    await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000)
    for (let times = 0; times < 5; times++) {
      if (
        (await PuppeteerSupport.metaMaskWindow.$(Selectors.AppWindow)) === null
      ) {
        await PuppeteerSupport.metaMaskWindow.reload();
        await PuppeteerSupport.metaMaskWindow.waitForTimeout(2000);
      } else {
        break;
      }
    }
  }

  static async importWallet(secretWords: string, password: string) {
    if ((await PuppeteerSupport.metaMaskWindow.$(Selectors.WelcomePage)) !== null) {
      await PuppeteerSupport.waitAndClick(Selectors.WelcomePageButton)
      await PuppeteerSupport.waitAndClick(Selectors.FirstTimeFlowButton)
      await PuppeteerSupport.waitAndClick(Selectors.PrimaryButton)
    } else {
      await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000)
      await PuppeteerSupport.waitAndClick(Selectors.UnlockPageLinksButton)
      await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000)
      if ((await PuppeteerSupport.metaMaskWindow.$(Selectors.UnlockPageForm)) !== null) {
        await PuppeteerSupport.waitAndType(Selectors.Password, password)
        await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000);
        await PuppeteerSupport.waitAndClick(Selectors.UnlockPageFormButton)
      }
    }
    await PuppeteerSupport.waitAndType(Selectors.FormInput, secretWords);
    await PuppeteerSupport.waitAndType(Selectors.FormPassword, password);
    await PuppeteerSupport.waitAndType(Selectors.ConfirmPassword, password);

    if ((await PuppeteerSupport.metaMaskWindow.$(Selectors.FirstTimeFlowCheckBox)) !== null) {
      await PuppeteerSupport.waitAndClick(Selectors.FirstTimeFlowCheckBoxTerms)
    }

    await PuppeteerSupport.waitAndClick(Selectors.FirstTimeFlowButton);
    await PuppeteerSupport.waitFor(Selectors.Spinner);
    if ((await PuppeteerSupport.metaMaskWindow.$(Selectors.PopoverHeaderButton)) !== null) {
      await PuppeteerSupport.waitAndClick(Selectors.PopoverHeaderButton);
    }

    await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000);

    if ((await PuppeteerSupport.metaMaskWindow.$(Selectors.FirstTimeFlowButton)) !== null) {
      await PuppeteerSupport.waitAndClick(Selectors.FirstTimeFlowButton);
    }

    return true;
  }

  static async acceptAccess() {
    await PuppeteerSupport.metaMaskWindow.waitForTimeout(5000);
    const notificationPage = await PuppeteerSupport.switchToMetaMaskNotification();
    await PuppeteerSupport.waitAndClick(Selectors.NotificationAcceptNextButton, notificationPage)
    await PuppeteerSupport.waitAndClick(Selectors.NotificationAcceptConnectButton, notificationPage)
    await PuppeteerSupport.metaMaskWindow.waitForTimeout(3000);
    return true;
  }

  static async confirmTransaction() {
    // TODO: We might be able to shorten this with some poll mechanism
    await PuppeteerSupport.metaMaskWindow.waitForTimeout(10000)
    const notificationPage = await PuppeteerSupport.switchToMetaMaskNotification()
    await PuppeteerSupport.metaMaskWindow.waitForTimeout(3000)
    await PuppeteerSupport.waitAndClick(Selectors.PrimaryButton, notificationPage)
    // Long timeout to ensure transaction has performed
    await PuppeteerSupport.metaMaskWindow.waitForTimeout(25000)
    return true
  }

  static async lock() {
    if ((await PuppeteerSupport.metaMaskWindow.$(Selectors.UnlockPageContainer)) !== null) {
      return true
    }
    await PuppeteerSupport.waitAndClick(Selectors.AccountPortraitIcon)
    await PuppeteerSupport.waitAndClick(Selectors.AccountLockButton)
    return true
  }

  static async changeNetwork(network: NetworkMenuType) {
    const index = NetworkMenu[network]?.index
    if (!index) {
      return false
    }
    await PuppeteerSupport.waitAndClick(Selectors.NetworkDisplay);
    await PuppeteerSupport.waitAndClick(`.dropdown-menu-item:nth-child(${index})`);
    await PuppeteerSupport.waitForText('.typography', `${network}`);
    return true
  }

  static async isMetaMaskLocked() {
    return (await PuppeteerSupport.metaMaskWindow.$(Selectors.HomeContainer)) === null
  }

  static async initialSetup() {
    const secretWords = process.env.E2E_SECRET_WORDS
    const password = process.env.E2E_PASSWORD
    if (!secretWords || !password) {
      return false
    }
    const network = (process.env.E2E_NETWORK?.toLowerCase() ?? 'rinkeby') as NetworkMenuType

    await PuppeteerSupport.init()
    await PuppeteerSupport.assignWindows()
    await this.fixBlankPage()
    await PuppeteerSupport.metaMaskWindow.waitForTimeout(1000)
    await PuppeteerSupport.metaMaskWindow.bringToFront()
    if ((await this.isMetaMaskLocked())) {
      await this.importWallet(secretWords, password)
    }
    await this.changeNetwork(network)
    await PuppeteerSupport.switchToCypressWindow()
    return true
  }

}
