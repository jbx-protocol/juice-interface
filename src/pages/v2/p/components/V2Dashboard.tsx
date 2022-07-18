import Loading from 'components/Loading'
import NewDeployNotAvailable from 'components/NewDeployNotAvailable'
import ScrollToTopButton from 'components/ScrollToTopButton'
import V2Project from 'components/v2/V2Project'
import Project404 from 'components/Project404'

import {
  V2ProjectContext,
  V2ProjectContextType,
} from 'contexts/v2/projectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { usePageTitle } from 'hooks/PageTitle'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useProjectsQuery } from 'hooks/Projects'
import { usePaymentTerminalBalance } from 'hooks/v2/contractReader/PaymentTerminalBalance'
import useProjectCurrentFundingCycle from 'hooks/v2/contractReader/ProjectCurrentFundingCycle'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useProjectHandle from 'hooks/v2/contractReader/ProjectHandle'
import useProjectMetadataContent from 'hooks/v2/contractReader/ProjectMetadataContent'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import useProjectTerminals from 'hooks/v2/contractReader/ProjectTerminals'
import useProjectToken from 'hooks/v2/contractReader/ProjectToken'
import { NO_CURRENCY, V2CurrencyName, V2_CURRENCY_ETH } from 'utils/v2/currency'

import useNameOfERC20 from 'hooks/v1/contractReader/NameOfERC20'

import useProjectOwner from 'hooks/v2/contractReader/ProjectOwner'

import { useBallotState } from 'hooks/v2/contractReader/BallotState'
import useProjectTokenTotalSupply from 'hooks/v2/contractReader/ProjectTokenTotalSupply'
import useTerminalCurrentOverflow from 'hooks/v2/contractReader/TerminalCurrentOverflow'
import useUsedDistributionLimit from 'hooks/v2/contractReader/UsedDistributionLimit'
import { first } from 'lodash'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useContext, useMemo } from 'react'

import { NetworkContext } from 'contexts/networkContext'
import {
  VeNftProjectContextType,
  VeNftProjectContext,
} from 'contexts/v2/veNftProjectContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useNFTBaseImagesHash } from 'hooks/veNft/VeNftBaseImagesHash'
import { useNFTGetVariants } from 'hooks/veNft/VeNftGetVariants'
import { useNFTLockDurationOptions } from 'hooks/veNft/VeNftLockDurationOptions'
import { useNFTResolverAddress } from 'hooks/veNft/VeNftResolverAddress'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'

import useNftRewards from 'hooks/v2/NftRewards'

import { MOCK_NFT_CIDs } from 'utils/v2/nftRewards'

import { useRouter } from 'next/router'

import { layouts } from 'constants/styles/layouts'
import { V2ArchivedProjectIds } from 'constants/v2/archivedProjects'

// import { useNftCIDsOf } from 'hooks/v2/contractReader/NftCIDsOf'

import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'

export default function V2Dashboard({ projectId }: { projectId: number }) {
  //TODO: Move NFT stuff

  const { userAddress } = useContext(NetworkContext)
  const nftProjectName = 'veBanny'
  const { data: lockDurationOptions } = useNFTLockDurationOptions()
  const { data: resolverAddress } = useNFTResolverAddress()
  const baseImagesHash = useNFTBaseImagesHash()
  const { data: variants } = useNFTGetVariants()
  const userTokens = useSubgraphQuery({
    entity: 'veNftToken',
    keys: [
      'tokenId',
      'tokenUri',
      'owner',
      'lockAmount',
      'lockDuration',
      'lockEnd',
      'lockUseJbToken',
      'lockAllowPublicExtension',
      'createdAt',
      'unlockedAt',
      'redeemedAt',
    ],
    where: [
      {
        key: 'owner',
        value: userAddress || '',
      },
    ],
  }).data

  const veNftProject: VeNftProjectContextType = {
    name: nftProjectName,
    lockDurationOptions,
    baseImagesHash,
    resolverAddress,
    variants,
    userTokens,
  }

  const router = useRouter()
  const { data: metadataCID, loading: metadataURILoading } =
    useProjectMetadataContent(projectId)

  const {
    data: projectMetadata,
    error: metadataError,
    isLoading: metadataLoading,
  } = useProjectMetadata(metadataCID)

  usePageTitle({
    title: projectMetadata?.name
      ? `${projectMetadata.name} | Juicebox`
      : undefined,
  })

  const { data: projects } = useProjectsQuery({
    projectId,
    keys: ['createdAt', 'totalPaid'],
    cv: ['2'],
  })
  const createdAt = first(projects)?.createdAt
  const totalVolume = first(projects)?.totalPaid

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

  const isNewDeploy = Boolean(router.query.newDeploy)

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

  // const { data: nftRewardsCIDs, loading: nftRewardsCIDsLoading } = useNftCIDsOf(projectId)
  const nftRewardsCIDs = MOCK_NFT_CIDs
  const { data: nftRewardTiers, isLoading: nftRewardTiersLoading } =
    useNftRewards(nftRewardsCIDs)

  const isArchived = projectId
    ? V2ArchivedProjectIds.includes(projectId) || projectMetadata?.archived
    : false

  if (metadataLoading || metadataURILoading) {
    return <Loading />
  }
  if (isNewDeploy && !metadataCID) {
    return <NewDeployNotAvailable handleOrId={projectId} />
  }
  if (metadataError || !metadataCID) {
    return <Project404 projectId={projectId} />
  }

  const nftsLoading = nftRewardTiersLoading // || nftRewardsCIDsLoading

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
      <VeNftProjectContext.Provider value={veNftProject}>
        <div style={layouts.maxWidth}>
          <V2Project />

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <ScrollToTopButton />
          </div>
        </div>
      </VeNftProjectContext.Provider>
    </V2ProjectContext.Provider>
  )
}
