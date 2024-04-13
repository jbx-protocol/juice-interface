import { useConnectWallet } from '@web3-onboard/react'
import { useMemo } from 'react'

export function useWalletBalance() {
  const [{ wallet }] = useConnectWallet()
  const balance = useMemo(() => wallet?.accounts[0]?.balance?.['ETH'], [wallet])

  return balance
}
