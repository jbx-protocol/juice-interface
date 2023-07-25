import { isEqualAddress } from 'utils/address'
import { useJBWallet } from './Wallet'

export function useIsUserAddress(address: string | undefined) {
  const { userAddress } = useJBWallet()

  return isEqualAddress(address, userAddress)
}
