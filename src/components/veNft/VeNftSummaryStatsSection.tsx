import { Plural, t, Trans } from '@lingui/macro'
import { Descriptions } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { useVeNftSummaryStats } from 'hooks/veNft/VeNftSummaryStats'
import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'

import { formattedNum } from 'utils/formatNumber'

import { shadowCard } from 'constants/styles/shadowCard'

interface VeNftSummaryStatsSectionProps {
  tokenSymbolDisplayText: string
  userTokens: VeNftToken[] | undefined
}

const VeNftSummaryStatsSection = ({
  tokenSymbolDisplayText,
  userTokens,
}: VeNftSummaryStatsSectionProps) => {
  const { theme } = useContext(ThemeContext)
  const { totalLocked, totalLockedPeriod } = useVeNftSummaryStats(userTokens)
  const totalLockedPeriodInDays = totalLockedPeriod / (60 * 60 * 24)
  const formattedtotalLockedPeriod = formattedNum(totalLockedPeriodInDays, {
    precision: 2,
  })

  return (
    <div style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}>
      <Descriptions
        title={
          <h3>
            <Trans>Staking Summary:</Trans>
          </h3>
        }
        column={1}
      >
        <Descriptions.Item label={t`Total staked ${tokenSymbolDisplayText}`}>
          {totalLocked}
        </Descriptions.Item>
        <Descriptions.Item label={t`Total staked period`}>
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
