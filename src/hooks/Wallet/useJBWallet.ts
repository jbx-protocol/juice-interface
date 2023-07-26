import { readNetwork } from 'constants/networks'
import { WalletContext } from 'contexts/Wallet/WalletContext'
import { signOut, useSession } from 'next-auth/react'
import { useContext } from 'react'
import { useWallet } from './useWallet'

export function useJBWallet() {
  const { connect } = useContext(WalletContext)

  const eoa = useWallet()

  const { status, data: session } = useSession()

  const user = session?.user as
    | {
        accessToken: string
        address: string
        id: string
        username: string
      }
    | undefined

  const isAuthenticated = status === 'authenticated'

  return {
    isConnected: isAuthenticated || eoa.isConnected,
    userAddress: user?.address || eoa.userAddress,
    chain: eoa.chain ?? {
      id: readNetwork.chainId,
      name: readNetwork.name,
    },
    eoa,
    keyp: {
      isAuthenticated,
      signOut,
      ...user,
    },
    connectionType: eoa.isConnected
      ? 'eoa'
      : isAuthenticated
      ? 'keyp'
      : undefined,
    disconnect: () => {
      if (eoa.isConnected) eoa.disconnect()
      if (isAuthenticated) signOut()
    },
    connect,
  }
}
