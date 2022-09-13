import { Plural, t, Trans } from '@lingui/macro'
import { Descriptions } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { useVeNftSummaryStats } from 'hooks/veNft/VeNftSummaryStats'

import { formattedNum } from 'utils/formatNumber'

import { shadowCard } from 'constants/styles/shadowCard'

interface VeNftSummaryStatsSectionProps {
  tokenSymbolDisplayText: string
}

const VeNftSummaryStatsSection = ({
  tokenSymbolDisplayText,
}: VeNftSummaryStatsSectionProps) => {
  const { theme } = useContext(ThemeContext)
  const { totalLocked, totalLockedPeriod } = useVeNftSummaryStats()
  const totalLockedPeriodInDays = totalLockedPeriod / (60 * 60 * 24)
  const formattedtotalLockedPeriod = formattedNum(totalLockedPeriodInDays, {
    precision: 2,
  })

  return (
    <div style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}>
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
