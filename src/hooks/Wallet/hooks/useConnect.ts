import { ConnectOptions } from '@web3-onboard/core'
import { useConnectWallet } from '@web3-onboard/react'
import { useCallback } from 'react'
import { useConnectors, useConnect as useConnectWagmi } from 'wagmi'

export function useConnect() {
  const [, connect] = useConnectWallet()
  const { connect: connectWagmi } = useConnectWagmi()
  const connectors = useConnectors()

  /**
   * A wrapper on web3-onboard's connect function to ensure we sync the connection state to wagmi too.
   */
  const _connect = useCallback(
    async (opts?: ConnectOptions) => {
      const walletState = await connect(opts)

      const connectedWalletLabel = walletState?.[0]?.label
      console.info('🧃 [web3-onboard] connected to', walletState)

      /**
       * Find the wagmi connector for the web3-onboard-connected wallet.
       *
       * This may be flaky, idk.
       */
      const connector = connectors.find(
        c => c.name.toLowerCase() === connectedWalletLabel.toLowerCase(),
      )
      if (connector) {
        await connectWagmi({ connector })
        console.info('🧃 [wagmi] connected to', walletState)
      }
    },
    [connect, connectWagmi, connectors],
  )

  return _connect
}
