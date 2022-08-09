import {
  V2ProjectContext,
  V2ProjectContextType,
} from 'contexts/v2/projectContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'

import {
  useAppSelector,
  useEditingV2FundAccessConstraintsSelector,
  useEditingV2FundingCycleDataSelector,
  useEditingV2FundingCycleMetadataSelector,
} from 'hooks/AppSelector'

import { NetworkContext } from 'contexts/networkContext'

import { V2FundingCycle } from 'models/v2/fundingCycle'

import { getDefaultFundAccessConstraint } from 'utils/v2/fundingCycle'
import { V2_CURRENCY_ETH } from 'utils/v2/currency'

import V2Project from '../../components/v2/V2Project'

export default function ProjectPreview({
  singleColumnLayout,
}: {
  singleColumnLayout?: boolean
}) {
  const {
    projectMetadata,
    payoutGroupedSplits,
    reservedTokensGroupedSplits,
    nftRewards: { CIDs: nftRewardsCIDs, rewardTiers: nftRewardTiers },
  } = useAppSelector(state => state.editingV2Project)
  const fundingCycleMetadata = useEditingV2FundingCycleMetadataSelector()
  const fundingCycleData = useEditingV2FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2FundAccessConstraintsSelector()
  const { userAddress } = useContext(NetworkContext)

  const fundingCycle: V2FundingCycle = {
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

  const project: V2ProjectContextType = {
    isPreviewMode: true,
    cv: '2',
    isArchived: false,

    projectId: 0,
    handle: undefined,
    projectMetadata,

    createdAt: undefined,

    fundingCycle,
    fundingCycleMetadata,

    distributionLimit: fundAccessConstraint?.distributionLimit,
    distributionLimitCurrency:
      !fundAccessConstraint?.distributionLimitCurrency.eq(0)
        ? fundAccessConstraint?.distributionLimitCurrency
        : BigNumber.from(V2_CURRENCY_ETH),

    payoutSplits: payoutGroupedSplits?.splits,
    reservedTokensSplits: reservedTokensGroupedSplits?.splits,

    usedDistributionLimit: BigNumber.from(0),
    ETHBalance: BigNumber.from(0),
    totalVolume: BigNumber.from(0),
    balanceInDistributionLimitCurrency: BigNumber.from(0),

    tokenAddress: undefined,
    terminals: [],
    primaryTerminal: undefined,
    tokenSymbol: undefined,
    tokenName: undefined,
    projectOwnerAddress: userAddress,
    ballotState: undefined,
    primaryTerminalCurrentOverflow: undefined,
    totalTokenSupply: undefined,

    nftRewards: {
      CIDs: nftRewardsCIDs,
      rewardTiers: nftRewardTiers,
      loading: undefined,
    },

    veNft: {
      contractAddress: undefined,
      uriResolver: undefined,
    },

    loading: {
      ETHBalanceLoading: false,
      balanceInDistributionLimitCurrencyLoading: false,
      distributionLimitLoading: false,
      fundingCycleLoading: false,
      usedDistributionLimitLoading: false,
    },
  }

  return (
    <V2ProjectContext.Provider value={project}>
      <div>
        <V2Project
          singleColumnLayout={singleColumnLayout}
          expandFundingCycleCard
        />
      </div>
    </V2ProjectContext.Provider>
  )
}
