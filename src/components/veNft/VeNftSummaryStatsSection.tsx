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
      {/* <h3>
        <Trans>Staking Summary:</Trans>
      </h3>
      <Row>
        <Col span={8}>
          <p>
            <Trans>Total staked ${tokenSymbolDisplayText}:</Trans>
          </p>
          <p>
            <Trans>Total staked period:</Trans>
          </p>
        </Col>
        <Col span={16}>
          <p>0</p>
          <p>0</p>
        </Col>
      </Row> */}
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
