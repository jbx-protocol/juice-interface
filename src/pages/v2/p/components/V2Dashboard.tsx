import ScrollToTopButton from 'components/ScrollToTopButton'

import * as constants from '@ethersproject/constants'
import {
  V2ProjectContext,
  V2ProjectContextType,
} from 'contexts/v2/projectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useProjectsQuery } from 'hooks/Projects'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import { useBallotState } from 'hooks/v2/contractReader/BallotState'
import { useNftRewardTiersOf } from 'hooks/v2/contractReader/NftRewardTiersOf'
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
import { first } from 'lodash'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useMemo } from 'react'
import { NO_CURRENCY, V2CurrencyName, V2_CURRENCY_ETH } from 'utils/v2/currency'

import useNftRewards from 'hooks/v2/NftRewards'
import { CIDsOfNftRewardTiersResponse } from 'utils/v2/nftRewards'

import useNameOfERC20 from 'hooks/NameOfERC20'
import { ProjectMetadataV4 } from 'models/project-metadata'

import { useVeNftContractForProject } from 'hooks/veNft/VeNftContractForProject'

import { layouts } from 'constants/styles/layouts'
import { V2ArchivedProjectIds } from 'constants/v2/archivedProjects'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'

import V2Project from '../../../../components/v2/V2Project'

export default function V2Dashboard({
  projectId,
  metadata: projectMetadata,
}: {
  projectId: number
  metadata: ProjectMetadataV4
}) {
  const { data: projects } = useProjectsQuery({
    projectId,
    keys: ['createdAt', 'totalPaid'],
    cv: ['2'],
  })
  const createdAt = first(projects)?.createdAt
  const totalVolume = first(projects)?.totalPaid

  const { data: veNftInfo } = useVeNftContractForProject(projectId)
  const veNftContractAddress = first(veNftInfo)?.address
  const veNftUriResolver = first(veNftInfo)?.uriResolver

  const { data: fundingCycleResponse, loading: fundingCycleLoading } =
    useProjectCurrentFundingCycle({
      projectId,
    })
  const [fundingCycle, fundingCycleMetadata] = fundingCycleResponse ?? []

  const { data: payoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: fundingCycle?.configuration?.toString(),
  })

  const { data: terminals } = useProjectTerminals({
    projectId,
  })

  const primaryTerminal = terminals?.[0] // TODO: make primaryTerminalOf hook and use it

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

  const { data: reservedTokensSplits } = useProjectSplits({
    projectId,
    splitGroup: RESERVED_TOKEN_SPLIT_GROUP,
    domain: fundingCycle?.configuration?.toString(),
  })

  const { data: ETHBalance, loading: ETHBalanceLoading } =
    usePaymentTerminalBalance({
      terminal: primaryTerminal,
      projectId,
    })

  const { data: tokenAddress } = useProjectToken({
    projectId,
  })

  const { data: handle } = useProjectHandle({
    projectId,
  })

  const tokenSymbol = useSymbolOfERC20(tokenAddress)
  const tokenName = useNameOfERC20(tokenAddress)

  const { data: primaryTerminalCurrentOverflow } = useTerminalCurrentOverflow({
    projectId,
    terminal: primaryTerminal,
  })

  const converter = useCurrencyConverter()
  const {
    data: balanceInDistributionLimitCurrency,
    loading: balanceInDistributionLimitCurrencyLoading,
  } = useMemo(() => {
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

  const { data: projectOwnerAddress } = useProjectOwner(projectId)

  const { data: totalTokenSupply } = useProjectTokenTotalSupply(projectId)

  const { data: ballotState } = useBallotState(projectId)

  const { data: nftRewardTiersResponse, loading: nftRewardsCIDsLoading } =
    useNftRewardTiersOf(fundingCycleMetadata?.dataSource)

  let nftRewardsCIDs: string[] = []
  if (nftRewardTiersResponse) {
    nftRewardsCIDs = CIDsOfNftRewardTiersResponse(nftRewardTiersResponse)
  }
  const { data: nftRewardTiers, isLoading: nftRewardTiersLoading } =
    useNftRewards(nftRewardTiersResponse ?? [])

  const isArchived = projectId
    ? V2ArchivedProjectIds.includes(projectId) || projectMetadata?.archived
    : false

  // Assumes having `dataSource` means there are NFTs initially
  // In worst case, if has `dataSource` but isn't for NFTs:
  //    - loading will be true briefly
  //    - will resolve false when `useNftRewardTiersOf` fails
  const nftsLoading = Boolean(
    fundingCycleMetadata?.dataSource &&
      fundingCycleMetadata.dataSource !== constants.AddressZero &&
      (nftRewardTiersLoading || nftRewardsCIDsLoading),
  )

  const project: V2ProjectContextType = {
    cv: '2',
    handle,
    projectId,
    createdAt,
    projectMetadata,
    fundingCycle,
    fundingCycleMetadata,
    distributionLimit,
    usedDistributionLimit,
    payoutSplits,
    reservedTokensSplits,
    tokenAddress,
    terminals,
    primaryTerminal,
    ETHBalance,
    totalVolume,
    distributionLimitCurrency,
    balanceInDistributionLimitCurrency,
    tokenSymbol,
    tokenName,
    projectOwnerAddress,
    primaryTerminalCurrentOverflow,
    totalTokenSupply,
    ballotState,
    isArchived,

    nftRewards: {
      CIDs: nftRewardsCIDs,
      rewardTiers: nftRewardTiers ?? [],
      loading: nftsLoading,
    },

    veNft: {
      contractAddress: veNftContractAddress,
      uriResolver: veNftUriResolver,
    },

    loading: {
      ETHBalanceLoading,
      balanceInDistributionLimitCurrencyLoading,
      distributionLimitLoading,
      fundingCycleLoading,
      usedDistributionLimitLoading,
    },
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
