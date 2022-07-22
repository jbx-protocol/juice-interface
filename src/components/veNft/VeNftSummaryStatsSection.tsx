import { t, Trans } from '@lingui/macro'
import { Descriptions } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import React, { useContext } from 'react'

import { shadowCard } from 'constants/styles/shadowCard'

interface VeNftSummaryStatsSectionProps {
  tokenSymbolDisplayText: string
}

const VeNftSummaryStatsSection = ({
  tokenSymbolDisplayText,
}: VeNftSummaryStatsSectionProps) => {
  const { theme } = useContext(ThemeContext)

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
          0
        </Descriptions.Item>
        <Descriptions.Item label={t`Total staked period`}>0</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default VeNftSummaryStatsSection
