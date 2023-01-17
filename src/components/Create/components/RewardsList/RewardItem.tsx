import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import FormattedAddress from 'components/FormattedAddress'
import TooltipLabel from 'components/TooltipLabel'
import { ReactNode } from 'react'
import { prettyUrl } from 'utils/url'
import { RewardImage } from '../RewardImage'
import { RewardItemButton } from './RewardItemButton'
import { Reward } from './types'

const SIGNIFICANT_FIGURE_LIMIT = 6

function numberUpToPrecisionFormat(
  num: number,
  precision = SIGNIFICANT_FIGURE_LIMIT,
) {
  let formattedNum = num.toPrecision(precision)
  const trailingZeroes = /\.0+$/
  if (trailingZeroes.test(formattedNum)) {
    const decimalIndex = formattedNum.indexOf('.')
    formattedNum = formattedNum.slice(0, decimalIndex)
  }

  const parts = formattedNum.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const RewardItem = ({
  reward,
  onEditClicked,
  onDeleteClicked,
}: {
  reward: Reward
  onEditClicked?: () => void
  onDeleteClicked?: () => void
}) => {
  const {
    title,
    minimumContribution,
    votingWeight,
    beneficiary,
    reservedRate,
    description,
    maximumSupply,
    url,
    imgUrl,
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

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex flex-col gap-3">
          <RewardImage className="h-44 w-44" src={imgUrl.toString()} />
          {url && (
            <div className="flex max-w-[11rem] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-xs font-normal">
              <LinkOutlined />
              <div className="overflow-hidden overflow-ellipsis">
                <ExternalLink href={url}>{prettyUrl(url)}</ExternalLink>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {description && <Description description={description} />}

          <div className="grid grid-cols-2 gap-y-6 gap-x-16">
            <RewardStatLine
              title={t`Minimum contribution`}
              stat={`${numberUpToPrecisionFormat(minimumContribution)} ETH`}
            />
            {!!maximumSupply && (
              <RewardStatLine
                title={t`Supply`}
                stat={numberUpToPrecisionFormat(maximumSupply)}
              />
            )}
            {!!reservedRate && (
              <RewardStatLine
                title={t`Reserved NFTS`}
                stat={`1/${reservedRate}`}
              />
            )}
            {!!beneficiary && (
              <RewardStatLine
                title={
                  <TooltipLabel
                    label={<Trans>Beneficiary address</Trans>}
                    tip={t`The wallet address that reserved NFTs will be sent to`}
                  />
                }
                stat={<FormattedAddress address={beneficiary} />}
              />
            )}
            {!!votingWeight && (
              <RewardStatLine
                title={t`Voting weight`}
                stat={numberUpToPrecisionFormat(votingWeight)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Contains the formatting for NFT Reward stat
const RewardStatLine = ({
  title,
  stat,
}: {
  title: ReactNode
  stat: ReactNode
}) => (
  <div>
    <div className="whitespace-nowrap text-xs font-normal uppercase text-grey-600 dark:text-slate-200">
      {title}
    </div>
    <div className="text-base font-medium">{stat}</div>
  </div>
)

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
