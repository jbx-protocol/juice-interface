import { t } from '@lingui/macro'
import { NftPreview } from 'components/NftRewards/NftPreview'
import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { DEFAULT_NFT_MAX_SUPPLY } from 'contexts/NftRewards/NftRewards'
import { NftRewardTier } from 'models/nftRewards'
import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'
import { AddNftButton } from './AddNftButton'
import { NftDetails } from './NftDetails'
import { NftThumbnail } from './NftThumbnail'

type NftRewardProps = {
  rewardTier?: NftRewardTier
  loading?: boolean
  onSelect: (quantity?: number) => void
  previewDisabled?: boolean
  hideAttributes?: boolean
}

export function NftReward({
  loading,
  rewardTier,
  previewDisabled,
  onSelect,
  hideAttributes,
}: NftRewardProps) {
  // TODO: Move all state into a hook
  const [previewVisible, setPreviewVisible] = useState<boolean>(false)
  const cart = useProjectCart()

  const quantitySelected = useMemo(
    () => cart.nftRewards.find(nft => nft.id === rewardTier?.id)?.quantity ?? 0,
    [cart.nftRewards, rewardTier?.id],
  )

  const fileUrl = rewardTier?.fileUrl
    ? ipfsUriToGatewayUrl(rewardTier.fileUrl)
    : rewardTier?.fileUrl

  const isSelected = quantitySelected > 0

  const openPreview = () => {
    setPreviewVisible(true)
  }
  const closePreview = () => {
    setPreviewVisible(false)
  }

  const remainingSupply = rewardTier?.remainingSupply
  const hasRemainingSupply = remainingSupply && remainingSupply > 0
  const remainingSupplyText = !hasRemainingSupply
    ? t`SOLD OUT`
    : rewardTier.maxSupply === DEFAULT_NFT_MAX_SUPPLY
    ? t`Unlimited`
    : t`${rewardTier?.remainingSupply} remaining`

  return (
    <div
      className={twMerge(
        'group relative flex h-full w-full cursor-pointer select-none flex-col rounded-lg border border-grey-200 dark:border-slate-500',
        isSelected ? 'border-2 border-bluebs-500 dark:border-bluebs-500' : '',
      )}
      onClick={openPreview}
    >
      <NftThumbnail
        fileUrl={fileUrl}
        isSelected={isSelected}
        rewardTier={rewardTier}
      />
      <NftDetails
        rewardTier={rewardTier}
        loading={loading}
        hideAttributes={hideAttributes}
        remainingSupplyText={remainingSupplyText}
      />
      <AddNftButton onClick={() => onSelect(1)} />
      {rewardTier && !previewDisabled && previewVisible ? (
        <NftPreview
          open={previewVisible}
          rewardTier={rewardTier}
          onClose={closePreview}
          fileUrl={fileUrl}
        />
      ) : null}
    </div>
  )
}
