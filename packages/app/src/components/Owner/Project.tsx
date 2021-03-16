import { Col, Row } from 'antd'
import { CardSection } from 'components/shared/CardSection'
import { colors } from 'constants/styles/colors'
import { Budget } from 'models/budget'
import { CSSProperties } from 'react'

import CurrentBudget from './CurrentBudget'
import Rewards from './Rewards'

export default function Project({
  budget,
  ticketAddress,
  ticketSymbol,
  style,
}: {
  budget: Budget | undefined | null
  ticketAddress: string | undefined
  ticketSymbol: string | undefined
  style?: CSSProperties
}) {
  return (
    <div style={style}>
      <div style={{ marginBottom: 30 }}>
        <h1
          style={{
            fontSize: '2.4rem',
            margin: 0,
          }}
        >
          {budget?.name}
        </h1>
        <h3 style={{ color: colors.grape }}>{budget?.project}</h3>
      </div>
      <Row gutter={60}>
        <Col xs={24} lg={12}>
          <CardSection>
            <CurrentBudget budget={budget} ticketSymbol={ticketSymbol} />
          </CardSection>
        </Col>
        <Col xs={24} lg={12}>
          <Rewards ticketSymbol={ticketSymbol} ticketAddress={ticketAddress} />
        </Col>
      </Row>
    </div>
  )
}
