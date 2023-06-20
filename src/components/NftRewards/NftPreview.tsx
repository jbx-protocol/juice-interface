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
  'max-h-[50vh] max-w-[90vw] md:max-h-[60vh] md:max-w-xl'

export function NftPreview({
  open,
  rewardTier,
  onClose,
  fileUrl,
  actionButton,
}: {
  open: boolean
  rewardTier: NftRewardTier
  onClose: VoidFunction
  fileUrl: string | undefined
  actionButton?: JSX.Element
}) {
  const { projectMetadata } = useContext(ProjectMetadataContext)

  if (!open) return null

  const hasLimitedSupply = Boolean(
    rewardTier.remainingSupply &&
      rewardTier.maxSupply &&
      rewardTier.maxSupply !== DEFAULT_NFT_MAX_SUPPLY,
  )

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

  const remainingSupplyText = hasLimitedSupply ? (
    <Trans>
      REMAINING SUPPLY: {rewardTier.remainingSupply}/{rewardTier.maxSupply}
    </Trans>
  ) : (
    <Trans>REMAINING SUPPLY: Unlimited</Trans>
  )

  return (
    <div
      className={`${JUICE_IMG_PREVIEW_CONTAINER_CLASS} cursor-default`}
      onClick={_onClose}
    >
      <div
        className="relative max-w-lg cursor-text select-text pt-24 md:pt-0"
        onClick={e => e.stopPropagation()}
      >
        <CloseOutlined
          className="absolute -top-5 -right-5 cursor-pointer text-2xl text-slate-100"
          onClick={_onClose}
        />
        <div
          className="mb-5 flex w-full cursor-default justify-center"
          onClick={_onClose}
        >
          {nftRender}
        </div>
        <div className="px-7">
          <h1 className="text-2xl text-slate-100">{rewardTier.name}</h1>
          <div className="flex items-center justify-between">
            <span className="uppercase text-slate-100">
              <Trans>{projectMetadata?.name}</Trans>
            </span>
            {actionButton ? actionButton : null}
          </div>

          <p className="mt-2 max-w-prose text-slate-100">
            {rewardTier.description}
          </p>
          <div className="mt-5 flex text-xs text-slate-100">
            {remainingSupplyText}
            {rewardTier.externalLink ? (
              <ExternalLink
                href={rewardTier.externalLink}
                className={twMerge(
                  'flex cursor-pointer items-center text-slate-100',
                  hasLimitedSupply ? 'ml-6' : undefined,
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
    </div>
  )
}
