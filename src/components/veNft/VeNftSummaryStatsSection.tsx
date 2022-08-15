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
  const { totalStaked, totalStakedPeriod } = useVeNftSummaryStats(userTokens)
  const totalStakedPeriodInDays = totalStakedPeriod / (60 * 60 * 24)
  const formattedTotalStakedPeriod = formattedNum(totalStakedPeriodInDays, {
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
          {totalStaked}
        </Descriptions.Item>
        <Descriptions.Item label={t`Total staked period`}>
          {`${formattedTotalStakedPeriod} `}
          <Plural
            value={totalStakedPeriodInDays}
            one={t`day`}
            other={t`days`}
          />
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default VeNftSummaryStatsSection
