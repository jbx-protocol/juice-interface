import { BigNumber } from '@ethersproject/bignumber'
import {
  V2V3ProjectContext,
  V2V3ProjectContextType,
} from 'contexts/v2v3/V2V3ProjectContext'
import { useWallet } from 'hooks/Wallet'

import {
  useAppSelector,
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
  useEditingV2V3FundingCycleMetadataSelector,
} from 'hooks/AppSelector'

import { V2V3FundingCycle } from 'models/v2v3/fundingCycle'

import { V2V3Project } from 'components/v2v3/V2V3Project/V2V3Project'
import { CV_V2 } from 'constants/cv'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { getDefaultFundAccessConstraint } from 'utils/v2v3/fundingCycle'

export default function ProjectPreview() {
  const {
    projectMetadata,
    payoutGroupedSplits,
    reservedTokensGroupedSplits,
    nftRewards: { CIDs: nftRewardsCIDs, rewardTiers: nftRewardTiers },
  } = useAppSelector(state => state.editingV2Project)
  const fundingCycleMetadata = useEditingV2V3FundingCycleMetadataSelector()
  const fundingCycleData = useEditingV2V3FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2V3FundAccessConstraintsSelector()
  const { userAddress } = useWallet()

  const fundingCycle: V2V3FundingCycle = {
    ...fundingCycleData,
    number: BigNumber.from(1),
    configuration: BigNumber.from(0),
    basedOn: BigNumber.from(0),
    start: BigNumber.from(Date.now()).div(1000),
    metadata: BigNumber.from(0),
  }

  const fundAccessConstraint = getDefaultFundAccessConstraint(
    fundAccessConstraints,
  )

  const project: V2V3ProjectContextType = {
    isPreviewMode: true,

    handle: undefined,

    createdAt: undefined,

    fundingCycle,
    fundingCycleMetadata,

    distributionLimit: fundAccessConstraint?.distributionLimit,
    distributionLimitCurrency:
      !fundAccessConstraint?.distributionLimitCurrency.eq(0)
        ? fundAccessConstraint?.distributionLimitCurrency
        : BigNumber.from(V2V3_CURRENCY_ETH),

    payoutSplits: payoutGroupedSplits?.splits,
    reservedTokensSplits: reservedTokensGroupedSplits?.splits,

    usedDistributionLimit: BigNumber.from(0),
    ETHBalance: BigNumber.from(0),
    totalVolume: BigNumber.from(0),
    balanceInDistributionLimitCurrency: BigNumber.from(0),

    tokenAddress: undefined,
    terminals: [],
    primaryETHTerminal: undefined,
    tokenSymbol: undefined,
    tokenName: undefined,
    projectOwnerAddress: userAddress,
    ballotState: undefined,
    primaryTerminalCurrentOverflow: undefined,
    totalTokenSupply: undefined,

    loading: {
      ETHBalanceLoading: false,
      balanceInDistributionLimitCurrencyLoading: false,
      distributionLimitLoading: false,
      fundingCycleLoading: false,
      usedDistributionLimitLoading: false,
    },
  }

  return (
    <ProjectMetadataContext.Provider
      value={{ projectMetadata, isArchived: false, projectId: 0, cv: CV_V2 }}
    >
      <V2V3ProjectContext.Provider value={project}>
        <div>
          <NftRewardsContext.Provider
            value={{
              nftRewards: {
                CIDs: nftRewardsCIDs,
                rewardTiers: nftRewardTiers,
                loading: undefined,
              },
            }}
          >
            <V2V3Project />
          </NftRewardsContext.Provider>
        </div>
      </V2V3ProjectContext.Provider>
    </ProjectMetadataContext.Provider>
  )
}
