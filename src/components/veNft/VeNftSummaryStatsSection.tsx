import { Trans } from '@lingui/macro'
import { Row, Col } from 'antd'

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
      <h3>Staking Summary:</h3>
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
        <br />
      </Row>
    </div>
  )
}

export default VeNftSummaryStatsSection
