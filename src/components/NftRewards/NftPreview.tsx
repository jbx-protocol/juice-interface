import { CloseOutlined, LinkOutlined, LoadingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { JuiceVideoPreview } from 'components/JuiceVideo/JuiceVideoPreview'
import { DEFAULT_NFT_MAX_SUPPLY } from 'contexts/NftRewards/NftRewards'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useContentType } from 'hooks/useContentType'
import { NftRewardTier } from 'models/nftRewards'
import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { fileTypeIsVideo } from 'utils/nftRewards'
import { JUICE_IMG_PREVIEW_CONTAINER_CLASS } from '../JuiceVideo/JuiceVideoOrImgPreview'

export const IMAGE_OR_VIDEO_PREVIEW_CLASSES =
  'max-h-[50vh] md:max-h-[60vh] max-w-[458px]'

export function NftPreview({
  open,
  rewardTier,
  onClose,
  fileUrl: _fileUrl,
  actionButton,
}: {
  open: boolean
  rewardTier: NftRewardTier
  onClose: VoidFunction
  fileUrl?: string | undefined
  actionButton?: JSX.Element
}) {
  const fileUrl = _fileUrl ?? rewardTier.fileUrl
  const { projectMetadata } = useContext(ProjectMetadataContext)

  if (!open) return null

  const hasUnlimitedSupply = Boolean(
    !rewardTier.maxSupply || rewardTier.maxSupply === DEFAULT_NFT_MAX_SUPPLY,
  )

  const isSoldOut = Boolean(!rewardTier.remainingSupply)

  const { data: contentType, isLoading: contentTypeLoading } =
    useContentType(fileUrl)
  const isVideo = fileTypeIsVideo(contentType)

  const nftRender = (
    <div onClick={e => e.stopPropagation()}>
      {contentTypeLoading ? (
        <div className="flex h-[50vh] w-96 items-center justify-center">
          <LoadingOutlined className="text-5xl" />
        </div>
      ) : isVideo && fileUrl ? (
        <JuiceVideoPreview src={fileUrl} />
      ) : (
        <img
          className={IMAGE_OR_VIDEO_PREVIEW_CLASSES}
          alt={rewardTier.name}
          src={fileUrl}
          onClick={e => e.stopPropagation()}
          crossOrigin="anonymous"
        />
      )}
    </div>
  )

  const _onClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
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
    <div
      className={`${JUICE_IMG_PREVIEW_CONTAINER_CLASS} cursor-default`}
      onClick={_onClose}
    >
      <div
        className="relative max-w-[458px] cursor-text select-text pt-24 md:pt-0"
        onClick={e => e.stopPropagation()}
      >
        <CloseOutlined
          className="absolute top-4 -right-10 cursor-pointer text-2xl text-slate-100 md:-top-2"
          onClick={_onClose}
        />
        <div
          className="mb-5 flex w-full cursor-default justify-center"
          onClick={_onClose}
        >
          {nftRender}
        </div>
        <div className="mb-4 flex items-center justify-between gap-6">
          <h1 className="mb-0 text-2xl text-slate-100">{rewardTier.name}</h1>
          {actionButton ? actionButton : null}
        </div>
        <span className="uppercase text-slate-100">
          <Trans>{projectMetadata?.name}</Trans>
        </span>
        <p className="mt-2 max-w-prose text-slate-100">
          {rewardTier.description}
        </p>
        <div className="mt-5 flex text-xs text-slate-100">
          {remainingSupplyText}
          {rewardTier.externalLink ? (
            <ExternalLink
              href={rewardTier.externalLink}
              className={twMerge(
                'ml-6 flex cursor-pointer items-center text-slate-100',
              )}
            >
              <LinkOutlined className="text-lg" />
              <span className="ml-1 underline">
                <Trans>LINK TO NFT</Trans>
              </span>
            </ExternalLink>
          ) : null}
        </div>
      </div>
    </div>
  )
}
