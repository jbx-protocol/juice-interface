import { Plural } from '@lingui/macro'
import { Card, Col, Row } from 'antd'
import { formattedNum } from 'utils/formatNumber'

export interface StakedTokenStatsSectionProps {
  tokenSymbol: string
  totalStaked: number
  totalStakedPeriodInDays: number
}

export default function StakedTokenStatsSection({
  tokenSymbol,
  totalStaked,
  totalStakedPeriodInDays,
}: StakedTokenStatsSectionProps) {
  return (
    <Card>
      <Row>
        <Col span={8}>
          <p>Total staked ${tokenSymbol}:</p>
          <p>Total staked period:</p>
        </Col>
        <Col span={16}>
          <p>
            {formattedNum(totalStaked)} ${tokenSymbol}
          </p>
          <p>
            {` ${totalStakedPeriodInDays} `}
            <Plural
              value={totalStakedPeriodInDays}
              one="day"
              other="days"
            />{' '}
            remaining
          </p>
        </Col>
        <br />
      </Row>
    </Card>
  )
}
