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

import { Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'

import V2Project from '../V2Project'

export default function ProjectPreview() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { projectMetadata, payoutGroupedSplits, reservedTokensGroupedSplits } =
    useAppSelector(state => state.editingV2Project)
  const fundingCycleMetadata = useEditingV2FundingCycleMetadataSelector()
  const fundingCycleData = useEditingV2FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2FundAccessConstraintsSelector()
  const { userAddress } = useContext(NetworkContext)

  const fundingCycle: V2FundingCycle = {
    ...fundingCycleData,
    number: BigNumber.from(1),
    configuration: BigNumber.from(0),
    basedOn: BigNumber.from(0),
    start: BigNumber.from(Date.now()),
    metadata: BigNumber.from(0),
  }

  const fundAccessConstraint = getDefaultFundAccessConstraint(
    fundAccessConstraints,
  )

  const project: V2ProjectContextType = {
    projectId: BigNumber.from(0),
    projectMetadata,
    fundingCycle,
    fundingCycleMetadata,
    queuedFundingCycle: undefined,
    distributionLimit: fundAccessConstraint?.distributionLimit,
    usedDistributionLimit: BigNumber.from(0),
    queuedDistributionLimit: undefined,
    payoutSplits: payoutGroupedSplits?.splits,
    queuedPayoutSplits: undefined,
    reservedTokensSplits: reservedTokensGroupedSplits?.splits,
    queuedReservedTokensSplits: undefined,
    tokenAddress: undefined,
    terminals: [],
    ETHBalance: BigNumber.from(0),
    distributionLimitCurrency: fundAccessConstraint?.distributionLimitCurrency,
    queuedDistributionLimitCurrency: undefined,
    balanceInDistributionLimitCurrency: BigNumber.from(0),
    tokenSymbol: undefined,
    projectOwnerAddress: userAddress,
    ballotState: undefined,
    primaryTerminalCurrentOverflow: undefined,
    totalTokenSupply: undefined,
    isPreviewMode: true,
  }

  return (
    <V2ProjectContext.Provider value={project}>
      <div style={{ marginBottom: '6rem' }}>
        <h3
          style={{
            marginTop: 5,
            color: colors.text.secondary,
          }}
        >
          <Trans>Preview:</Trans>
        </h3>
        <V2Project singleColumnLayout expandFundingCycleCard />
      </div>
    </V2ProjectContext.Provider>
  )
}
