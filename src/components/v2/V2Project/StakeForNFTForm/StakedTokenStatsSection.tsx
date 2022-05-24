import { Plural } from '@lingui/macro'
import { Card, Col, Row, Space } from 'antd'
import FormattedAddress from 'components/shared/FormattedAddress'
import { formattedNum } from 'utils/formatNumber'

export interface StakedTokenStatsSectionProps {
  tokenSymbol: string
  initialLocked: number
  totalStaked: number
  userTokenBalance: number
  userTotalLocked: number
  totalStakedPeriodInDays: number
  delegates: string[]
}

export default function StakedTokenStatsSection({
  tokenSymbol,
  totalStaked,
  totalStakedPeriodInDays,
  delegates,
}: StakedTokenStatsSectionProps) {
  return (
    <Card>
      <Row>
        <Col span={8}>
          <p>Total staked ${tokenSymbol}:</p>
          <p>Total staked period:</p>
          <Plural
            value={delegates.length}
            one="Delegate: "
            other="Delegates: "
          />
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
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            {delegates.map((address: string) => {
              return (
                <FormattedAddress
                  address={address}
                  key={address}
                ></FormattedAddress>
              )
            })}
          </Space>
        </Col>
        <br />
      </Row>
    </Card>
  )
}
