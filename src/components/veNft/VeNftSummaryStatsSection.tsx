import { Plural, t, Trans } from '@lingui/macro'
import { Descriptions } from 'antd'
import { useVeNftSummaryStats } from 'hooks/veNft/VeNftSummaryStats'
import { formattedNum } from 'utils/format/formatNumber'

interface VeNftSummaryStatsSectionProps {
  tokenSymbolDisplayText: string
}

const VeNftSummaryStatsSection = ({
  tokenSymbolDisplayText,
}: VeNftSummaryStatsSectionProps) => {
  const { totalLocked, totalLockedPeriod } = useVeNftSummaryStats()
  const totalLockedPeriodInDays = totalLockedPeriod / (60 * 60 * 24)
  const formattedtotalLockedPeriod = formattedNum(totalLockedPeriodInDays, {
    precision: 2,
  })

  return (
    <div className="mb-2 rounded-sm bg-smoke-75 stroke-none p-6 shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:shadow-[10px_10px_0px_0px_#2D293A]">
      <Descriptions
        title={
          <h3>
            <Trans>veNFT Summary:</Trans>
          </h3>
        }
        column={1}
      >
        <Descriptions.Item label={t`Total locked ${tokenSymbolDisplayText}`}>
          {totalLocked}
        </Descriptions.Item>
        <Descriptions.Item label={t`Total locked period`}>
          {`${formattedtotalLockedPeriod} `}
          <Plural
            value={totalLockedPeriodInDays}
            one={t`day`}
            other={t`days`}
          />
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default VeNftSummaryStatsSection
