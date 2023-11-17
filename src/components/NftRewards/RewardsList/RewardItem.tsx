import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import ExternalLink from 'components/ExternalLink'
import { JuiceVideoThumbnailOrImage } from 'components/JuiceVideo/JuiceVideoThumbnailOrImage'
import TooltipLabel from 'components/TooltipLabel'
import round from 'lodash/round'
import { NftRewardTier } from 'models/nftRewards'
import { ReactNode } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { isZeroAddress } from 'utils/address'
import { hasLimitedSupply } from 'utils/nftRewards'
import { prettyUrl } from 'utils/url'
import { V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { RewardItemButton } from './RewardItemButton'

const SIGNIFICANT_FIGURE_LIMIT = 6

function numberUpToPrecisionFormat(
  num: number,
  precision = SIGNIFICANT_FIGURE_LIMIT,
) {
  const roundedNum = round(num, precision)
  const parts = roundedNum.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const RewardItem = ({
  reward,
  onEditClicked,
  onDeleteClicked,
}: {
  reward: NftRewardTier
  onEditClicked?: () => void
  onDeleteClicked?: () => void
}) => {
  const {
    name,
    contributionFloor,
    votingWeight,
    beneficiary,
    reservedRate,
    description,
    maxSupply,
    externalLink,
    fileUrl,
  } = reward

  const { nftRewards } = useAppSelector(state => state.editingV2Project)
  const nftCurrency = nftRewards?.pricing.currency

  const hasBeneficiary = Boolean(beneficiary) && !isZeroAddress(beneficiary)

  return (
    <div className="flex flex-col gap-4">
      {/* Title line */}
      <div className="flex items-center justify-between">
        <div className="w-4/5 overflow-hidden text-ellipsis text-lg font-medium">
          {name}
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
          <JuiceVideoThumbnailOrImage
            className="h-44 w-44"
            src={fileUrl.toString() ?? '/assets/banana-od.webp'}
            alt={name}
            showPreviewOnClick
          />

          {externalLink && (
            <div className="flex max-w-[11rem] items-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-xs font-normal">
              <LinkOutlined />
              <div className="overflow-hidden overflow-ellipsis">
                <ExternalLink href={externalLink}>
                  {prettyUrl(externalLink)}
                </ExternalLink>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {description && <Description description={description} />}

          <div className="grid grid-cols-2 gap-y-6 gap-x-16">
            <RewardStatLine
              title={t`Minimum contribution`}
              stat={`${numberUpToPrecisionFormat(contributionFloor)} ${
                nftCurrency === V2V3_CURRENCY_USD ? 'USD' : 'ETH'
              }`}
            />
            {hasLimitedSupply(maxSupply) && (
              <RewardStatLine
                title={t`Supply`}
                stat={numberUpToPrecisionFormat(maxSupply as number)}
              />
            )}
            {!!reservedRate && (
              <RewardStatLine
                title={t`Reserved NFTs`}
                stat={`1/${reservedRate}`}
              />
            )}
            {hasBeneficiary && (
              <RewardStatLine
                title={
                  <TooltipLabel
                    label={<Trans>Beneficiary address</Trans>}
                    tip={t`The wallet address that reserved NFTs will be sent to`}
                  />
                }
                stat={<EthereumAddress address={beneficiary} />}
              />
            )}
            {!!votingWeight && (
              <RewardStatLine title={t`Voting weight`} stat={votingWeight} />
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
      <div className="max-h-20 overflow-y-scroll text-ellipsis text-sm font-normal">
        {description}
      </div>
    </div>
  )
}
