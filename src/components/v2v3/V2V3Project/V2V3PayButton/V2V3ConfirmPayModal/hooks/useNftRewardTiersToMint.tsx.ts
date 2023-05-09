import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { useContext } from 'react'
import { rewardTiersFromIds } from 'utils/nftRewards'

export function useNftRewardTiersToMint() {
  const { form: payProjectForm } = useContext(PayProjectFormContext)
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)

  const nftTierIdsToMint = [
    ...(payProjectForm?.payMetadata?.tierIdsToMint ?? []),
  ].sort()

  if (!rewardTiers || !nftTierIdsToMint) return

  return rewardTiersFromIds({
    tierIds: nftTierIdsToMint,
    rewardTiers,
  })
}
