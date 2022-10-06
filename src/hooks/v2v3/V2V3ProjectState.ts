import { BigNumber } from '@ethersproject/bignumber'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContextType } from 'contexts/v2v3/V2V3ProjectContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useNameOfERC20 from 'hooks/NameOfERC20'
import { useProjectsQuery } from 'hooks/Projects'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import { useBallotState } from 'hooks/v2v3/contractReader/BallotState'
import { usePaymentTerminalBalance } from 'hooks/v2v3/contractReader/PaymentTerminalBalance'
import useProjectCurrentFundingCycle from 'hooks/v2v3/contractReader/ProjectCurrentFundingCycle'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/ProjectDistributionLimit'
import useProjectHandle from 'hooks/v2v3/contractReader/ProjectHandle'
import useProjectOwner from 'hooks/v2v3/contractReader/ProjectOwner'
import useProjectSplits from 'hooks/v2v3/contractReader/ProjectSplits'
import useProjectTerminals from 'hooks/v2v3/contractReader/ProjectTerminals'
import useProjectToken from 'hooks/v2v3/contractReader/ProjectToken'
import useProjectTokenTotalSupply from 'hooks/v2v3/contractReader/ProjectTokenTotalSupply'
import useTerminalCurrentOverflow from 'hooks/v2v3/contractReader/TerminalCurrentOverflow'
import useUsedDistributionLimit from 'hooks/v2v3/contractReader/UsedDistributionLimit'
import first from 'lodash/first'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext, useMemo } from 'react'
import {
  NO_CURRENCY,
  V2V3CurrencyName,
  V2V3_CURRENCY_ETH,
} from 'utils/v2v3/currency'

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
  const { cv } = useContext(V2V3ContractsContext)
  const {
    contracts: { JBETHPaymentTerminal },
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
  const { data: projects } = useProjectsQuery({
    projectId,
    keys: ['createdAt', 'totalPaid'],
    cv: cv ? [cv] : undefined,
  })
  const createdAt = first(projects)?.createdAt
  const totalVolume = first(projects)?.totalPaid

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
  const tokenSymbol = useSymbolOfERC20(tokenAddress)
  const tokenName = useNameOfERC20(tokenAddress)
  const { data: totalTokenSupply } = useProjectTokenTotalSupply(projectId)

  const project: V2V3ProjectContextType = {
    // project metadata
    handle,
    projectOwnerAddress,

    // stats
    createdAt,
    totalVolume,

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
    },
  }

  return project
}
