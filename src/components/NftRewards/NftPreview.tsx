import { XMarkIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import { Popup } from 'components/Popup'
import { TruncatedText } from 'components/TruncatedText'
import { DEFAULT_NFT_MAX_SUPPLY } from 'constants/nftRewards'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import useMobile from 'hooks/useMobile'
import { NftRewardTier } from 'models/nftRewards'
import { useContext } from 'react'

export function NftPreview({
  open,
  setOpen,
  rewardTier,
  fileUrl: _fileUrl,
  actionButton,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  rewardTier: NftRewardTier
  fileUrl?: string | undefined
  actionButton?: JSX.Element
}) {
  const isMobile = useMobile()
  const fileUrl = _fileUrl ?? rewardTier.fileUrl
  const { projectMetadata } = useContext(ProjectMetadataContext)

  if (!open) return null

  const hasUnlimitedSupply = Boolean(
    !rewardTier.maxSupply || rewardTier.maxSupply === DEFAULT_NFT_MAX_SUPPLY,
  )

  const isSoldOut = Boolean(!rewardTier.remainingSupply)

  const handleClose = () => {
    setOpen(false)
  }

  const remainingSupplyText = hasUnlimitedSupply ? (
    <Trans>REMAINING SUPPLY: Unlimited</Trans>
  ) : isSoldOut ? (
    <Trans>REMAINING SUPPLY: Sold out</Trans>
  ) : (
    <Trans>
      REMAINING SUPPLY: {rewardTier.remainingSupply}/{rewardTier.maxSupply}
    </Trans>
  )

  return (
    <Popup
      className="flex"
      maskClassName="bg-opacity-[0.85]"
      open={open}
      setOpen={setOpen}
      onMaskClick={setOpen => {
        setOpen(false)
      }}
    >
      <div className="relative top-0 mx-auto mt-14 flex max-h-screen w-fit min-w-0">
        <div className="flex w-full max-w-[640px] justify-between gap-6">
          <div className="mt-14 min-w-0 max-w-[560px]">
            <JuiceVideoThumbnailOrImage
              className="h-auto min-h-0 w-auto min-w-0 rounded-none"
              src={fileUrl}
              alt={rewardTier.name}
            />
            <div className="mt-6 flex flex-col gap-2 text-start">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="min-w-0 flex-grow-[99999] font-heading text-2xl md:text-3xl">
                  {rewardTier.name}
                </span>
                {actionButton && !isMobile ? actionButton : null}
              </div>
              {projectMetadata?.name && (
                <TruncatedText
                  className="text-base uppercase text-grey-400"
                  text={projectMetadata.name}
                />
              )}
              {rewardTier.description && (
                <span className="max-w-prose text-slate-100">
                  {rewardTier.description}
                </span>
              )}
              <div className="flex text-xs text-grey-400 md:mt-1">
                {remainingSupplyText}
              </div>

              {actionButton && isMobile ? (
                <div className="mt-3">{actionButton}</div>
              ) : null}
            </div>
          </div>
          <XMarkIcon
            role="button"
            className="h-8 w-8 flex-shrink-0"
            onClick={handleClose}
          />
        </div>
      </div>
    </Popup>
  )
}
