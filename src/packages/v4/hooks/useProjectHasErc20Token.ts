import { useReadJbTokensTokenOf } from 'juice-sdk-react'
import { isZeroAddress } from 'utils/address'

export const useProjectHasErc20Token = () => {
  const { data: tokenAddress } = useReadJbTokensTokenOf()

  return Boolean(tokenAddress && !isZeroAddress(tokenAddress))
}
