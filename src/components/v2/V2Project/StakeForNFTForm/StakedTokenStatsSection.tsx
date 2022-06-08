import { Plural } from '@lingui/macro'
import { Card, Col, Row } from 'antd'
import { useNFTGetSummaryStats } from 'hooks/v2/nft/NFTGetSummaryStats'
import { formattedNum } from 'utils/formatNumber'

export interface StakedTokenStatsSectionProps {
  tokenSymbol: string
}

export default function StakedTokenStatsSection({
  tokenSymbol,
}: StakedTokenStatsSectionProps) {
  const { totalStaked, totalStakedPeriod } = useNFTGetSummaryStats()
  const totalStakedPeriodInDays = totalStakedPeriod / (60 * 60 * 24)

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
