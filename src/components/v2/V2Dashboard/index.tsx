import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useParams } from 'react-router-dom'
import Loading from 'components/shared/Loading'
import { BigNumber } from '@ethersproject/bignumber'
import useProjectMetadataContent from 'hooks/v2/contractReader/ProjectMetadataContent'
import ScrollToTopButton from 'components/shared/ScrollToTopButton'
import useProjectCurrentFundingCycle from 'hooks/v2/contractReader/ProjectCurrentFundingCycle'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import useProjectTerminals from 'hooks/v2/contractReader/ProjectTerminals'
import { useETHPaymentTerminalBalance } from 'hooks/v2/contractReader/ETHPaymentTerminalBalance'
import useProjectToken from 'hooks/v2/contractReader/ProjectToken'
import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import { useContext, useMemo } from 'react'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { useDistributionLimitCurrency } from 'hooks/v2/contractReader/DistributionLimitCurrency'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { V2_CURRENCY_ETH } from 'utils/v2/currency'
import { V2UserContext } from 'contexts/v2/userContext'

import { layouts } from 'constants/styles/layouts'

import V2Project from '../V2Project'
import Dashboard404 from './Dashboard404'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVE_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'

export default function V2Dashboard() {
  const { projectId: projectIdParameter }: { projectId?: string } = useParams()
  const projectId = BigNumber.from(projectIdParameter)
  const { contracts } = useContext(V2UserContext)

  const { data: metadataCID, loading: metadataURILoading } =
    useProjectMetadataContent(projectId)

  const {
    data: projectMetadata,
    error: metadataError,
    isLoading: metadataLoading,
  } = useProjectMetadata(metadataCID)

  const { data: fundingCycle } = useProjectCurrentFundingCycle({
    projectId,
  })

  const { data: queuedFundingCycle } = useProjectQueuedFundingCycle({
    projectId,
  })

  const { data: payoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: fundingCycle?.configuration?.toString(),
  })
  const { data: terminals } = useProjectTerminals({
    projectId,
  })

  const { data: distributionLimit } = useProjectDistributionLimit({
    projectId,
    domain: fundingCycle?.configuration?.toString(),
    // terminal: terminals ? terminals[0] : undefined,
    terminal: terminals?.[0], //TODO: make primaryTerminalOf hook and use it
  })

  const { data: queuedDistributionLimit } = useProjectDistributionLimit({
    projectId,
    domain: queuedFundingCycle?.configuration?.toString(),
    // terminal: terminals ? terminals[0] : '',
    terminal: terminals?.[0],
  })

  const { data: queuedPayoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: queuedFundingCycle?.configuration?.toString(),
  })

  const { data: reserveTokenSplits } = useProjectSplits({
    projectId,
    splitGroup: RESERVE_TOKEN_SPLIT_GROUP,
    domain: fundingCycle?.configuration?.toString(),
  })

  const { data: ETHBalance } = useETHPaymentTerminalBalance({
    projectId,
  })

  const { data: tokenAddress } = useProjectToken({
    projectId,
  })

  const converter = useCurrencyConverter()

  const { data: distributionLimitCurrency } = useDistributionLimitCurrency({
    projectId,
    fundingCycleConfiguration: fundingCycle?.configuration,
    terminal: contracts?.JBETHPaymentTerminal.address,
  })

  const { data: queuedDistributionLimitCurrency } =
    useDistributionLimitCurrency({
      projectId,
      fundingCycleConfiguration: queuedFundingCycle?.configuration,
      terminal: contracts?.JBETHPaymentTerminal.address,
    })

  const balanceInDistributionLimitCurrency = useMemo(
    () =>
      ETHBalance &&
      converter.wadToCurrency(
        ETHBalance,
        (distributionLimitCurrency?.toNumber() as V2CurrencyOption) ===
          V2_CURRENCY_ETH
          ? 'ETH'
          : 'USD',
        'ETH',
      ),
    [ETHBalance, converter, distributionLimitCurrency],
  )

  if (metadataLoading || metadataURILoading) return <Loading />

  if (projectId?.eq(0) || metadataError || !metadataCID) {
    return <Dashboard404 projectId={projectId} />
  }

  const project = {
    projectId,
    projectMetadata,
    fundingCycle,
    queuedFundingCycle,
    distributionLimit,
    queuedDistributionLimit,
    payoutSplits,
    queuedPayoutSplits,
    reserveTokenSplits,
    tokenAddress,
    terminals,
    ETHBalance,
    distributionLimitCurrency,
    queuedDistributionLimitCurrency,
    balanceInDistributionLimitCurrency,
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
