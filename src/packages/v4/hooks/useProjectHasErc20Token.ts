import { useJBTokenContext } from 'juice-sdk-react'
import { isZeroAddress } from 'utils/address'

export const useProjectHasErc20Token = () => {
  const { token } = useJBTokenContext()
  const tokenAddress = token?.data?.address

  return Boolean(tokenAddress && !isZeroAddress(tokenAddress))
}
