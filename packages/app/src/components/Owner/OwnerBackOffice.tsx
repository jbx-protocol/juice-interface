import { formatBytes32String } from '@ethersproject/strings'
import { Button, Col, Form, Row } from 'antd'
import { UserContext } from 'contexts/userContext'
import { TicketsFormFields } from 'models/forms-fields/tickets-form'
import { useContext, useState } from 'react'
import { addressExists } from 'utils/addressExists'

import TicketsForm from '../forms/TicketsForm'
import { CardSection } from '../shared/CardSection'
import WtfCard from '../shared/WtfCard'

export default function OwnerBackOffice({
  ticketAddress,
  isOwner,
}: {
  ticketAddress?: string
  isOwner?: boolean
}) {
  const { transactor, contracts, onNeedProvider } = useContext(UserContext)

  const [ticketsForm] = Form.useForm<TicketsFormFields>()
  const [loadingInitTickets, setLoadingInitTickets] = useState<boolean>()

  async function initTickets() {
    if (!transactor || !contracts) return onNeedProvider()

    const fields = ticketsForm.getFieldsValue(true)

    setLoadingInitTickets(true)

    transactor(
      contracts.TicketStore,
      'issue',
      [formatBytes32String(fields.name), formatBytes32String(fields.symbol)],
      {
        onDone: () => setLoadingInitTickets(false),
      },
    )
  }

  const gutter = 30

  return (
    <div>
      {!addressExists(ticketAddress) && isOwner ? (
        <Row style={{ marginBottom: 30 }} gutter={gutter}>
          <Col span={12}>
            <CardSection header="Tickets">
              <div style={{ padding: 20 }}>
                <TicketsForm props={{ form: ticketsForm }}></TicketsForm>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button
                    htmlType="submit"
                    type="primary"
                    onClick={initTickets}
                    loading={loadingInitTickets}
                  >
                    Issue tickets
                  </Button>
                </div>
              </div>
            </CardSection>
          </Col>
          <Col span={12}>
            <WtfCard>
              <div>
                {[
                  'Issue your own ERC-20 tickets so that the people who make payments to your project can trade and stake their right to claim your overflow outside of the Juice ecosystem.',
                  'Until you do so, Juice will keep track of I-owe-you tickets internally.',
                  'Juice works perfectly fine either way.',
                ].map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </WtfCard>
          </Col>
        </Row>
      ) : null}
    </div>
  )
}
