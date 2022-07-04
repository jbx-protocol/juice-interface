import { NetworkContext } from 'contexts/networkContext'
import { useContext } from 'react'

export function useIsUserAddress(address: string | undefined) {
  const { userAddress } = useContext(NetworkContext)

  return (
    address !== undefined &&
    userAddress !== undefined &&
    address.toLowerCase() === userAddress.toLowerCase()
  )
}
