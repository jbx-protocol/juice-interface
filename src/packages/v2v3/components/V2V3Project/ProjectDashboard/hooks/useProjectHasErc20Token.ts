import { isZeroAddress } from 'utils/address'
import { useProjectContext } from './useProjectContext'

export const useProjectHasErc20Token = () => {
  const { tokenAddress } = useProjectContext()
  return !isZeroAddress(tokenAddress)
}
