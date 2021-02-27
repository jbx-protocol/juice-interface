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
      `For users paying through your app, you should route those funds through Juice to ensure they receive tickets in exchange. *Link: Using Juice composibly.*`,
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
    q: `Why should I invest in a project's tickets?`,
    a: [
      `Tickets can be redeemed for a portion of a project's overflow. If the amount of overflow a project has increases over time, the value of its tickets will also go up.`,
    ],
  },
  {
    q: 'What is a discount rate?',
    a: [
      `Juice projects are created with an optional discount rate that allows tickets to be earned and redeemed on a bonding curve. This helps incentivize investors to fund projects earlier, and hodl tickets longer.`,
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
    q: `Does eliminating profits remove incentive for project creators to innovate?`,
    a: [
      `If a maintainer team neglects a project or moves it in a direction that doesn’t work for the market, it could be forked by the community or simply given up by its users. Either of these would compromise paychecks for the project.`,
    ],
  },
  {
    q: `Can’t I still rake in unlimited profit if I set my budget target to a bajillion?`,
    a: [
      `Sure. Although if the market prefers to support projects with more realistic budgets, there’s a good chance yours will be forked or outcompeted.`,
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
