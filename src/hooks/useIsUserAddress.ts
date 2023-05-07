import { isEqualAddress } from 'utils/address'
import { useWallet } from './Wallet'

export function useIsUserAddress(address: string | undefined) {
  const { userAddress } = useWallet()

  return isEqualAddress(address, userAddress)
}
