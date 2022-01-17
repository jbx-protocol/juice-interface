import { t } from '@lingui/macro'

// t macro function wasn't working when QAs was in the same file
// as where it was being rendered (FAQs).
// Saw the suggestion to separate the store and render into 2 files here:
// https://github.com/lingui/js-lingui/issues/707#issuecomment-657199843
// Not sure why but this fixed the problem.
// Take-away: If you're storing a list of t`` strings in a list,
// make sure you're not rendering it from the same file.
export default function QAs() {
  return [
    {
      q: t`Who funds Juicebox projects?`,
      a: [
        t`Users fund your project by paying to use your app or service, or as a patron or investor by making a payment directly to your project's smart contract (like on this app).`,
        t`For users paying through your app, you should route those funds through the Juicebox smart contracts so they receive Tokens in return.`,
      ],
    },
    {
      q: t`What does Juicebox cost?`,
      a: [
        t`Juicebox is an open protocol on Ethereum that is funded using Juicebox itself. You can check out the contractualized budget specs at https://juicebox.money/#/p/juicebox.`,
        t`5% of all money made by projects is sent to help pay for the maintenance and development of Juicebox itself. In exchange, projects get Juicebox tokens ($JBX), which will be worth more as the ecosystem grows over time.`,
      ],
    },
    {
      q: t`What is overflow?`,
      a: [
        t`If you know how much your project needs to earn over some period of time to be sustainable, you can set a funding target with that amount. If your project earns more than that, the surplus funds are locked in an overflow pool. Anyone holding your project's tokens can claim a portion of the overflow pool in exchange for burning their tokens.`,
      ],
    },
    {
      q: t`What are community tokens?`,
      a: [
        t`Each project has its own tokens. Everyone who funds a project gets a newly minted supply of tokens in return. Token balances will be tracked by the protocol until ERC-20 tokens are issued by the project owner`,
      ],
    },
    {
      q: t`Why should I want to own a project's tokens?`,
      a: [
        t`Tokens can be redeemed for a portion of a project's overflow, letting you benefit from its success. After all, you helped it get there.`,
      ],
    },
    {
      q: t`What's a discount rate?`,
      a: [
        t`Projects can be created with an optional discount rate to incentivize funding it earlier than later. The amount of tokens rewarded per amount paid to your project will decrease by the discount rate with each new funding cycle. A higher discount rate will incentivize supporters to pay your project earlier than later.`,
      ],
    },
    {
      q: t`What's a bonding curve?`,
      a: [
        t`A bonding curve rewards people who wait longer to redeem your tokens for overflow.`,
        t`For example, with a bonding curve of 70%, redeeming 10% of the token supply at any given time will claim around 7% of the total overflow.`,
        t`The rest is left to share between token hodlers.`,
      ],
    },
    {
      q: t`Does a project benefit from its own overflow?`,
      a: [
        t`A project can choose to reserve a percentage of tokens for itself. Instead of being distributed to paying users, this percentage of tokens is instead minted for the project.`,
        t`Holding these tokens entitles a project to a portion of its own overflow.`,
      ],
    },
    {
      q: t`Can I change my project's contract after it's been created?`,
      a: [
        t`A project owner can propose changes to any part of the contract at any time, with changes taking effect after the current budgeting time frame has ended.`,
        t`For now, a minimum of 14 days must pass from the time of a proposed reconfiguration for it to take effect. This gives token holders time to react to the decision.`,
        t`Anyone can deploy and use another governance smart contract to override this scheme.`,
      ],
    },
    {
      q: t`Can I delete a project?`,
      a: [
        t`It isn't possible to remove a project's data from the blockchain, but we can hide it in the app if you'd like to prevent people from seeing or interacting with it—just let us know in Discord. Keep in mind people will still be able to use your project by interacting directly with the contract.`,
      ],
    },
    {
      q: t`Why Ethereum?`,
      a: [
        t`A mechanism like Juicebox where upfront financial commitments should be honored over time is only guaranteed within an ecosystem like Ethereum.`,
        t`Ethereum provides a public environment where internet apps like Juicebox can run permissionlessly, trustlessly, and unstoppably.`,
        t`This means that anyone can see the code that they're using, anyone can use the code without asking for permission, and no one can mess with the code or take it down.`,
        t`People using Juicebox are interacting with each other through public infrastructure—not a private, profit-seeking corporate service that brokers the exchange.`,
        t`Juicebox was built to allow people and projects to get paid for creating public art and infrastructure, as much as or more than they would working towards corporate ends. No more shady business.`,
      ],
    },
    {
      q: t`What's going on under the hood?`,
      a: [
        t`This website (juicebox.money) connects to the Juicebox protocol's smart contracts, deployed on the Ethereum network. (note: anyone else can make a website that also connects to these same smart contracts. For now, don't trust any site other than this one to access the Juicebox protocol.)`,
        t`Creating a Juicebox project mints you an NFT (ERC-721) representing ownership over it. Whoever owns this NFT can configure the rules of the game and how payouts are distributed.`,
        t`The project's tokens that are minted and distributed as a result of a received payment are ERC-20's. The distribution schedule is proportional to payments recieved, weighted by the project's discount rate over time.`,
      ],
    },
    {
      q: t`How decentralized is Juicebox?`,
      a: [
        t`Juicebox is a governance-minimal protocol. There are only a few levers that can be tuned, none of which impose changes for users without their consent. The Juicebox governance smart contract can adjust these levers.`,
        t`At the start, power over the governance smart contract is held by Juicebox's founding contributors. The intent is to soon transfer the power to a community of token holders.`,
      ],
    },
    {
      q: t`What are the risks?`,
      a: [
        t`Juicebox is experimental software. Although the founding contributors have done their part to shape the smart contracts for public use and have run the code through tons of tests, there still may be bugs.`,
        t`Due to their public nature, any exploits to the contracts may have irreversable consequences, including loss of funds. Please use Juicebox with caution.`,
      ],
    },
    {
      q: t`How have the contracts been tested?`,
      a: [
        t`There are unit tests written for every condition of every function in the contracts, and integration tests for every workflow that the protocol supports.`,
        t`There was also a script written for iteratively running the integration tests using a random input generator, prioritizing edge cases. The code has successfully passed over 1 millions test cases through this stress-testing script.`,
        t`The code could always use more eyes and more critique to further the community's confidence. Join our Discord and peek the code on Github to work with us.`,
      ],
    },
    {
      q: t`Will it work on L2s?`,
      a: [
        t`That's the plan, but the core Juicebox contracts will first be deployed to Ethereum Mainnet.`,
        t`The founding contributors will then be working on L2 payment terminals for Juicebox projects.`,
      ],
    },
    {
      q: t`Do I have to make my project open source to use Juicebox as its business model?`,
      img: {
        src: '/assets/cooler_if_you_did.png',
        alt: t`It'd be a lot cooler if you did`,
      },
    },
  ]
}
