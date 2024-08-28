import { useMemo } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'

/**
 * Hook that returns whether the project to be deployed is an NFT project.
 * @returns Whether the project to be deployed is an NFT project.
 */
export const useIsNftProject = (): boolean => {
  const { nftRewards } = useAppSelector(state => state.editingV2Project)

  return useMemo(
    () =>
      Boolean(nftRewards?.rewardTiers && nftRewards?.rewardTiers.length > 0),
    [nftRewards.rewardTiers],
  )
}
