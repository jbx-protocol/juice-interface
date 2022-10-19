import { useAppSelector } from 'hooks/AppSelector'
import { useMemo } from 'react'

/**
 * Hook that returns whether the project to be deployed is an NFT project.
 * @returns Whether the project to be deployed is an NFT project.
 */
export const useIsNftProject = () => {
  const { nftRewards } = useAppSelector(state => state.editingV2Project)

  return useMemo(
    () => nftRewards.rewardTiers.length > 0,
    [nftRewards.rewardTiers],
  )
}
