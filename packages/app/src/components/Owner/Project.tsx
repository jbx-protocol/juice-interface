import { Col, Row, Statistic } from 'antd'
import { CardSection } from 'components/shared/CardSection'
import { colors } from 'constants/styles/colors'
import { Budget } from 'models/budget'
import { CSSProperties } from 'react'

import CurrentBudget from './CurrentBudget'
import Rewards from './Rewards'
import { render } from '@testing-library/react'

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
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontSize: '2.4rem',
            margin: 0,
          }}
        >
          {budget?.name}
        </h1>
      </div>
      <Row gutter={60}>
        <Col xs={24} lg={12}>
          <CardSection>
            <CurrentBudget budget={budget} ticketSymbol={ticketSymbol} />
          </CardSection>
        </Col>
        <Col xs={24} lg={12}>
          <Rewards ticketSymbol={ticketSymbol} ticketAddress={ticketAddress} />
          <Statistic
            title="Address"
            valueRender={() => (
              <h3 style={{ color: colors.grape, fontSize: '1rem' }}>
                {budget?.project}
              </h3>
            )}
            style={{ marginTop: 25 }}
          ></Statistic>
        </Col>
      </Row>
    </div>
  )
}
