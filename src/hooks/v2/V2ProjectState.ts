import { BigNumber } from '@ethersproject/bignumber'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { V2ProjectContextType } from 'contexts/v2/projectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useNameOfERC20 from 'hooks/NameOfERC20'
import { useProjectsQuery } from 'hooks/Projects'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import { useBallotState } from 'hooks/v2/contractReader/BallotState'
import { usePaymentTerminalBalance } from 'hooks/v2/contractReader/PaymentTerminalBalance'
import useProjectCurrentFundingCycle from 'hooks/v2/contractReader/ProjectCurrentFundingCycle'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useProjectHandle from 'hooks/v2/contractReader/ProjectHandle'
import useProjectOwner from 'hooks/v2/contractReader/ProjectOwner'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import useProjectTerminals from 'hooks/v2/contractReader/ProjectTerminals'
import useProjectToken from 'hooks/v2/contractReader/ProjectToken'
import useProjectTokenTotalSupply from 'hooks/v2/contractReader/ProjectTokenTotalSupply'
import useTerminalCurrentOverflow from 'hooks/v2/contractReader/TerminalCurrentOverflow'
import useUsedDistributionLimit from 'hooks/v2/contractReader/UsedDistributionLimit'
import first from 'lodash/first'
import { CV } from 'models/cv'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useMemo } from 'react'
import { NO_CURRENCY, V2CurrencyName, V2_CURRENCY_ETH } from 'utils/v2/currency'

const V2_PROJECT_CV: CV = '2'

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
      distributionLimitCurrency?.eq(V2_CURRENCY_ETH) ||
      distributionLimitCurrency?.eq(NO_CURRENCY)
    ) {
      return { data: ETHBalance, loading: false }
    }

    return {
      data: converter.wadToCurrency(
        ETHBalance,
        V2CurrencyName(
          distributionLimitCurrency?.toNumber() as V2CurrencyOption,
        ),
        V2CurrencyName(V2_CURRENCY_ETH),
      ),
      loading: false,
    }
  }, [ETHBalance, ETHBalanceLoading, converter, distributionLimitCurrency])
}

export function useV2ProjectState({ projectId }: { projectId: number }) {
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
    cv: [V2_PROJECT_CV],
  })
  const createdAt = first(projects)?.createdAt
  const totalVolume = first(projects)?.totalPaid

  /**
   * Load funding cyle data
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
  const primaryTerminal = terminals?.[0] // TODO: make primaryTerminalOf hook and use it
  const { data: ETHBalance, loading: ETHBalanceLoading } =
    usePaymentTerminalBalance({
      terminal: primaryTerminal,
      projectId,
    })
  const { data: primaryTerminalCurrentOverflow } = useTerminalCurrentOverflow({
    projectId,
    terminal: primaryTerminal,
  })

  /**
   * Load distribution limit data
   */
  const { data: distributionLimitData, loading: distributionLimitLoading } =
    useProjectDistributionLimit({
      projectId,
      configuration: fundingCycle?.configuration?.toString(),
      terminal: primaryTerminal,
    })
  const { data: usedDistributionLimit, loading: usedDistributionLimitLoading } =
    useUsedDistributionLimit({
      projectId,
      terminal: primaryTerminal,
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

  const project: V2ProjectContextType = {
    cv: V2_PROJECT_CV,

    // project metadata
    projectId,
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
    primaryTerminal,
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
