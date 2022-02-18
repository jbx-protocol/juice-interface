import { t, Trans } from '@lingui/macro'

export const OverflowVideoLink = ({ text }: { text: string }) => (
  <a
    href="https://www.youtube.com/watch?v=9Mq5oDh0aBY&ab_channel=JuiceboxDAO"
    rel="noreferrer"
    target="_blank"
  >
    {text}
  </a>
)
const JBDiscordLink = ({ text }: { text: string }) => (
  <a href="https://discord.gg/6jXrJSyDFf" rel="noreferrer" target="_blank">
    {text}
  </a>
)

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
        t`For users paying through your app, you should route those funds through the Juicebox smart contracts so they receive tokens in return.`,
      ],
    },
    {
      q: t`What does Juicebox cost?`,
      a: [
        <Trans>
          Juicebox is an open protocol on Ethereum that is funded using Juicebox
          itself. You can check out the contractualized budget specs{' '}
          <a
            href="https://juicebox.money/#/p/juicebox"
            rel="noreferrer"
            target="_blank"
          >
            {' '}
            here
          </a>
          .
        </Trans>,
        <Trans>
          Projects building on Juicebox pay a 5% JBX membership fee from
          withdrawn funds into the JuiceboxDAO treasury. Projects can then use
          their JBX to participate in the governance of JuiceboxDAO and its
          collective treasury, as well as redeem from its growing{' '}
          <OverflowVideoLink text={t`overflow`} />. The fee is also subject to
          change via JBX member votes.
        </Trans>,
      ],
    },
    {
      q: t`What is overflow?`,
      a: [
        t`If you know how much your project needs to earn over some period of time to be sustainable, you can set a funding target with that amount. 
        If your project earns more than that, the surplus funds are locked in an overflow pool. 
        Anyone holding your project's tokens can claim a portion of the overflow pool in exchange for redeeming their tokens.`,
        <Trans>
          For more info, check out this{' '}
          <OverflowVideoLink text={t`short video`} />.
        </Trans>,
      ],
    },
    {
      q: t`What are community tokens?`,
      a: [
        <Trans>
          Each project has its own{' '}
          <a
            href="https://www.youtube.com/watch?v=cqZhNzZoMh8&ab_channel=SimplyExplained"
            rel="noreferrer"
            target="_blank"
          >
            ERC-20 tokens
          </a>
          . Anyone who contributes funds to a project receives that project's
          tokens in return. Token balances will be tracked by the protocol until
          ERC-20 tokens are optionally issued by the project owner.
        </Trans>,
      ],
    },
    {
      q: t`Why should I want to own a project's tokens?`,
      a: [
        <Trans>
          Tokens can be redeemed for a portion of a project's{' '}
          <OverflowVideoLink text={t`overflow`} />, letting you benefit from its
          success. After all, you helped it get there. The token may also give
          you exclusive member-only privledges, and allow you to contribute to
          the governance of the community.
        </Trans>,
      ],
    },
    {
      q: t`What's a discount rate?`,
      a: [
        t`Projects can be created with an optional discount rate designed to incentivize supporters to contribute earlier rather than later. 
        The amount of tokens rewarded per amount paid to your project will decrease by the discount rate with each new funding cycle. A higher discount rate 
        will incentivize supporters to pay your project earlier rather than later.`,
      ],
    },
    {
      q: t`What's a bonding curve?`,
      a: [
        t`A bonding curve rewards people who wait longer to redeem your tokens for overflow.`,
        t`For example, with a bonding curve of 70%, redeeming 10% of the token supply at any given time will claim around 7% of the total overflow.`,
        t`The rest is left to share between token hodlers.`,
        <Trans>
          For more info, check out this{' '}
          <a
            href="https://www.youtube.com/watch?v=dxqc3yMqi5M&ab_channel=JuiceboxDAO"
            rel="noreferrer"
            target="_blank"
          >
            short video
          </a>{' '}
          on bonding curves.
        </Trans>,
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
        t`Project owners can configure a delay period, meaning reconfigurations to an upcoming funding cycle must be submitted a certain 
        number of days before it starts. For example, a 3-day delay period means reconfigurations must be submitted at least 3 days 
        before the next funding cycle starts. This gives token holders time to react to the decision and reduces the chance of rug-pulls.`,
      ],
    },
    {
      q: t`Can I delete a project?`,
      a: [
        <Trans>
          It isn't possible to remove a project's data from the blockchain, but
          we can hide it in the app if you'd like to prevent people from seeing
          or interacting with it — just let us know in{' '}
          <JBDiscordLink text={`Discord`} />. Keep in mind people will still be
          able to use your project by interacting directly with the contract.
        </Trans>,
      ],
    },
    {
      q: t`Why Ethereum?`,
      a: [
        t`A mechanism like Juicebox where upfront financial commitments should be honored over time is only guaranteed within an ecosystem like Ethereum.`,
        t`Ethereum provides a public environment where internet apps like Juicebox can run in a permission-less, trustless, and unstoppable fashion.`,
        t`This means that anyone can see the code that they're using, anyone can use the code without asking for permission, and no one can mess with the code or take it down.`,
        t`People using Juicebox are interacting with each other through public infrastructure—not a private, profit-seeking corporate service that brokers the exchange.`,
        t`Juicebox was built to allow people and projects to get paid for creating public art and infrastructure, as much as or more than they would working towards corporate ends. No more shady business.`,
      ],
    },
    {
      q: t`What's going on under the hood?`,
      a: [
        t`This website (juicebox.money) connects to the Juicebox protocol's smart contracts, deployed on the Ethereum network. (note: anyone else can make a website that also connects to these same smart contracts. For now, don't trust any site other than this one to access the Juicebox protocol).`,
        t`Creating a Juicebox project mints you an NFT (ERC-721) representing ownership over it. Whoever owns this NFT can configure the rules of the game and how payouts are distributed.`,
        t`The project's tokens that are minted and distributed as a result of a received payment are ERC-20's. The amount of tokens minted and distributed are proportional to the volume of payments received, weighted by the project's discount rate over time.`,
      ],
    },
    {
      q: t`How decentralized is Juicebox?`,
      a: [
        t`Juicebox is a governance-minimal protocol. There are only a few levers that can be tuned, none of which impose changes for users without their consent. The Juicebox governance smart contract can adjust these levers.`,
        t`The Juicebox protocol is governed by a community of JBX token holders who vote on proposals fortnightly.`,
      ],
    },
    {
      q: t`What are the risks?`,
      a: [
        t`Juicebox has handled tens of thousands of ETH through its protocol, and has so far had 0 security mishaps.`,
        t`However, Juicebox is still experimental software. Although the Juicebox contract team have done their part to shape the smart contracts for public use and have tested the code thoroughly, the risk of exploits is never 0%.`,
        t`Due to their public nature, any exploits to the contracts may have irreversible consequences, including loss of funds. Please use Juicebox with caution.`,
      ],
    },
    {
      q: t`How have the contracts been tested?`,
      a: [
        t`There are unit tests written for every condition of every function in the contracts, and integration tests for every workflow that the protocol supports.`,
        t`There was also a script written to iteratively run the integration tests using a random input generator, prioritizing edge cases. The code has successfully passed over 1 million test cases through this stress-testing script.`,
        <Trans>
          The code could always use more eyes and more critique to further the
          community's confidence. Join our <JBDiscordLink text={`Discord`} />{' '}
          and check out the code on{' '}
          <a
            href="https://github.com/jbx-protocol"
            rel="noreferrer"
            target="_blank"
          >
            Github
          </a>{' '}
          to work with us.
        </Trans>,
      ],
    },
    {
      q: t`Will it work on L2s?`,
      a: [
        t`That's the plan, but the core Juicebox contracts will first be deployed to Ethereum Mainnet.`,
        t`The contract team will soon start working on L2 payment terminals for Juicebox projects.`,
      ],
    },
    {
      q: t`Do I have to make my project open source to use Juicebox as its business model?`,
      img: {
        src: '/assets/cooler_if_you_did.png',
        alt: t`It'd be a lot cooler if you did`,
      },
    },
    {
      q: t`Who is Peel?`,
      a: [
        <Trans>
          <a
            href="https://juicebox.money/#/p/peel"
            rel="noreferrer"
            target="_blank"
          >
            Peel
          </a>{' '}
          is the DAO that manages the juicebox.money frontend interface. You can
          reach out to Peel either through the{' '}
          <a
            href="https://discord.gg/XvmfY4Hkcz"
            rel="noreferrer"
            target="_blank"
          >
            Peel Discord
          </a>{' '}
          or <JBDiscordLink text={`Juicebox's Discord`} />.
        </Trans>,
      ],
    },
    {
      q: t`How do I create a project?`,
      a: [
        <Trans>
          If you're interested in creating a project but still confused on how
          to get started, consider watching this{' '}
          <a
            href="https://www.youtube.com/watch?v=R43XqPriS5M&ab_channel=JuiceboxDAO"
            rel="noreferrer"
            target="_blank"
          >
            instructional video
          </a>
          . Also feel free to reach out through our{' '}
          <JBDiscordLink text={`Discord`} /> where our team will be happy to
          help bring your project idea to life!
        </Trans>,
      ],
    },
  ]
}
