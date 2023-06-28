import { t } from '@lingui/macro'
import { NftPreview } from 'components/NftRewards/NftPreview'
import { useProjectCart } from 'components/ProjectDashboard/hooks'
import { DEFAULT_NFT_MAX_SUPPLY } from 'constants/nftRewards'
import { NftRewardTier } from 'models/nftRewards'
import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'
import { AddNftButton } from './AddNftButton'
import { NftDetails } from './NftDetails'
import { NftThumbnail } from './NftThumbnail'
import { PreviewAddRemoveNftButton } from './PreviewAddRemoveNftButton'
import { RemoveNftButton } from './RemoveNftButton'

type NftRewardProps = {
  className?: string
  rewardTier?: NftRewardTier
  loading?: boolean
  onSelect: (quantity?: number) => void
  onDeselect: VoidFunction
  previewDisabled?: boolean
  hideAttributes?: boolean
}

export function NftReward({
  className,
  loading,
  rewardTier,
  previewDisabled,
  onSelect,
  onDeselect,
  hideAttributes,
}: NftRewardProps) {
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

  const disabled = !hasRemainingSupply

  return (
    <div
      className={twMerge(
        'relative flex h-full w-[252px] select-none flex-col rounded-[10px] border border-grey-200 dark:border-slate-500',
        'shadow-[0_4px_14px_rgba(0,0,0,0.0392156862745098)]', // box-shadow: 0px 4px 14px 0px #0000000A
        isSelected ? 'border-2 border-bluebs-500 dark:border-bluebs-500' : '',
        !disabled ? 'group cursor-pointer' : 'cursor-not-allowed opacity-50',
        className,
      )}
      onClick={!disabled ? openPreview : undefined}
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
      {!disabled &&
        (isSelected ? (
          <RemoveNftButton onClick={() => onDeselect()} />
        ) : (
          <AddNftButton onClick={() => onSelect(1)} />
        ))}
      {rewardTier && !previewDisabled && previewVisible ? (
        <NftPreview
          open={previewVisible}
          rewardTier={rewardTier}
          onClose={closePreview}
          fileUrl={fileUrl}
          actionButton={
            <PreviewAddRemoveNftButton
              onSelect={() => onSelect(1)}
              onDeselect={onDeselect}
              isSelected={isSelected}
            />
          }
        />
      ) : null}
    </div>
  )
}
