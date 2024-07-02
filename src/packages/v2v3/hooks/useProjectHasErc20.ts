import { ethers } from 'ethers'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { isZeroAddress } from 'utils/address'

export function useProjectHasErc20() {
  const { tokenAddress } = useContext(V2V3ProjectContext)

  return Boolean(
    tokenAddress &&
      ethers.isAddress(tokenAddress) &&
      !isZeroAddress(tokenAddress),
  )
}
