import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import { usePayProjectForm } from 'components/Project/PayProjectForm/usePayProjectForm'
import { V2V3PayButton } from 'components/v2v3/V2V3Project/V2V3PayButton/V2V3PayButton'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'
import { getNftRewardTier } from 'utils/nftRewards'
import { weightAmountPermyriad } from 'utils/v2v3/math'

export const V2V3PayProjectFormProvider: React.FC = ({ children }) => {
  const { fundingCycleMetadata, fundingCycle, tokenSymbol, tokenAddress } =
    useContext(V2V3ProjectContext)
  const {
    nftRewards: { rewardTiers: nftRewardTiers },
  } = useContext(NftRewardsContext)

  const payProjectForm = usePayProjectForm()

  const isEligibleForNft =
    nftRewardTiers && payProjectForm.payAmount
      ? Boolean(
          getNftRewardTier({
            nftRewardTiers: nftRewardTiers,
            payAmountETH: parseFloat(payProjectForm.payAmount),
          }),
        )
      : false

  return (
    <PayProjectFormContext.Provider
      value={{
        PayButton: V2V3PayButton,
        reservedRate: fundingCycleMetadata?.reservedRate.toNumber(),
        weight: fundingCycle?.weight,
        weightingFn: weightAmountPermyriad,
        tokenSymbol: tokenSymbol,
        tokenAddress: tokenAddress,
        isEligibleForNft,
        form: payProjectForm,
      }}
    >
      {children}
    </PayProjectFormContext.Provider>
  )
}
