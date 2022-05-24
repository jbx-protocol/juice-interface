import { Plural } from '@lingui/macro'
import { Col, Row, Space } from 'antd'
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
  initialLocked,
  totalStaked,
  userTokenBalance,
  userTotalLocked,
  totalStakedPeriodInDays,
  delegates,
}: StakedTokenStatsSectionProps) {
  return (
    <Row>
      <Col span={8}>
        <p>Initial locked:</p>
        <p>Total ${tokenSymbol} staked:</p>
        <p>${tokenSymbol} balance:</p>
        <p>My ${tokenSymbol} locked:v</p>
        <p>Total staked period:</p>
        <Plural value={delegates.length} one="Delegate: " other="Delegates: " />
      </Col>
      <Col span={16}>
        <p>
          {formattedNum(initialLocked, {
            precision: 2,
            decimals: 2,
          })}
        </p>
        <p>{formattedNum(totalStaked)}</p>
        <p>{formattedNum(userTokenBalance)}</p>
        <p>{formattedNum(userTotalLocked)}</p>
        <p>
          {` ${totalStakedPeriodInDays} `}
          <Plural value={totalStakedPeriodInDays} one="day" other="days" />{' '}
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
  )
}
