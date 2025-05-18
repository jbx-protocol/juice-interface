import { ConnectOptions } from '@web3-onboard/core'
import { useConnectWallet } from '@web3-onboard/react'
import { useCallback } from 'react'
import { useConnect as useConnectWagmi } from 'wagmi'

export function useConnect() {
  const [, connect] = useConnectWallet()
  const { connect: connectWagmi } = useConnectWagmi()

  const _connect = useCallback(
    async (opts?: ConnectOptions) => {
      const walletState = await connect(opts)
      const wagmiConnector = walletState[0]?.wagmiConnector
      if (wagmiConnector) {
        await connectWagmi({ connector: wagmiConnector })
      }
    },
    [connect, connectWagmi],
  )

  return _connect
}
