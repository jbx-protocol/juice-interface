import { JsonRpcProvider } from '@ethersproject/providers'
import { useEffect } from 'react'

import { mainnetProvider } from '../constants/mainnet-provider'
import { web3Modal } from '../constants/web3-modal'
import { useExchangePrice } from '../hooks/ExchangePrice'
import Balance from './Balance'
import Wallet from './Wallet'

export default function Account({
  address,
  userProvider,
  loadWeb3Modal,
}: {
  address?: string
  userProvider?: JsonRpcProvider
  loadWeb3Modal: VoidFunction
}) {
  useEffect(() => {
    if (web3Modal.cachedProvider) loadWeb3Modal()
  }, [loadWeb3Modal])

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider()
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  const price = useExchangePrice(mainnetProvider)

  return (
    <div style={{ display: 'inline-grid', gridAutoFlow: 'column', columnGap: 30, alignItems: 'baseline' }}>
      <Balance address={address} provider={userProvider} dollarMultiplier={price} />
      <Wallet address={address}></Wallet>
      {web3Modal?.cachedProvider ? (
        <button onClick={logoutOfWeb3Modal}>Logout</button>
      ) : (
        <button onClick={loadWeb3Modal}>Connect</button>
      )}
    </div>
  )
}
