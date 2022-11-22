import { Space, Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'

import { NftRewardTier } from 'models/nftRewardTier'
import { NftRewardImagePreview } from './NftRewardImagePreview'

export function NftRewardCell({
  nftRewards,
}: {
  nftRewards: NftRewardTier[]
}): JSX.Element {
  return (
    <Space size={'middle'} direction={'vertical'} style={{ width: '100%' }}>
      {nftRewards.map((tier: NftRewardTier, idx) => {
        const isLink = tier.externalLink

        const className = `text-primary ${
          isLink
            ? 'hover-text-action-primary hover-text-decoration-underline'
            : 'hover-color-unset'
        }`

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <ExternalLink
              style={{
                fontWeight: 500,
                cursor: isLink ? 'pointer' : 'default',
              }}
              className={className}
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
