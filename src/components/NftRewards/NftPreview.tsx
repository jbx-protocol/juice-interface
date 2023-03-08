import { CloseOutlined, LinkOutlined, LoadingOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { JuiceVideoPreview } from 'components/NftRewards/NftVideo/JuiceVideoPreview'
import { DEFAULT_NFT_MAX_SUPPLY } from 'contexts/NftRewards/NftRewards'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useContentType } from 'hooks/ContentType'
import { NftRewardTier } from 'models/nftRewards'
import { useContext } from 'react'
import { classNames } from 'utils/classNames'
import { fileTypeIsVideo } from 'utils/nftRewards'
import { JUICE_IMG_PREVIEW_CONTAINER_CLASS } from './NftVideo/JuiceVideoOrImgPreview'

export const IMAGE_OR_VIDEO_PREVIEW_CLASSES =
  'max-h-[50vh] max-w-[90vw] md:max-h-[60vh] md:max-w-xl'

export function NftPreview({
  open,
  rewardTier,
  onClose,
  fileUrl,
}: {
  open: boolean
  rewardTier: NftRewardTier
  onClose: VoidFunction
  fileUrl: string | undefined
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

  const nftRender = contentTypeLoading ? (
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
  )

  return (
    <div className={JUICE_IMG_PREVIEW_CONTAINER_CLASS} onClick={onClose}>
      <CloseOutlined
        className="absolute top-10 right-10 text-2xl text-slate-100"
        onClick={onClose}
      />

      <div
        className="max-w-prose pt-24 md:pt-0"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-5 text-center">{nftRender}</div>

        <h1 className="text-slate-100">{rewardTier.name}</h1>
        <span className="uppercase text-slate-100">
          <Trans>{projectMetadata?.name}</Trans>
        </span>

        <p className="mt-2 max-w-prose text-slate-100">
          {rewardTier.description}
        </p>
        {hasLimitedSupply || rewardTier.externalLink ? (
          <div className="mt-5 flex text-xs text-slate-100">
            {hasLimitedSupply ? (
              <div>
                <Trans>
                  REMAINING SUPPLY: {rewardTier.remainingSupply}/
                  {rewardTier.maxSupply}
                </Trans>
              </div>
            ) : null}
            {rewardTier.externalLink ? (
              <ExternalLink
                href={rewardTier.externalLink}
                className={classNames(
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
        ) : null}
      </div>
    </div>
  )
}
