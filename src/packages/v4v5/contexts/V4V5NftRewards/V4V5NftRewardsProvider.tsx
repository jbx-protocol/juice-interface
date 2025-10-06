import {
  useJBProjectId,
  useJBRulesetContext,
  useJBUpcomingRuleset,
  useSuckers,
} from 'juice-sdk-react'
import {
  jb721TiersHookStoreAbi,
  jb721TiersHookAbi,
  jbOmnichainDeployerAbi,
  revDeployerAbi,
  getJBContractAddress,
} from 'juice-sdk-core'
import { useReadContract } from 'wagmi'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import React, { createContext } from 'react'
import {
  DEFAULT_NFT_FLAGS_V4,
  DEFAULT_NFT_PRICING,
  EMPTY_NFT_COLLECTION_METADATA,
} from 'redux/slices/v2v3/editingV2Project'
import { ContractFunctionReturnType, zeroAddress } from 'viem'

import { JB721GovernanceType } from 'models/nftRewards'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V4V5NftRewardsData } from 'packages/v4v5/models/nfts'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'
import { useNftRewards } from './useNftRewards'

const NFT_PAGE_SIZE = 100n

/**
 * Type for individual NFT tier data returned from the 721 Hook Store.
 * Inferred from the tiersOf function return type in the ABI.
 */
export type JB721TierV4 = ContractFunctionReturnType<
  typeof jb721TiersHookStoreAbi,
  'view',
  'tiersOf'
>[0]

type NftRewardsContextType = {
  nftRewards: V4V5NftRewardsData
  loading: boolean | undefined
}

export const V4V5NftRewardsContext = createContext<NftRewardsContextType>({
  nftRewards: {
    CIDs: undefined,
    rewardTiers: undefined,
    collectionMetadata: EMPTY_NFT_COLLECTION_METADATA,
    flags: DEFAULT_NFT_FLAGS_V4,
    governanceType: JB721GovernanceType.NONE,
    pricing: DEFAULT_NFT_PRICING,
  },
  loading: false,
})

/**
 * Provides NFT rewards data for V4/V5 projects.
 *
 * Handles three patterns of NFT hook storage:
 * 1. Direct 721 Hook - dataHook points directly to the 721 Hook contract
 * 2. Omnichain Deployer - dataHook points to deployer, which stores the real hook
 * 3. Revnet Deployer - dataHook points to revnet deployer, which stores the real hook
 *
 * The resolver logic detects which pattern is being used and fetches the actual
 * 721 Hook address before loading NFT tier data.
 */
export const V4V5NftRewardsProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const jbRuleSet = useJBRulesetContext()
  const { projectId, chainId } = useJBProjectId()
  const upcomingRuleset = useJBUpcomingRuleset({ projectId, chainId })
  const { data: suckers } = useSuckers()
  const { version } = useV4V5Version()

  // Use upcoming ruleset's dataHook for projects that haven't started yet (cycle 0)
  let dataHookAddress = jbRuleSet.rulesetMetadata.data?.dataHook
  if (jbRuleSet.ruleset.data?.cycleNumber === 0) {
    dataHookAddress = upcomingRuleset?.rulesetMetadata?.dataHook
  }

  // Check if dataHook is a known deployer that needs resolution
  const omnichainDeployerAddress = chainId
    ? getJBContractAddress('JBOmnichainDeployer', version, chainId)?.toLowerCase()
    : undefined
  const revDeployerAddress = chainId
    ? getJBContractAddress('REVDeployer', version, chainId)?.toLowerCase()
    : undefined

  const isOmnichainDeployer =
    dataHookAddress?.toLowerCase() === omnichainDeployerAddress
  const isRevnetDeployer =
    dataHookAddress?.toLowerCase() === revDeployerAddress

  // Resolve the actual 721 Hook address from deployer contracts
  const currentRulesetId = jbRuleSet.ruleset.data?.id
  const omnichainHook = useReadContract({
    abi: jbOmnichainDeployerAbi,
    address: dataHookAddress,
    functionName: 'dataHookOf',
    args:
      projectId && currentRulesetId
        ? [projectId, BigInt(currentRulesetId)]
        : undefined,
    chainId,
    query: {
      enabled: isOmnichainDeployer && !!projectId && !!currentRulesetId,
    },
  })

  const revnetHook = useReadContract({
    abi: revDeployerAbi,
    address: dataHookAddress,
    functionName: 'tiered721HookOf',
    args: projectId ? [projectId] : undefined,
    chainId,
    query: {
      enabled: isRevnetDeployer && !!projectId,
    },
  })

  // Use resolved hook address if available, otherwise use original dataHook
  const resolved721HookAddress = (omnichainHook.data ||
    revnetHook.data ||
    dataHookAddress) as `0x${string}` | undefined

  // Load NFT tier data from the 721 Hook and its store
  const storeAddress = useReadContract({
    abi: jb721TiersHookAbi,
    address: resolved721HookAddress,
    functionName: 'STORE',
    chainId,
  })

  const projectChains =
    suckers?.map(s => s.peerChainId).filter(id => id !== undefined) ||
    (chainId ? [chainId] : [])

  const tiersOf = useReadContract({
    abi: jb721TiersHookStoreAbi,
    address: storeAddress.data,
    functionName: 'tiersOf',
    args: [
      resolved721HookAddress ?? zeroAddress,
      [],
      false,
      0n,
      NFT_PAGE_SIZE,
    ],
    chainId,
  })

  const { data: loadedRewardTiers, isLoading: nftRewardTiersLoading } =
    useNftRewards(
      tiersOf.data ?? [],
      projectChains,
      projectId,
      chainId,
      storeAddress.data as `0x${string}` | undefined,
      resolved721HookAddress,
    )

  const loadedCIDs = CIDsOfNftRewardTiersResponse(tiersOf.data ?? [])

  const p = useReadContract({
    abi: jb721TiersHookAbi,
    address: resolved721HookAddress,
    functionName: 'pricingContext',
    chainId,
  })
  const currency = Number(p.data ? p.data[0] : 0) as V2V3CurrencyOption

  const flags = useReadContract({
    abi: jb721TiersHookStoreAbi,
    address: storeAddress.data,
    functionName: 'flagsOf',
    args: [resolved721HookAddress ?? zeroAddress],
    chainId,
  })

  const { data: collectionMetadataUri } = useReadContract({
    abi: jb721TiersHookAbi,
    address: resolved721HookAddress,
    functionName: 'contractURI',
    chainId,
  })

  const loading = React.useMemo(
    () =>
      omnichainHook.isLoading ||
      revnetHook.isLoading ||
      storeAddress.isLoading ||
      tiersOf.isLoading ||
      nftRewardTiersLoading ||
      p.isLoading ||
      flags.isLoading,
    [
      omnichainHook.isLoading,
      revnetHook.isLoading,
      storeAddress.isLoading,
      tiersOf.isLoading,
      nftRewardTiersLoading,
      p.isLoading,
      flags.isLoading,
    ],
  )

  const ctx = {
    nftRewards: {
      CIDs: loadedCIDs,
      rewardTiers: loadedRewardTiers,
      pricing: { currency },
      governanceType: JB721GovernanceType.NONE,
      collectionMetadata: {
        ...EMPTY_NFT_COLLECTION_METADATA,
        uri: collectionMetadataUri,
      },
      flags: flags.data ?? DEFAULT_NFT_FLAGS_V4,
    },
    loading,
  }

  return (
    <V4V5NftRewardsContext.Provider value={ctx}>
      {children}
    </V4V5NftRewardsContext.Provider>
  )
}

export const useV4V5NftRewards = () => React.useContext(V4V5NftRewardsContext)
