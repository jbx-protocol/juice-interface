import { useConnectWallet } from '@web3-onboard/react'
import { readNetwork } from 'constants/networks'
import { getArcxClient } from 'lib/arcx'
import { useEffect, useMemo } from 'react'

export function useUserAddress() {
  const [{ wallet }] = useConnectWallet()
  const userAddress = useMemo(() => wallet?.accounts[0]?.address, [wallet])

  useEffect(() => {
    if (!userAddress) return

    getArcxClient().then(arcx => {
      arcx?.connectWallet({ account: userAddress, chain: readNetwork.chainId })
    })
  }, [userAddress])

  return userAddress
}
