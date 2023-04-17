/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt, personalSign } from '@metamask/eth-sig-util'

type ProviderSetup = {
  address: string
  privateKey: string
  networkVersion: number
  debug?: boolean
  manualConfirmEnable?: boolean
}

type RequestMethod =
  | 'eth_requestAccounts'
  | 'eth_accounts'
  | 'net_version'
  | 'eth_chainId'
  | 'personal_sign'
  | 'eth_decrypt'
  | 'eth_blockNumber'
  | 'eth_sendTransaction'
  | 'eth_getTransactionByHash'

interface IMockProvider {
  request(args: { method: 'eth_accounts'; params: string[] }): Promise<string[]>
  request(args: {
    method: 'eth_requestAccounts'
    params: string[]
  }): Promise<string[]>

  request(args: { method: 'net_version' }): Promise<number>
  request(args: { method: 'eth_chainId'; params: string[] }): Promise<string>

  request(args: { method: 'personal_sign'; params: string[] }): Promise<string>
  request(args: { method: 'eth_decrypt'; params: string[] }): Promise<string>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(args: { method: string; params?: any[] }): Promise<any>
}

// eslint-disable-next-line import/prefer-default-export
export class MockProvider implements IMockProvider {
  private setup: ProviderSetup

  public isMetaMask = true

  private acceptEnable?: (value: unknown) => void

  private rejectEnable?: (value: unknown) => void

  constructor(setup: ProviderSetup) {
    this.setup = setup
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log = (...args: (any | null)[]) =>
    // eslint-disable-next-line no-console
    this.setup.debug && console.log('🦄', ...args)

  get selectedAddress(): string {
    return this.setup.address
  }

  get networkVersion(): number {
    return this.setup.networkVersion
  }

  get chainId(): string {
    return `0x${this.setup.networkVersion.toString(16)}`
  }

  answerEnable(acceptance: boolean) {
    if (acceptance) this.acceptEnable!('Accepted')
    else this.rejectEnable!('User rejected')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request({ method, params }: any): Promise<any> {
    this.log(`request[${method}]`)

    if (this.stubs[method]) {
      const stub = this.stubs[method]
      stub.callCount += 1

      if (stub.responses.length > 0) {
        const response = stub.responses.shift()
        return response instanceof Error
          ? Promise.reject(response)
          : Promise.resolve(response)
      }
    }

    switch (method) {
      case 'eth_requestAccounts':
      case 'eth_accounts':
        if (this.setup.manualConfirmEnable) {
          return new Promise((resolve, reject) => {
            this.acceptEnable = resolve
            this.rejectEnable = reject
          }).then(() => [this.selectedAddress])
        }
        return Promise.resolve([this.selectedAddress])

      case 'net_version':
        return Promise.resolve(this.setup.networkVersion)

      case 'eth_chainId':
        return Promise.resolve(this.chainId)

      case 'eth_estimateGas':
        return Promise.resolve('0x5208')

      case 'personal_sign': {
        const privateKey = Buffer.from(this.setup.privateKey, 'hex')

        const signed: string = personalSign({ privateKey, data: params[0] })

        this.log('signed', signed)

        return Promise.resolve(signed)
      }

      case 'eth_sendTransaction': {
        return Promise.reject(
          new Error('This service can not send transactions.'),
        )
      }

      case 'eth_decrypt': {
        this.log('eth_decrypt', { method, params })

        const stripped = params[0].substring(2)
        const buff = Buffer.from(stripped, 'hex')
        const encryptedData = JSON.parse(buff.toString('utf8'))

        const decrypted: string = decrypt({
          encryptedData,
          privateKey: this.setup.privateKey,
        })

        return Promise.resolve(decrypted)
      }

      default:
        this.log(`requesting missing method ${method}`)
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(
          `The method ${method} is not implemented by the mock provider.`,
        )
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendAsync(props: { method: string }, cb: any) {
    switch (props.method) {
      case 'eth_accounts':
        cb(null, { result: [this.setup.address] })
        break

      case 'net_version':
        cb(null, { result: this.setup.networkVersion })
        break

      default:
        this.log(`Method '${props.method}' is not supported yet.`)
    }
  }

  on(props: string) {
    this.log('registering event:', props)
  }

  removeAllListeners() {
    this.log('removeAllListeners', null)
  }

  // The following methods allow stubbing responses to requests
  private stubs: Record<string, { callCount: number; responses: any[] }> = {}

  stubMethod(method: RequestMethod, response: any) {
    if (!this.stubs[method]) {
      this.stubs[method] = { callCount: 0, responses: [] }
    }
    this.stubs[method].responses.push(response)
  }

  getCallCount(method: RequestMethod): number {
    return this.stubs[method]?.callCount || 0
  }

  setCustomResponse(method: RequestMethod, response: any, times = 1) {
    for (let i = 0; i < times; i++) {
      this.stubMethod(method, response)
    }
  }
}
