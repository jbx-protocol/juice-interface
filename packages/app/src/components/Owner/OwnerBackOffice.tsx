import { Button, Col, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import TicketsForm, { TicketsFormFields } from 'components/forms/TicketsForm'
import { UserContext } from 'contexts/userContext'
import { useContext, useState } from 'react'
import { addressExists } from 'utils/addressExists'

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
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<TicketsFormFields>()

  async function issueTickets() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!(await form.validateFields())) return

    setLoading(true)

    const fields = form.getFieldsValue(true)

    transactor(contracts.TicketStore, 'issue', [fields.name, fields.symbol], {
      onDone: () => setLoading(false),
    })
  }

  const gutter = 30

  return (
    <div>
      {!addressExists(ticketAddress) && isOwner ? (
        <Row style={{ marginBottom: 30 }} gutter={gutter}>
          <Col span={12}>
            <CardSection header="Tickets">
              <div style={{ padding: 20 }}>
                <TicketsForm form={form} />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button
                    htmlType="submit"
                    type="primary"
                    onClick={issueTickets}
                    loading={loading}
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
