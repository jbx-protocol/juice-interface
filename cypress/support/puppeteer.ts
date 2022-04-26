import axios from "axios"
import * as puppeteer from 'puppeteer-core'


export class PuppeteerSupport {

  static  _puppeteerBrowser: puppeteer.Browser | undefined

  static get puppeteerBrowser() {
    return this._puppeteerBrowser
  }

  static  _mainWindow: puppeteer.Page | undefined

  static get mainWindow() {
    return this._mainWindow
  }

  static _metaMaskWindow: puppeteer.Page | undefined

  static get metaMaskWindow() {
    return this._metaMaskWindow
  }

  static async init() {
    const debuggerDetails = await axios.get('http://localhost:9222/json/version')
    const debuggerDetailsConfig = debuggerDetails.data
    const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl

    this._puppeteerBrowser = await puppeteer.connect({browserWSEndpoint: webSocketDebuggerUrl, ignoreHTTPSErrors: true, defaultViewport: null})
    return this._puppeteerBrowser.isConnected()
  }

  static async assignWindows() {
    const pages = await this._puppeteerBrowser.pages()
    for (const page of pages) {
      if (page.url().includes('integration')) {
        this._mainWindow = page
      } else if (page.url().includes('extension')) {
        this._metaMaskWindow = page
      }
    }
    return true
  }

  static async switchToCypressWindow() {
    await this._mainWindow.bringToFront()
    return true
  }

  static async switchToMetaMaskNotification() {
    const pages = await this._puppeteerBrowser.pages()
    for (const page of pages) {
      if (page.url().includes('notification')) {
        await page.bringToFront()
        return page
      }
    }
  }

  static async waitFor(selector: string | number | boolean | BigInt | puppeteer.JSONArray | puppeteer.JSONObject | puppeteer.JSHandle<unknown>, page = this._metaMaskWindow) {
    await page.waitForFunction(
      `document.querySelector('${selector}') && document.querySelector('${selector}')?.clientHeight != 0`,
      undefined,
      {visible: true}
    )
    await page.waitForTimeout(300)
  }

  static async waitAndClick(selector: string | number | boolean | BigInt | puppeteer.JSONArray | puppeteer.JSONObject | puppeteer.JSHandle<unknown>, page = this._metaMaskWindow) {
    await this.waitFor(selector, page)
    await page.evaluate(selector => document.querySelector(selector)?.click(), selector)
  }

  static async waitAndType(selector: string, value: string, page = this._metaMaskWindow) {
    await this.waitFor(selector, page)
    const element = await page.$(selector)
    await element.type(value)
  }

  static async waitForText(selector: string, text: string, page = this._metaMaskWindow) {
    await this.waitFor(selector, page)
    await page.waitForFunction(
      `document.querySelector('${selector}').innerText.toLowerCase().includes('${text}')`,
    )
  }

}

