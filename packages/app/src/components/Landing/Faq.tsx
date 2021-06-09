import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

const QAs: {
  q: string
  a?: string[]
  img?: {
    src: string
    alt: string
  }
}[] = [
  {
    q: 'Who funds Juice projects?',
    a: [
      `Users fund your project by paying to use your app or service, or as a patron or investor by making a payment directly to your project's smart contract (like on juice.work).`,
      `For users paying through your app, you should route those funds through the Juice smart contracts so they receive Tickets in return.`,
    ],
  },
  {
    q: `What does Juice cost?`,
    a: [
      `Juice is an open protocol on Ethereum that makes money using Juice itself. You can check out the contractualized budget specs at http://juice.work/juice.`,
      `5% of all money made by projects using Juice is sent to help pay for Juice itself. In exchange projects get tickets, which represent the opportunity to benefit from the overflow that the ecosystem accumulates over time.`,
    ],
  },
  {
    q: 'What are tickets?',
    a: [
      `Each project has its own tickets which can be represented as ERC-20s. Everyone who funds a project gets a newly minted supply of tickets in return. Once a project is earning more than its target, tickets can be redeemed for a portion of the overflow.`,
    ],
  },
  {
    q: `Why should I want to own a project's Tickets?`,
    a: [
      `Tickets can be redeemed for a portion of a project's overflow, letting you benefit from the project's success. After all, you helped it get there!`,
      `Juice also has built-in mechanisms to reward earlier adopters of your project, as well as giving your ticket hodlers a more-generous portion of your overflow.`,
    ],
  },
  {
    q: `What's a discount rate?`,
    a: [
      `Juice projects can be created with an optional discount rate to incentivize funding the project earlier than later. With each new funding cycle, the discount rate decreases the number of tickets that are minted per payment.`,
      `For example: with a discount rate of 97%, $100 paid to a project today might mint you 100 tickets, but the same amount paid during the next funding cycle would only mint you 97.`,
    ],
  },
  {
    q: `What's a bonding curve?`,
    a: [
      `A bonding curve rewards people who wait longer to redeem your tickets for overflow.`,
      `For example: with a bonding curve of 70%, redeeming 10% of the ticket supply at any given time will claim around 7% of the total overflow.`,
      `The rest is left to share between ticket hodlers.`
    ],
  },
  {
    q: 'Does a project benefit from its own overflow?',
    a: [
      `A project can choose to reserve a percentage of overflow for itself. Instead of being distributed to paying users, this percentage of tickets is instead printed for the project.`,
      `Holding these tickets entitles a project to a portion of its own overflow.`,
    ],
  },
  {
    q: "Can I change my project's contract after it's been created?",
    a: [
      `A project owner can propose changes to any part of the contract at any time, with changes taking effect after the current budgeting time frame has ended.`,
      `For now, a minimum of 14 days must pass from the time of a proposed reconfiguration for it to take effect. This gives Ticket holders time to react to the decision.`,
      `Anyone can deploy and use another governance smart contract to override this scheme.`
    ],
  },
  {
    q: `Do I have to make my project open source in order to use Juice as its business model?`,
    img: {
      src: '/assets/cooler_if_you_did.png',
      alt: "It'd be a lot cooler if you did",
    },
  },
]

export default function Faq() {
  return (
    <Collapse defaultActiveKey={QAs.length ? 0 : undefined} accordion>
      {QAs.map((qa, i) => (
        <CollapsePanel header={qa.q} key={i}>
          {qa.a && qa.a.map((p, j) => <p key={j}>{p}</p>)}
          {qa.img && <img src={qa.img.src} alt={qa.img.alt} />}
        </CollapsePanel>
      ))}
    </Collapse>
  )
}
