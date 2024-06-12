import { PV_V2 } from 'constants/pv'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { BigNumber } from 'ethers'
import { useProjectsQuery } from 'generated/graphql'
import useNameOfERC20 from 'hooks/ERC20/useNameOfERC20'
import useSymbolOfERC20 from 'hooks/ERC20/useSymbolOfERC20'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useBallotState } from 'hooks/v2v3/contractReader/useBallotState'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/useETHPaymentTerminalFee'
import { usePaymentTerminalBalance } from 'hooks/v2v3/contractReader/usePaymentTerminalBalance'
import useProjectCurrentFundingCycle from 'hooks/v2v3/contractReader/useProjectCurrentFundingCycle'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import useProjectHandle from 'hooks/v2v3/contractReader/useProjectHandle'
import useProjectOwner from 'hooks/v2v3/contractReader/useProjectOwner'
import useProjectSplits from 'hooks/v2v3/contractReader/useProjectSplits'
import useProjectTerminals from 'hooks/v2v3/contractReader/useProjectTerminals'
import useProjectToken from 'hooks/v2v3/contractReader/useProjectToken'
import useProjectTokenTotalSupply from 'hooks/v2v3/contractReader/useProjectTokenTotalSupply'
import useTerminalCurrentOverflow from 'hooks/v2v3/contractReader/useTerminalCurrentOverflow'
import useUsedDistributionLimit from 'hooks/v2v3/contractReader/useUsedDistributionLimit'
import { client } from 'lib/apollo/client'
import first from 'lodash/first'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext, useMemo } from 'react'
import {
  NO_CURRENCY,
  V2V3CurrencyName,
  V2V3_CURRENCY_ETH,
} from 'utils/v2v3/currency'
import { V2V3ProjectContractsContext } from '../ProjectContracts/V2V3ProjectContractsContext'
import { V2V3ProjectContextType } from './V2V3ProjectContext'

const useBalanceInDistributionLimitCurrency = ({
  ETHBalanceLoading,
  ETHBalance,
  distributionLimitCurrency,
}: {
  ETHBalanceLoading: boolean
  ETHBalance: BigNumber | undefined
  distributionLimitCurrency: BigNumber
}) => {
  const converter = useCurrencyConverter()

  return useMemo(() => {
    if (ETHBalanceLoading) return { loading: true }

    // if ETH, no conversion necessary
    if (
      distributionLimitCurrency?.eq(V2V3_CURRENCY_ETH) ||
      distributionLimitCurrency?.eq(NO_CURRENCY)
    ) {
      return { data: ETHBalance, loading: false }
    }

    return {
      data: converter.wadToCurrency(
        ETHBalance,
        V2V3CurrencyName(
          distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
        ),
        V2V3CurrencyName(V2V3_CURRENCY_ETH),
      ),
      loading: false,
    }
  }, [ETHBalance, ETHBalanceLoading, converter, distributionLimitCurrency])
}

export function useV2V3ProjectState({ projectId }: { projectId: number }) {
  const {
    contracts: { JBETHPaymentTerminal },
    loading: { projectContractsLoading },
  } = useContext(V2V3ProjectContractsContext)

  /**
   * Load additional project metadata
   */
  const { data: handle } = useProjectHandle({
    projectId,
  })
  const { data: projectOwnerAddress } = useProjectOwner(projectId)

  /**
   * Load project stats
   */
  const { data } = useProjectsQuery({
    client,
    variables: {
      where: {
        projectId,
        pv: PV_V2,
      },
    },
  })

  const projects = data?.projects
  const projectStatsData = first(projects)
  const {
    createdAt,
    volume: totalVolume,
    trendingVolume,
    paymentsCount,
  } = projectStatsData ?? {}

  /**
   * Load funding cycle data
   */
  const { data: fundingCycleResponse, loading: fundingCycleLoading } =
    useProjectCurrentFundingCycle({
      projectId,
    })
  const [fundingCycle, fundingCycleMetadata] = fundingCycleResponse ?? []
  const { data: ballotState } = useBallotState(projectId)

  /**
   * Load splits data
   */
  const { data: reservedTokensSplits } = useProjectSplits({
    projectId,
    splitGroup: RESERVED_TOKEN_SPLIT_GROUP,
    domain: fundingCycle?.configuration?.toString(),
  })
  const { data: payoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: fundingCycle?.configuration?.toString(),
  })

  /**
   * Load payment terminal data
   */
  const { data: terminals } = useProjectTerminals({
    projectId,
  })
  const primaryETHTerminal = JBETHPaymentTerminal?.address
  const { value: primaryETHTerminalFee } = useETHPaymentTerminalFee()
  const { data: ETHBalance, loading: ETHBalanceLoading } =
    usePaymentTerminalBalance({
      terminal: primaryETHTerminal,
      projectId,
    })
  const { data: primaryTerminalCurrentOverflow } = useTerminalCurrentOverflow({
    projectId,
    terminal: primaryETHTerminal,
  })

  /**
   * Load distribution limit data
   */
  const { data: distributionLimitData, loading: distributionLimitLoading } =
    useProjectDistributionLimit({
      projectId,
      configuration: fundingCycle?.configuration?.toString(),
      terminal: primaryETHTerminal,
    })
  const { data: usedDistributionLimit, loading: usedDistributionLimitLoading } =
    useUsedDistributionLimit({
      projectId,
      terminal: primaryETHTerminal,
      fundingCycleNumber: fundingCycle?.number,
    })
  const [distributionLimit, distributionLimitCurrency] =
    distributionLimitData ?? []
  const {
    data: balanceInDistributionLimitCurrency,
    loading: balanceInDistributionLimitCurrencyLoading,
  } = useBalanceInDistributionLimitCurrency({
    ETHBalanceLoading,
    ETHBalance,
    distributionLimitCurrency,
  })

  /**
   * Load token data
   */
  const { data: tokenAddress } = useProjectToken({
    projectId,
  })
  const { data: tokenSymbol } = useSymbolOfERC20(tokenAddress)
  const { data: tokenName } = useNameOfERC20(tokenAddress)
  const { data: totalTokenSupply } = useProjectTokenTotalSupply(projectId)

  const project: V2V3ProjectContextType = {
    // project metadata
    handle,
    projectOwnerAddress,

    // stats
    createdAt,
    totalVolume,
    trendingVolume,
    paymentsCount,

    // funding cycle data
    fundingCycle,
    fundingCycleMetadata,
    ballotState,

    // splits data
    payoutSplits,
    reservedTokensSplits,

    // payment terminal data
    terminals,
    ETHBalance,
    primaryETHTerminal,
    primaryTerminalCurrentOverflow,
    primaryETHTerminalFee,

    // distribution limit data
    distributionLimit,
    usedDistributionLimit,
    distributionLimitCurrency,
    balanceInDistributionLimitCurrency,

    // token data
    tokenAddress,
    tokenSymbol,
    tokenName,
    totalTokenSupply,

    // loading states
    loading: {
      ETHBalanceLoading,
      balanceInDistributionLimitCurrencyLoading,
      distributionLimitLoading,
      fundingCycleLoading,
      usedDistributionLimitLoading,
      primaryETHTerminalLoading: Boolean(
        projectContractsLoading?.JBETHPaymentTerminalLoading,
      ),
    },
  }

  return project
}
