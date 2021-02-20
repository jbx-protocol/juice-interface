import { FormInstance, Space, Statistic } from 'antd'
import React from 'react'

import { TicketsFormFields } from '../../models/forms-fields/tickets-form'
import { Step } from '../../models/step'
import TicketsForm from '../forms/TicketsForm'

export function ticketsStep({
  form,
  initializedTickets,
  ticketsName,
  ticketsSymbol,
}: {
  form: FormInstance<TicketsFormFields>
  initializedTickets?: boolean
  ticketsName?: string
  ticketsSymbol?: string
}): Step {
  return {
    title: 'Tickets (optional)',
    content: initializedTickets ? (
      <div>
        <h2>Tickets already initialized.</h2>
        <Space direction="vertical" size="large">
          <Statistic
            title="Name"
            value={
              initializedTickets ? ticketsName : form.getFieldValue('name')
            }
          />
          <Statistic
            title="Symbol"
            value={
              initializedTickets
                ? ticketsSymbol
                : 't' + form.getFieldValue('symbol')
            }
          />
        </Space>
      </div>
    ) : (
      <TicketsForm props={{ form }} header="Create your ERC-20 ticket token" />
    ),
    info: [
      'Your contract will use these ERC-20 tokens like tickets, handing them out to people as a receipt for payments received.',
      "Tickets can be redeemed for your contract's overflow on a bonding curve – a ticket is redeemable for 38.2% of its proportional overflowed tokens. Meaning, if there are 100 overflow tokens available and 100 of your tickets in circulation, 10 tickets could be redeemed for 3.82 of the overflow tokens. The rest is left to share between the remaining ticket hodlers.",
      '---',
      "You can propose reconfigurations to your contract's specs at any time. Your ticket holders will have 3 days to vote yay or nay. If there are more yays than nays, the new specs will be used once the active budgeting period expires.",
    ],
  }
}
