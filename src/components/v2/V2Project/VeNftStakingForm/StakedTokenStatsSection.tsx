import { Plural, t, Trans } from '@lingui/macro'
import { Col, Row } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useNFTGetSummaryStats } from 'hooks/veNft/VeNftGetSummaryStats'
import { useContext } from 'react'
import { formattedNum } from 'utils/formatNumber'

import { VeNftToken } from 'models/subgraph-entities/veNft/venft-token'

import { shadowCard } from 'constants/styles/shadowCard'

export interface StakedTokenStatsSectionProps {
  tokenSymbol: string
  userTokens: VeNftToken[]
}

export default function StakedTokenStatsSection({
  tokenSymbol,
  userTokens,
}: StakedTokenStatsSectionProps) {
  const { totalStaked, totalStakedPeriod } = useNFTGetSummaryStats(userTokens)
  const totalStakedPeriodInDays = totalStakedPeriod / (60 * 60 * 24)

  const { theme } = useContext(ThemeContext)
  return (
    <div style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}>
      <h3>Staking Summary:</h3>
      <Row>
        <Col span={8}>
          <p>
            <Trans>Total staked ${tokenSymbol}:</Trans>
          </p>
          <p>
            <Trans>Total staked period:</Trans>
          </p>
        </Col>
        <Col span={16}>
          <p>
            {formattedNum(totalStaked)} ${tokenSymbol}
          </p>
          <p>
            {` ${totalStakedPeriodInDays} `}
            <Plural
              value={totalStakedPeriodInDays}
              one={t`day`}
              other={t`days`}
            />{' '}
          </p>
        </Col>
        <br />
      </Row>
    </div>
  )
}
