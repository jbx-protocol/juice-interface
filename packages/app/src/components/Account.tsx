import { JsonRpcProvider } from '@ethersproject/providers'
import { Button } from 'antd'
import { useEffect } from 'react'

import { web3Modal } from '../constants/web3-modal'
import { useExchangePrice } from '../hooks/ExchangePrice'
import { NetworkName } from '../models/network-name'
import Balance from './Balance'
import Wallet from './Wallet'

export default function Account({
  userAddress,
  userProvider,
  loadWeb3Modal,
}: {
  userAddress?: string
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

  const price = useExchangePrice()

  return (
    <div
      style={{
        display: 'inline-grid',
        gridAutoFlow: 'column',
        columnGap: 15,
        alignItems: 'baseline',
      }}
    >
      {userProvider?.network?.name === NetworkName.mainnet ? null : (
        <span style={{ fontSize: '.8rem', fontWeight: 500 }}>
          Network: {userProvider?.network?.name}
        </span>
      )}
      <Balance
        userAddress={userAddress}
        provider={userProvider}
        dollarMultiplier={price}
      />
      <Wallet userAddress={userAddress}></Wallet>
      {web3Modal?.cachedProvider ? (
        <Button onClick={logoutOfWeb3Modal}>Logout</Button>
      ) : (
        <Button onClick={loadWeb3Modal}>Connect</Button>
      )}
    </div>
  )
}
