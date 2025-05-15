import { useConnectWallet } from '@web3-onboard/react'
import { useEffect } from 'react'
import { useConnect as useConnectWagmi } from 'wagmi'

export function useConnect() {
  const [{ wallet }, connect] = useConnectWallet()
  const { connect: connectWagmi } = useConnectWagmi()

  /**
   * Patch in wagmi connector to web3-onboard connector. Whenever the wallet changes, sync wagmi
   *
   * TODO this is firing way too much, but whatevs
   */
  useEffect(() => {
    if (wallet?.wagmiConnector) {
      connectWagmi({ connector: wallet.wagmiConnector })
    }
  }, [wallet, connectWagmi])

  return connect
}
