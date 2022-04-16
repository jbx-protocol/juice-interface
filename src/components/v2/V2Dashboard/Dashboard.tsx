import {
  V2ProjectContext,
  V2ProjectContextType,
} from 'contexts/v2/projectContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useParams } from 'react-router-dom'
import Loading from 'components/shared/Loading'
import { BigNumber } from '@ethersproject/bignumber'
import useProjectMetadataContent from 'hooks/v2/contractReader/ProjectMetadataContent'
import ScrollToTopButton from 'components/shared/ScrollToTopButton'
import useProjectCurrentFundingCycle from 'hooks/v2/contractReader/ProjectCurrentFundingCycle'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import useProjectTerminals from 'hooks/v2/contractReader/ProjectTerminals'
import { usePaymentTerminalBalance } from 'hooks/v2/contractReader/PaymentTerminalBalance'
import useProjectToken from 'hooks/v2/contractReader/ProjectToken'
import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import { useMemo } from 'react'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { V2CurrencyName, V2_CURRENCY_ETH } from 'utils/v2/currency'

import { decodeV2FundingCycleMetadata } from 'utils/v2/fundingCycle'

import useSymbolOfERC20 from 'hooks/v1/contractReader/SymbolOfERC20' // this is version-agnostic, we chillin

import useProjectOwner from 'hooks/v2/contractReader/ProjectOwner'

import useUsedDistributionLimit from 'hooks/v2/contractReader/UsedDistributionLimit'
import useTerminalCurrentOverflow from 'hooks/v2/contractReader/TerminalCurrentOverflow'
import { useBallotState } from 'hooks/v2/contractReader/BallotState'
import useProjectTokenTotalSupply from 'hooks/v2/contractReader/ProjectTokenTotalSupply'

import { layouts } from 'constants/styles/layouts'

import V2Project from '../V2Project'
import Dashboard404 from './Dashboard404'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'

export default function V2Dashboard() {
  const { projectId: projectIdParameter }: { projectId?: string } = useParams()
  const projectId = BigNumber.from(projectIdParameter)

  const { data: metadataCID, loading: metadataURILoading } =
    useProjectMetadataContent(projectId)

  const {
    data: projectMetadata,
    error: metadataError,
    isLoading: metadataLoading,
  } = useProjectMetadata(metadataCID)

  // Calls JBFundingCycleStore.currentOf
  const { data: fundingCycle } = useProjectCurrentFundingCycle({
    projectId,
  })

  const fundingCycleMetadata = fundingCycle
    ? decodeV2FundingCycleMetadata(fundingCycle?.metadata)
    : undefined

  const { data: queuedFundingCycle } = useProjectQueuedFundingCycle({
    projectId,
  })

  const queuedFundingCycleMetadata = queuedFundingCycle
    ? decodeV2FundingCycleMetadata(queuedFundingCycle?.metadata)
    : undefined

  const { data: payoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: fundingCycle?.configuration?.toString(),
  })

  const { data: terminals } = useProjectTerminals({
    projectId,
  })

  const primaryTerminal = terminals?.[0] // TODO: make primaryTerminalOf hook and use it

  const { data: distributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: fundingCycle?.configuration?.toString(),
    terminal: primaryTerminal,
  })

  const { data: usedDistributionLimit } = useUsedDistributionLimit({
    projectId,
    terminal: primaryTerminal,
    fundingCycleNumber: fundingCycle?.number,
  })

  const [distributionLimit, distributionLimitCurrency] =
    distributionLimitData ?? []

  const { data: queuedPayoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: queuedFundingCycle?.configuration?.toString(),
  })

  const { data: reservedTokensSplits } = useProjectSplits({
    projectId,
    splitGroup: RESERVED_TOKEN_SPLIT_GROUP,
    domain: fundingCycle?.configuration?.toString(),
  })

  const { data: queuedReservedTokensSplits } = useProjectSplits({
    projectId,
    splitGroup: RESERVED_TOKEN_SPLIT_GROUP,
    domain: queuedFundingCycle?.configuration?.toString(),
  })

  const { data: ETHBalance } = usePaymentTerminalBalance({
    terminal: primaryTerminal,
    projectId,
  })

  const { data: tokenAddress } = useProjectToken({
    projectId,
  })

  const tokenSymbol = useSymbolOfERC20(tokenAddress)

  const { data: queuedDistributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: queuedFundingCycle?.configuration.toString(),
    terminal: primaryTerminal,
  })
  const [queuedDistributionLimit, queuedDistributionLimitCurrency] =
    queuedDistributionLimitData ?? []

  const { data: primaryTerminalCurrentOverflow } = useTerminalCurrentOverflow({
    projectId,
    terminal: primaryTerminal,
  })

  const converter = useCurrencyConverter()
  const balanceInDistributionLimitCurrency = useMemo(
    () =>
      ETHBalance &&
      converter.wadToCurrency(
        ETHBalance,
        V2CurrencyName(
          distributionLimitCurrency?.toNumber() as V2CurrencyOption,
        ),
        V2CurrencyName(V2_CURRENCY_ETH),
      ),
    [ETHBalance, converter, distributionLimitCurrency],
  )

  const { data: projectOwnerAddress } = useProjectOwner(projectId)

  const { data: totalTokenSupply } = useProjectTokenTotalSupply(projectId)

  const { data: ballotState } = useBallotState(projectId)

  if (metadataLoading || metadataURILoading) return <Loading />

  if (projectId?.eq(0) || metadataError || !metadataCID) {
    return <Dashboard404 projectId={projectId} />
  }

  const project: V2ProjectContextType = {
    projectId,
    projectMetadata,
    fundingCycle,
    fundingCycleMetadata,
    queuedFundingCycle,
    queuedFundingCycleMetadata,
    distributionLimit,
    usedDistributionLimit,
    queuedDistributionLimit,
    payoutSplits,
    queuedPayoutSplits,
    reservedTokensSplits,
    queuedReservedTokensSplits,
    tokenAddress,
    terminals,
    ETHBalance,
    distributionLimitCurrency,
    queuedDistributionLimitCurrency,
    balanceInDistributionLimitCurrency,
    tokenSymbol,
    projectOwnerAddress,
    primaryTerminalCurrentOverflow,
    totalTokenSupply,
    ballotState,
  }

  return (
    <V2ProjectContext.Provider value={project}>
      <div style={layouts.maxWidth}>
        <V2Project />

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <ScrollToTopButton />
        </div>
      </div>
    </V2ProjectContext.Provider>
  )
}
