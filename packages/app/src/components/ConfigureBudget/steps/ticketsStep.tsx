import { Step } from 'models/step'

export const ticketsStep = (): Step => ({
  title: 'Tickets (optional)',
  content: (
    <div></div>
    // <TicketsForm />
  ),
  info: [
    'Your contract will use these ERC-20 tokens like tickets, handing them out to people as a receipt for payments received.',
    "Tickets can be redeemed for your contract's overflow on a bonding curve – a ticket is redeemable for 38.2% of its proportional overflowed tokens. Meaning, if there are 100 overflow tokens available and 100 of your tickets in circulation, 10 tickets could be redeemed for 3.82 of the overflow tokens. The rest is left to share between the remaining ticket hodlers, incentivizing commitment.",
    '---',
    "You can propose reconfigurations to your contract's specs at any time. Your ticket holders will have 7 days to vote yay or nay. If there are 33% more yays than nays (a supermajority), the new specs will be used once the active budgeting time frame expires.",
  ],
})
