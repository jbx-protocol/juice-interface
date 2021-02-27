import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React from 'react'
import { layouts } from '../constants/styles/layouts'
import { padding } from '../constants/styles/padding'

const QAs: {
  q: string
  a: string[]
}[] = [
  {
    q: 'Who funds Juice projects?',
    a: [
      `Users fund your project by paying to use your app or service, or as an investor by making a payment directly to your project's smart contract (like on juice.work).`,
      `For users paying through your app, you should route those funds through the Juice smart contracts to ensure they receive tickets in exchange. *Link: Using Juice composibly.*`,
    ],
  },
  {
    q: 'What are tickets?',
    a: [
      `Tickets are ERC-20 tokens prefixed with a "j" that are unique to each project. Everyone who funds a project receives tickets in exchange. Once a project is earning more than its target, tickets can be exchanged for a portion of overflow. *Link: Calculating Ticket rewards*. Tickets can also be staked to allow voting on changes to a project contract.`,
      `Creating tickets for your project is optional. Until tickets are created, Juice will use nameless IOU tickets to keep track.`,
    ],
  },
  {
    q: `Why should I want a project's tickets?`,
    a: [
      "Tickets can be redeemed for a portion of a project's overflow.",
      "If you earned a project's tickets at a discounted rate a while ago, the tickets will accumulate value over time as the project's overflow increases",
    ],
  },
  {
    q: 'What is a discount rate?',
    a: [
      'Juice projects are created with an optional discount rate that determines how many tickets are distributed when payments are made to the project.',
      'For example, with a discount rate of 97%, 100 DAI paid to a project today might give you 100 tickets, but 100 DAI during the next budgeting period would only give you 97 tickets.', 
      'This incentivize people to fund projects earlier.',
    ],
  },
  {
    q: 'What is a bonding curve?',
    a: [
      "A bonding curve keeps tickets from being redeemable exploitatively.",
      "Those who wait longer to redeem tickets compared to others will benefit the most from a project's overflow"
    ],
  },
  {
    q: "Can I change my project's contract after it's been created?",
    a: [
      `A project owner can propose changes to any part of the contract at any time, with changes taking effect after the current budget has ended. All proposed changes must be voted on by the project's ticket holders before they are accepted.`,
      `The voting period for contract changes takes place over 7 days, and is decided by a supermajority. Voters must stake tickets to participate, which are then locked until the voting period has ended.`,
    ],
  },
  {
    q: "Can I rename my project's tickets?",
    a: [`Right now, no.`],
  },
  {
    q: "Can a project get some of its own overflow?",
    a: ["Yes. Although tickets are normally distributed when payments are made, a project can also be configured to reserve tickets for iteself as a percent of tickets distributed to users, patrons, and investors.",
    "For example, if a project's reserved tickets rate is 5% and 95 tickets have been distributed to supporters, 5 tickets will be mintable for the project itself.",
    'This gives projects skin-in-the-game of their own overflow alongside their community.'],
  },
  {
    q: `Does Juice remove incentive for project creators to innovate?`,
    a: [
      `If a maintainer team neglects a project or moves it in a direction that doesn’t work for the market, it could be forked by the community or simply given up by its users. Either of these would compromise paychecks for the project.`,
      "On the other hand, projects with a clear drive and sense of direction can propose ambitious budgets with their community's backing that allows them to charge forward, in the name of greater overflow for everyone later."
    ],
  },
  {
    q: `Can’t I still rake in unlimited profit if I set my budget target to a bajillion?`,
    a: [
      `Sure, although open source projects can always be forked. Or if the market prefers to support projects with more realistic budgets, yours might get outcompeted.`,
    ],
  },
]

export default function Faq() {
  return (
    <div
      style={{
        ...layouts.maxWidth,
        maxWidth: 800,
        padding: padding.app,
      }}
    >
      <Collapse defaultActiveKey={QAs.length ? 0 : undefined} accordion>
        {QAs.map((qa, i) => (
          <CollapsePanel header={qa.q} key={i}>
            {qa.a.map(p => (
              <p>{p}</p>
            ))}
          </CollapsePanel>
        ))}
      </Collapse>
    </div>
  )
}
