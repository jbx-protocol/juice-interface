import {
  useJBProjectId,
  useJBRulesetContext,
  useJBUpcomingRuleset,
  useSuckers,
} from '@bananapus/nana-sdk-react'
import {
  RevnetCoreContracts,
  getJBContractAddress,
  jb721TiersHookAbi,
  jb721TiersHookStoreAbi,
  jb721TiersHookStoreV5Abi,
  jbContractAddress,
  jbOmnichainDeployerAbi,
  jbOmnichainDeployerV5Abi,
  revDeployerV5Abi,
  revOwnerAbi,
} from '@bananapus/nana-sdk-core'
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
 * Uses the v4/v5 tier shape (flat flag booleans, `encodedIPFSUri`); v6 store
 * responses are normalized to this shape before being handed to consumers.
 */
export type JB721TierV4 = ContractFunctionReturnType<
  typeof jb721TiersHookStoreV5Abi,
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
 * Provides NFT rewards data for V4/V5/V6 projects.
 *
 * Handles three patterns of NFT hook storage:
 * 1. Direct 721 Hook - dataHook points directly to the 721 Hook contract
 * 2. Omnichain Deployer - dataHook points to deployer, which stores the real hook
 *    (v4/v5 expose it via dataHookOf, v6 via tiered721HookOf)
 * 3. Revnet - dataHook points to the revnet deployer (v4/v5, which stores the
 *    real hook) or the REVOwner contract (v6, which stores it instead)
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
  // v6 revnets keep their 721 hook on the REVOwner contract (same address on all chains)
  const revOwnerAddress =
    version === 6 && chainId
      ? jbContractAddress['6'][RevnetCoreContracts.REVOwner][chainId]
      : undefined

  const isOmnichainDeployer =
    dataHookAddress?.toLowerCase() === omnichainDeployerAddress
  const isRevnetProject =
    dataHookAddress?.toLowerCase() === revDeployerAddress ||
    (!!revOwnerAddress &&
      dataHookAddress?.toLowerCase() === revOwnerAddress.toLowerCase())

  // Resolve the actual 721 Hook address from deployer contracts.
  // v4/v5 deployers expose dataHookOf(projectId, rulesetId) returning
  // (useDataHookForPay, useDataHookForCashout, dataHook); the v6 deployer
  // replaced it with tiered721HookOf(projectId, rulesetId) returning
  // (hook, useDataHookForCashOut).
  const currentRulesetId = jbRuleSet.ruleset.data?.id
  const omnichainHookV5 = useReadContract({
    abi: jbOmnichainDeployerV5Abi,
    address: dataHookAddress,
    functionName: 'dataHookOf',
    args:
      projectId && currentRulesetId
        ? [projectId, BigInt(currentRulesetId)]
        : undefined,
    chainId,
    query: {
      enabled:
        version !== 6 &&
        isOmnichainDeployer &&
        !!projectId &&
        !!currentRulesetId,
    },
  })
  const omnichainHookV6 = useReadContract({
    abi: jbOmnichainDeployerAbi,
    address: dataHookAddress,
    functionName: 'tiered721HookOf',
    args:
      projectId && currentRulesetId
        ? [projectId, BigInt(currentRulesetId)]
        : undefined,
    chainId,
    query: {
      enabled:
        version === 6 &&
        isOmnichainDeployer &&
        !!projectId &&
        !!currentRulesetId,
    },
  })
  const omnichainHookAddress =
    version === 6 ? omnichainHookV6.data?.[0] : omnichainHookV5.data?.[2]

  const revnetHookV5 = useReadContract({
    abi: revDeployerV5Abi,
    address: dataHookAddress,
    functionName: 'tiered721HookOf',
    args: projectId ? [projectId] : undefined,
    chainId,
    query: {
      enabled: version !== 6 && isRevnetProject && !!projectId,
    },
  })
  const revnetHookV6 = useReadContract({
    abi: revOwnerAbi,
    address: revOwnerAddress,
    functionName: 'tiered721HookOf',
    args: projectId ? [projectId] : undefined,
    chainId,
    query: {
      enabled: version === 6 && isRevnetProject && !!projectId,
    },
  })
  const revnetHookAddress = version === 6 ? revnetHookV6.data : revnetHookV5.data

  // Use resolved hook address if available, otherwise use original dataHook
  const resolved721HookAddress = (omnichainHookAddress ||
    revnetHookAddress ||
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

  // The v6 store returns a different tier shape (nested flags tuple,
  // splitPercent, `encodedIpfsUri` casing), so read with the matching ABI
  // per version and normalize v6 tiers to the v4/v5 shape below.
  const tiersOfV5 = useReadContract({
    abi: jb721TiersHookStoreV5Abi,
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
    query: { enabled: version !== 6 },
  })
  const tiersOfV6 = useReadContract({
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
    query: { enabled: version === 6 },
  })

  const tiersData: readonly JB721TierV4[] | undefined = React.useMemo(() => {
    if (version !== 6) return tiersOfV5.data
    return tiersOfV6.data?.map(tier => ({
      id: tier.id,
      price: tier.price,
      remainingSupply: tier.remainingSupply,
      initialSupply: tier.initialSupply,
      votingUnits: tier.votingUnits,
      reserveFrequency: tier.reserveFrequency,
      reserveBeneficiary: tier.reserveBeneficiary,
      encodedIPFSUri: tier.encodedIpfsUri,
      category: tier.category,
      discountPercent: tier.discountPercent,
      allowOwnerMint: tier.flags.allowOwnerMint,
      transfersPausable: tier.flags.transfersPausable,
      cannotBeRemoved: tier.flags.cantBeRemoved,
      cannotIncreaseDiscountPercent: tier.flags.cantIncreaseDiscountPercent,
      resolvedUri: tier.resolvedUri,
    }))
  }, [version, tiersOfV5.data, tiersOfV6.data])

  const { data: loadedRewardTiers, isLoading: nftRewardTiersLoading } =
    useNftRewards(
      tiersData ?? [],
      projectChains,
      projectId,
      chainId,
      storeAddress.data as `0x${string}` | undefined,
      resolved721HookAddress,
      version,
    )

  const loadedCIDs = CIDsOfNftRewardTiersResponse(tiersData ?? [])

  const p = useReadContract({
    abi: jb721TiersHookAbi,
    address: resolved721HookAddress,
    functionName: 'pricingContext',
    chainId,
  })
  const currency = Number(p.data ? p.data[0] : 0) as V2V3CurrencyOption

  // v6 flagsOf returns an extra flag (issueTokensForSplits), which changes the
  // encoded response size, so the versioned ABI is required to decode.
  const flagsV5 = useReadContract({
    abi: jb721TiersHookStoreV5Abi,
    address: storeAddress.data,
    functionName: 'flagsOf',
    args: [resolved721HookAddress ?? zeroAddress],
    chainId,
    query: { enabled: version !== 6 },
  })
  const flagsV6 = useReadContract({
    abi: jb721TiersHookStoreAbi,
    address: storeAddress.data,
    functionName: 'flagsOf',
    args: [resolved721HookAddress ?? zeroAddress],
    chainId,
    query: { enabled: version === 6 },
  })
  const flagsData = version === 6 ? flagsV6.data : flagsV5.data

  const { data: collectionMetadataUri } = useReadContract({
    abi: jb721TiersHookAbi,
    address: resolved721HookAddress,
    functionName: 'contractURI',
    chainId,
  })

  const loading = React.useMemo(
    () =>
      omnichainHookV5.isLoading ||
      omnichainHookV6.isLoading ||
      revnetHookV5.isLoading ||
      revnetHookV6.isLoading ||
      storeAddress.isLoading ||
      tiersOfV5.isLoading ||
      tiersOfV6.isLoading ||
      nftRewardTiersLoading ||
      p.isLoading ||
      flagsV5.isLoading ||
      flagsV6.isLoading,
    [
      omnichainHookV5.isLoading,
      omnichainHookV6.isLoading,
      revnetHookV5.isLoading,
      revnetHookV6.isLoading,
      storeAddress.isLoading,
      tiersOfV5.isLoading,
      tiersOfV6.isLoading,
      nftRewardTiersLoading,
      p.isLoading,
      flagsV5.isLoading,
      flagsV6.isLoading,
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
      flags: flagsData ?? DEFAULT_NFT_FLAGS_V4,
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
