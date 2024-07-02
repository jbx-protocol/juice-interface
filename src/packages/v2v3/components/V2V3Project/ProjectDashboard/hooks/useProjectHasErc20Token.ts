import { ethers } from 'ethers'
import { useMemo } from 'react'
import { useProjectContext } from './useProjectContext'

export const useProjectHasErc20Token = () => {
  const { tokenAddress } = useProjectContext()
  return useMemo(
    () => tokenAddress !== undefined && tokenAddress !== ethers.ZeroAddress,
    [tokenAddress],
  )
}
