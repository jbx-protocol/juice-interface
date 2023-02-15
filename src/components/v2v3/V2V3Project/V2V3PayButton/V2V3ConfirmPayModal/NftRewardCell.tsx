import { Space, Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { JuiceVideoThumbnailOrImage } from 'components/v2v3/shared/NftVideo/JuiceVideoThumbnailOrImage'
import { NftRewardTier } from 'models/nftRewardTier'
import { classNames } from 'utils/classNames'
import { ipfsToHttps } from 'utils/ipfs'

const NFT_DISPLAY_HEIGHT_CLASS = 'h-12' //rem height
const NFT_DISPLAY_WIDTH_CLASS = 'w-12'

export function NftRewardCell({
  nftRewards,
}: {
  nftRewards: NftRewardTier[]
}): JSX.Element {
  const uniqueTiersIdsAndCounts = nftRewards.reduce(
    (acc: Record<number, number>, curr) => {
      acc[curr.id ?? -1] = (acc[curr.id ?? -1] || 0) + 1
      return acc
    },
    {},
  )
  return (
    <Space size={'middle'} direction={'vertical'} className="w-full">
      {Object.keys(uniqueTiersIdsAndCounts).map((tierId, idx) => {
        const tier = nftRewards.find(_tier => _tier.id === parseInt(tierId))
        if (!tier?.id) return
        const tierCount = uniqueTiersIdsAndCounts[tier.id]
        const isLink = tier.externalLink

        return (
          <div className="flex items-center justify-between" key={idx}>
            <div
              className={`flex ${NFT_DISPLAY_HEIGHT_CLASS} items-center justify-start`}
            >
              <Tooltip
                title={tier.description}
                open={tier.description ? undefined : false}
                className={'pt-0'}
              >
                <JuiceVideoThumbnailOrImage
                  src={ipfsToHttps(tier.fileUrl)}
                  alt={tier.name}
                  crossOrigin="anonymous"
                  heightClass={NFT_DISPLAY_HEIGHT_CLASS}
                  widthClass={NFT_DISPLAY_WIDTH_CLASS}
                  playIconPosition="hidden"
                  isSelected
                />
              </Tooltip>
              <ExternalLink
                className={classNames(
                  'ml-3 font-medium text-black dark:text-grey-100',
                  isLink
                    ? 'cursor-pointer text-black hover:text-haze-400 hover:underline dark:text-grey-100 dark:hover:text-haze-400'
                    : 'cursor-default',
                )}
                href={isLink ? tier.externalLink : undefined}
              >
                {tier.name}
              </ExternalLink>
            </div>
            <div>x {tierCount} </div>
          </div>
        )
      })}
    </Space>
  )
}
