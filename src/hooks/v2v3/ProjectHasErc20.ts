import { isAddress } from '@ethersproject/address'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { isZeroAddress } from 'utils/address'

export function useProjectHasErc20() {
  const { tokenAddress } = useContext(V2V3ProjectContext)

  return tokenAddress && isAddress(tokenAddress) && !isZeroAddress(tokenAddress)
}
