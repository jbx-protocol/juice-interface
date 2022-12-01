import { Space, Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { NftRewardTier } from 'models/nftRewardTier'
import { NftRewardImagePreview } from './NftRewardImagePreview'
import { classNames } from 'utils/classNames'

export function NftRewardCell({
  nftRewards,
}: {
  nftRewards: NftRewardTier[]
}): JSX.Element {
  return (
    <Space size={'middle'} direction={'vertical'} className="w-full">
      {nftRewards.map((tier: NftRewardTier, idx) => {
        const isLink = tier.externalLink

        return (
          <div className="flex items-center justify-end" key={idx}>
            <ExternalLink
              className={classNames(
                'font-medium text-black dark:text-grey-100',
                isLink
                  ? 'cursor-pointer text-black hover:text-haze-400 hover:underline dark:text-grey-100 dark:hover:text-haze-400'
                  : 'cursor-default',
              )}
              href={isLink ? tier.externalLink : undefined}
            >
              {tier.name}
            </ExternalLink>
            <Tooltip
              title={tier.description}
              open={tier.description ? undefined : false}
            >
              <NftRewardImagePreview rewardTier={tier} />
            </Tooltip>
          </div>
        )
      })}
    </Space>
  )
}
