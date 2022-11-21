import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import useMobile from 'hooks/Mobile'
import { ReactNode } from 'react'
import { classNames } from 'utils/classNames'
import { prettyUrl } from 'utils/url'
import { RewardImage } from '../RewardImage'
import { RewardItemButton } from './RewardItemButton'
import { Reward } from './types'

// END: CSS

export const RewardItem = ({
  reward,
  onEditClicked,
  onDeleteClicked,
}: {
  reward: Reward
  onEditClicked?: () => void
  onDeleteClicked?: () => void
}) => {
  const isMobile = useMobile()
  const {
    title,
    minimumContribution,
    description,
    maximumSupply,
    url,
    imgUrl,
  } = reward
  return (
    <div className="flex flex-col gap-4">
      {/* Title line */}
      <div className="flex items-center justify-between">
        <div className="font-medium text-lg">{title}</div>
        <Space size="middle">
          <RewardItemButton onClick={onEditClicked}>
            <EditOutlined />
          </RewardItemButton>
          <RewardItemButton onClick={onDeleteClicked}>
            <DeleteOutlined />
          </RewardItemButton>
        </Space>
      </div>

      <div className="relative flex flex-col gap-6">
        {/* Main Body */}
        <div className="flex gap-8">
          {/* Image Col */}
          <div className="flex flex-col gap-2">
            {/* Image */}
            <RewardImage className="h-44 w-44" src={imgUrl.toString()} />
            {!isMobile && (
              <TertiaryDetails maximumSupply={maximumSupply} url={url} />
            )}
          </div>
          {/* Description Col */}
          <div className="flex flex-col flex-1 gap-8">
            {/* Top */}
            <div
              className={classNames(
                'flex justify-between',
                isMobile ? 'flex-col gap-6' : 'flex-row',
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="text-grey-600 dark:text-slate-200 font-normal uppercase text-xs">
                  <Trans>Minimum Contribution</Trans>
                </div>
                <div className="font-medium text-base">
                  {minimumContribution.toString()} ETH
                </div>
              </div>
            </div>
            {/* Bottom */}
            {!isMobile && description && (
              <Description description={description} />
            )}
          </div>
        </div>
        {isMobile ? (
          <>
            {description && <Description description={description} />}
            <TertiaryDetails maximumSupply={maximumSupply} url={url} />
          </>
        ) : null}
      </div>
    </div>
  )
}

const Description = ({ description }: { description: ReactNode }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-grey-600 dark:text-slate-200 font-normal uppercase text-xs">
        <Trans>Description</Trans>
      </div>
      <div className="font-normal text-sm">{description}</div>
    </div>
  )
}

const TertiaryDetails = ({
  maximumSupply,
  url,
}: {
  maximumSupply: ReactNode
  url: string | undefined
}) => {
  return (
    <div className="flex flex-col gap-1 max-w-[11rem] whitespace-nowrap overflow-hidden overflow-ellipsis">
      {maximumSupply && (
        <div className="font-normal text-xs">
          <Trans>Supply: {maximumSupply}</Trans>
        </div>
      )}
      {url && (
        <div className="font-normal text-xs flex gap-2 items-center">
          <LinkOutlined />
          <div className="overflow-hidden overflow-ellipsis">
            <ExternalLink href={url}>{prettyUrl(url)}</ExternalLink>
          </div>
        </div>
      )}
    </div>
  )
}
