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
    q: 'Who funds Juicebox projects?',
    a: [
      `Users fund your project by paying to use your app or service, or as a patron or investor by making a payment directly to your project's smart contract (like on this app).`,
      `For users paying through your app, you should route those funds through the Juicebox smart contracts so they receive Tokens in return.`,
    ],
  },
  {
    q: `What does Juicebox cost?`,
    a: [
      `Juicebox is an open protocol on Ethereum that is funded using Juicebox itself. You can check out the contractualized budget specs at ${window.location.href}juicebox.`,
      `5% of all money made by projects is sent to help pay for the maintenance and development of Juicebox itself. In exchange, projects get Juicebox tokens ($JBX), which will be worth more as the ecosystem grows over time.`,
    ],
  },
  {
    q: `What is overflow?`,
    a: [
      `If you know how much your project needs to earn over some period of time to be sustainable, you can set a funding target with that amount. If your project earns more than that, the surplus funds are locked in an overflow pool. Anyone holding your project's tokens can claim a portion of the overflow pool in exchange for burning their tokens.`,
    ],
  },
  {
    q: 'What are community tokens?',
    a: [
      `Each project has its own tokens which can either be staked or withdrawn as ERC-20s. Everyone who funds a project gets a newly minted supply of tokens in return. `,
    ],
  },
  {
    q: `Why should I want to own a project's tokens?`,
    a: [
      `Tokens can be redeemed for a portion of a project's overflow, letting you benefit from its success. After all, you helped it get there.`,
    ],
  },
  {
    q: `What's a discount rate?`,
    a: [
      `Projects can be created with an optional discount rate to incentivize funding it earlier than later. The amount of tokens rewarded per amount paid to your project will decrease by the discount rate with each new funding cycle. A higher discount rate will incentivize supporters to pay your project earlier than later.`,
    ],
  },
  {
    q: `What's a bonding curve?`,
    a: [
      `A bonding curve rewards people who wait longer to redeem your tokens for overflow.`,
      `For example: with a bonding curve of 70%, redeeming 10% of the token supply at any given time will claim around 7% of the total overflow.`,
      `The rest is left to share between token hodlers.`,
    ],
  },
  {
    q: 'Does a project benefit from its own overflow?',
    a: [
      `A project can choose to reserve a percentage of tokens for itself. Instead of being distributed to paying users, this percentage of tokens is instead minted for the project.`,
      `Holding these tokens entitles a project to a portion of its own overflow.`,
    ],
  },
  {
    q: "Can I change my project's contract after it's been created?",
    a: [
      `A project owner can propose changes to any part of the contract at any time, with changes taking effect after the current budgeting time frame has ended.`,
      `For now, a minimum of 14 days must pass from the time of a proposed reconfiguration for it to take effect. This gives token holders time to react to the decision.`,
      `Anyone can deploy and use another governance smart contract to override this scheme.`,
    ],
  },
  {
    q: 'Why Ethereum?',
    a: [
      `A mechanism like Juicebox where upfront financial commitments should be honored over time is only guarenteed within an ecosystem like Ethereum.`,
      `Ethereum provides a public environment where internet apps like Juicebox can run permissionlessly, trustlessly, and unstoppably.`,
      `This means that anyone can see the code that they're using, anyone can use the code without asking for permission, and no one can mess with the code or take it down.`,
      `People using Juicebox are interacting with each other through public infrastructure—not a private, profit-seeking corporate service that brokers the exchange.`,
      `Juicebox was built to allow people and projects to get paid for creating public art and infrastructure, as much as or more than they would working towards corporate ends. No more shady business.`,
    ],
  },
  {
    q: "What's going on under the hood?",
    a: [
      `This website (juicebox.money) connects to the Juicebox protocol's smart contracts, deployed on the Ethereum network. (note: anyone else can make a website that also connects to these same smart contracts. For now, don't trust any site other than this one to access the Juicebox protocol.)`,
      `Creating a Juicebox project mints you an NFT (ERC-721) representing ownership over it. Whoever owns this NFT can configure the rules of the game and how payouts are distributed.`,
      `The project's tokens that are minted and distributed as a result of a received payment are ERC-20's. The distribution schedule is proportional to payments recieved, weighted by a project's discount rate over time.`,
    ],
  },
  {
    q: 'How decentralized is Juicebox?',
    a: [
      `Juicebox is a governance-minimal protocol, meaning there are only a few levers that can be tuned, none of which impose changes for users without their consent. The Juicebox governance smart contract can adjust these levers.`,
      `At the start, power over the governance smart contract is held by Juicebox's founding contributors. The intent is to soon transfer the power to a community of token holders.`,
    ],
  },
  {
    q: 'What are the risks?',
    a: [
      `Juicebox is experimental software. Although the founding contributors have done their part to shape the smart contracts for public use and have run the code through tons of tests, there still may be bugs.`,
      `Due to their public nature, any exploits to the contracts may have irreversable consequences, including loss of funds. Please use Juicebox with caution.`,
    ],
  },
  {
    q: 'How have the contracts been tested?',
    a: [
      `There are unit tests written for every condition of every function in the contracts, and integration tests for every workflow that the protocol supports.`,
      `There was also a script written for iteratively running the integration tests using a random input generator, prioritizing edge cases. The code has successfully passed over 1 millions test cases through this stress-testing script.`,
      `The code could always use more eyes and more critique to further the community's confidence. Join our Discord and peek the code on Github to work with us.`,
    ],
  },
  {
    q: 'Will it work on L2s?',
    a: [
      `That's the plan, but the core Juicebox contracts will first be deployed to Ethereum Mainnet.`,
      `The founding contributors will then be working on L2 payment terminals for Juicebox projects.`,
    ],
  },
  {
    q: `Do I have to make my project open source to use Juicebox as its business model?`,
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
