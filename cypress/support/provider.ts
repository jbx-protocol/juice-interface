import { FakeData } from '../utils/fake-data'
import { MockProvider } from '../utils/mock-web3-provider'

const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D'
const privateKey =
  'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'

export const ProviderSupport = () => {
  const provider = new MockProvider({
    address,
    privateKey,
    networkVersion: 5,
    debug: true,
  })
  provider.stubMethod('eth_blockNumber', FakeData.Provider.BlockNumber)
  provider.stubMethod('eth_sendTransaction', FakeData.Provider.SendTransaction)
  provider.stubMethod(
    'eth_getTransactionByHash',
    FakeData.Provider.GetTransactionByHash,
  )
  return provider
}
