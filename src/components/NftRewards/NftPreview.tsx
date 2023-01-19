import { CloseOutlined, LinkOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { DEFAULT_NFT_MAX_SUPPLY } from 'hooks/NftRewards'
import { NftRewardTier } from 'models/nftRewardTier'
import { useContext } from 'react'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { classNames } from 'utils/classNames'
import { JUICE_IMG_PREVIEW_CONTAINER_CLASS } from 'components/Create/components/JuiceImgPreview'

export function NftPreview({
  open,
  rewardTier,
  onClose,
  imageUrl,
}: {
  open: boolean
  rewardTier: NftRewardTier
  onClose: VoidFunction
  imageUrl: string | undefined
}) {
  const { projectMetadata } = useContext(ProjectMetadataContext)

  if (!open) return null

  const hasLimitedSupply = Boolean(
    rewardTier.remainingSupply &&
      rewardTier.maxSupply &&
      rewardTier.maxSupply !== DEFAULT_NFT_MAX_SUPPLY,
  )

  return (
    <div className={JUICE_IMG_PREVIEW_CONTAINER_CLASS} onClick={onClose}>
      <div className="md:w-xl w-[90vw]" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex w-full items-center justify-between">
          <h3 className="mb-0 uppercase text-slate-100">
            <Trans>{projectMetadata?.name}</Trans>
          </h3>
          <CloseOutlined className="pl-4 text-slate-100" onClick={onClose} />
        </div>
        <div className="flex justify-center" onClick={onClose}>
          <img
            className={'max-h-[50vh] max-w-[90vw] md:max-h-[60vh] md:max-w-xl'}
            alt={rewardTier.name}
            src={imageUrl}
            onClick={e => e.stopPropagation()}
            crossOrigin="anonymous"
          />
        </div>
        <h3 className="mb-0 mt-5 text-slate-100">{rewardTier.name}</h3>
        <p className="mt-2 text-slate-100">{rewardTier.description}</p>
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
