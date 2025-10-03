import {
  useJBChainId,
  useJBRulesetContext,
} from 'juice-sdk-react'
import { jb721TiersHookAbi } from 'juice-sdk-core'
import { useWriteContract } from 'wagmi'
import { JB_721_TIER_PARAMS_V4, NftRewardTier } from 'models/nftRewards'
import { useCallback, useContext, useState } from 'react'
import { buildJB721TierParams, pinNftRewards } from 'utils/nftRewards'

import { t } from '@lingui/macro'
import { waitForTransactionReceipt } from '@wagmi/core'
import { NEW_NFT_ID_LOWER_LIMIT } from 'components/NftRewards/RewardsList/AddEditRewardModal'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { JB721DelegateVersion } from 'models/JB721Delegate'
import { wagmiConfig } from 'contexts/Para/Providers'
import { emitErrorNotification } from 'utils/notifications'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'

export function useUpdateCurrentCollection({
  rewardTiers,
  editedRewardTierIds,
  onConfirmed,
}: {
  rewardTiers: NftRewardTier[] | undefined
  editedRewardTierIds: number[]
  onConfirmed?: VoidFunction
}) {
  const { addTransaction } = useContext(TxHistoryContext)
  const {
    rulesetMetadata: { data: rulesetMetadata },
  } = useJBRulesetContext()

  const { writeContractAsync: writeAdjustTiers } = useWriteContract()
  const chainId = useJBChainId()
  const { version } = useV4V5Version()

  const [txLoading, setTxLoading] = useState<boolean>(false)

  const updateExistingCollection = useCallback(async () => {
    if (!rewardTiers || !rulesetMetadata?.dataHook) {
      emitErrorNotification(t`There are no NFT tiers to update.`)
      return
    }

    const newRewardTiers = rewardTiers.filter(
      rewardTier =>
        rewardTier.id > NEW_NFT_ID_LOWER_LIMIT || // rewardTiers with id > NEW_NFT_ID_LOWER_LIMIT are new
        editedRewardTierIds.includes(rewardTier.id),
    )

    // upload new rewardTiers and get their CIDs
    const rewardTiersCIDs = await pinNftRewards(newRewardTiers)

    const tiersToAdd = buildJB721TierParams({
      cids: rewardTiersCIDs,
      rewardTiers: newRewardTiers,
      version: version === 5 ? JB721DelegateVersion.JB721DELEGATE_V5 : JB721DelegateVersion.JB721DELEGATE_V4,
    }) as JB_721_TIER_PARAMS_V4[]

    if (!newRewardTiers) {
      emitErrorNotification(
        t`Your project's NFT contract version is not supported.`,
      )
      return
    }
    try {
      const hash = await writeAdjustTiers({
        abi: jb721TiersHookAbi,
        functionName: 'adjustTiers',
        chainId,
        args: [tiersToAdd, editedRewardTierIds.map(id => BigInt(id))],
        address: rulesetMetadata.dataHook,
      })

      addTransaction?.('Update NFT rewards', { hash, chainId })
      await waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId,
      })

      setTxLoading(false)
      onConfirmed?.()
    } catch (e) {
      setTxLoading(false)

      emitErrorNotification((e as unknown as Error).message)
    }
  }, [
    editedRewardTierIds,
    writeAdjustTiers,
    onConfirmed,
    rewardTiers,
    addTransaction,
    rulesetMetadata?.dataHook,
    chainId,
    version,
  ])

  return {
    updateExistingCollection,
    txLoading,
  }
}
