import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { utils } from 'ethers'
import { useContext } from 'react'
import { isZeroAddress } from 'utils/address'

export function useProjectHasErc20() {
  const { tokenAddress } = useContext(V2V3ProjectContext)

  return Boolean(
    tokenAddress &&
      utils.isAddress(tokenAddress) &&
      !isZeroAddress(tokenAddress),
  )
}
