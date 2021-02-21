import { Button, Col, DescriptionsProps, Form, Row } from 'antd'
import React, { useState } from 'react'
import Web3 from 'web3'

import { CardSection } from '../components/CardSection'
import TicketsForm from '../components/forms/TicketsForm'
import Reserves from '../components/Reserves'
import WtfCard from '../components/WtfCard'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { TicketsFormFields } from '../models/forms-fields/tickets-form'
import { Transactor } from '../models/transactor'
import { addressExists } from '../utils/addressExists'

export default function OwnerBackOffice({
  contracts,
  transactor,
  currentBudget,
  ticketAddress,
  onNeedProvider,
  isOwner,
}: {
  contracts?: Contracts
  transactor?: Transactor
  currentBudget?: Budget
  ticketAddress?: string
  onNeedProvider: () => Promise<void>
  isOwner?: boolean
}) {
  const [ticketsForm] = Form.useForm<TicketsFormFields>()
  const [loadingInitTickets, setLoadingInitTickets] = useState<boolean>()
  const [loadingMint, setLoadingMint] = useState<boolean>()

  const descriptionsStyle: DescriptionsProps = {
    labelStyle: { fontWeight: 600 },
    size: 'middle',
    bordered: true,
  }

  function mint() {
    if (!currentBudget) return

    if (!transactor || !contracts) return onNeedProvider()

    setLoadingMint(true)

    console.log('🧃 Calling Juicer.mintReservedTickets(owner)', {
      owner: currentBudget.owner,
    })

    transactor(
      contracts.Juicer.mintReservedTickets(currentBudget.owner),
      () => setLoadingMint(false),
      true,
    )
  }

  async function initTickets() {
    if (!transactor || !contracts) return onNeedProvider()

    const fields = ticketsForm.getFieldsValue(true)

    setLoadingInitTickets(true)

    const _name = Web3.utils.utf8ToHex(fields.name)
    const _symbol = Web3.utils.utf8ToHex('t' + fields.symbol)

    console.log('🧃 Calling TicketStore.issue(name, symbol)', {
      _name,
      _symbol,
    })

    return transactor(
      contracts.TicketStore.issue(_name, _symbol),
      () => {
        setLoadingInitTickets(false)
      },
      true,
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
                  "Issue your own ERC-20 tickets so that the people who make payments to your project can trade and stake their right to claim your overflow outside of the Juice ecosystem.",
                  "Until you do so, Juice will keep track of I-owe-you tickets internally.",
                  "Juice works perfectly fine either way."
                ].map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </WtfCard>
          </Col>
        </Row>
      ) : null}

      <Row gutter={gutter}>
        <Col span={12}>
          <CardSection header="Reserves">
            <Reserves
              contracts={contracts}
              budget={currentBudget}
              descriptionsStyle={descriptionsStyle}
              ticketAddress={ticketAddress}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: 20,
              }}
            >
              <Button onClick={mint} loading={loadingMint}>
                Mint reserves
              </Button>
            </div>
          </CardSection>
        </Col>

        <Col span={12}>
          <WtfCard>
            <div>
              {[
                "Budgets can reserve a subset of tickets for the project owner, and reserve a specified amount of its overflow as a donation to a provided address.",
                "5% of the amount received by each budget will also be reserved for funding the Juice admin's own budgets, which will give you its tickets in return.",
                "These reserves are all distributable once a budget expires, and will automatically be distributed when a budget is tapped."
              ].map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </WtfCard>
        </Col>
      </Row>
    </div>
  )
}
