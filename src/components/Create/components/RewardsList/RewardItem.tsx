import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
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
    fileUrl,
  } = reward
  return (
    <div className="flex flex-col gap-4">
      {/* Title line */}
      <div className="flex items-center justify-between">
        <div className="w-4/5 overflow-hidden text-ellipsis text-lg font-medium">
          {title}
        </div>
        <div className="flex gap-4">
          <RewardItemButton onClick={onEditClicked}>
            <EditOutlined />
          </RewardItemButton>
          <RewardItemButton onClick={onDeleteClicked}>
            <DeleteOutlined />
          </RewardItemButton>
        </div>
      </div>

      <div className="relative flex flex-col gap-6">
        {/* Main Body */}
        <div className="flex gap-8">
          {/* Image Col */}
          <div className="flex flex-col gap-2">
            {/* Image */}
            <RewardImage className="h-44 w-44" src={fileUrl.toString()} />
            {!isMobile && (
              <TertiaryDetails maximumSupply={maximumSupply} url={url} />
            )}
          </div>
          {/* Description Col */}
          <div className="flex flex-1 flex-col gap-8 overflow-hidden">
            {/* Top */}
            <div
              className={classNames(
                'flex justify-between',
                isMobile ? 'flex-col gap-6' : 'flex-row',
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="text-xs font-normal uppercase text-grey-600 dark:text-slate-200">
                  <Trans>Minimum Contribution</Trans>
                </div>
                <div className="text-base font-medium">
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
      <div className="text-xs font-normal uppercase text-grey-600 dark:text-slate-200">
        <Trans>Description</Trans>
      </div>
      <div className="overflow-hidden text-ellipsis text-sm font-normal">
        {description}
      </div>
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
    <div className="flex max-w-[11rem] flex-col gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap">
      {maximumSupply && (
        <div className="text-xs font-normal">
          <Trans>Supply: {maximumSupply}</Trans>
        </div>
      )}
      {url && (
        <div className="flex items-center gap-2 text-xs font-normal">
          <LinkOutlined />
          <div className="overflow-hidden overflow-ellipsis">
            <ExternalLink href={url}>{prettyUrl(url)}</ExternalLink>
          </div>
        </div>
      )}
    </div>
  )
}
