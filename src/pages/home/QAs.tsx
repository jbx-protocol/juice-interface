import { t, Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import Link from 'next/link'
import { FC, ReactNode } from 'react'
import { helpPagePath } from 'utils/helpPageHelper'

export const OverflowVideoLink: FC = ({ children }) => (
  <ExternalLink href="https://youtu.be/9Mq5oDh0aBY">{children}</ExternalLink>
)

const JB_FEE = 2.5

export const JBDiscordLink = ({ children }: { children: ReactNode }) => (
  <ExternalLink href="https://discord.gg/6jXrJSyDFf">{children}</ExternalLink>
)

// t macro function wasn't working when QAs was in the same file
// as where it was being rendered (FAQs).
// Saw the suggestion to separate the store and render into 2 files here:
// https://github.com/lingui/js-lingui/issues/707#issuecomment-657199843
// Not sure why but this fixed the problem.
// Take-away: If you're storing a list of <Trans>` strings in a list,
// make sure you're not rendering it from the same file.
export default function QAs(): {
  q: JSX.Element
  a?: JSX.Element
  img?: {
    src: string
    alt: string
  }
}[] {
  return [
    {
      q: <Trans>Who funds Juicebox projects?</Trans>,
      a: (
        <Trans>
          <p>
            Users fund your project by paying to use your app or service, or as
            a patron or investor by making a payment directly to your project's
            smart contract (like on this app).
          </p>
          <p>
            For users paying through your app, you should route those funds
            through the Juicebox smart contracts so they receive tokens in
            return.
          </p>
        </Trans>
      ),
    },
    {
      q: <Trans>What does Juicebox cost?</Trans>,
      a: (
        <Trans>
          <p>
            Juicebox is an open protocol on Ethereum that is funded using
            Juicebox itself. You can check out the contractualized budget specs{' '}
            <Link href="/p/juicebox">here</Link>.
          </p>
          <p>
            Projects building on Juicebox pay a {JB_FEE}% JBX membership fee
            from withdrawn funds into the JuiceboxDAO treasury. Projects can
            then use their JBX to participate in the governance of JuiceboxDAO
            and its collective treasury, as well as redeem from its growing{' '}
            <OverflowVideoLink>overflow</OverflowVideoLink>. The fee is also
            subject to change via JBX member votes.
          </p>
        </Trans>
      ),
    },
    {
      q: <Trans>What is overflow?</Trans>,
      a: (
        <Trans>
          <p>
            If you know how much your project needs to earn over some period of
            time to be sustainable, you can set a funding target with that
            amount. If your project earns more than that, the surplus funds are
            locked in an overflow pool. Anyone holding your project's tokens can
            claim a portion of the overflow pool in exchange for redeeming their
            tokens.
          </p>
          <p>
            For more info, check out this{' '}
            <OverflowVideoLink>short video</OverflowVideoLink>.
          </p>
        </Trans>
      ),
    },
    {
      q: <Trans>What are community tokens?</Trans>,
      a: (
        <Trans>
          Each project has its own{' '}
          <ExternalLink href="https://youtu.be/cqZhNzZoMh8">
            tokens
          </ExternalLink>
          . Anyone who contributes funds to a project receives that project's
          tokens in return. Token balances will be tracked by the protocol until
          ERC-20 tokens are optionally issued by the project owner.
        </Trans>
      ),
    },
    {
      q: <Trans>Why should I want to own a project's tokens?</Trans>,
      a: (
        <Trans>
          Tokens can be redeemed for a portion of a project's{' '}
          <OverflowVideoLink>overflow</OverflowVideoLink>, letting you benefit
          from its success. After all, you helped it get there. The token may
          also give you exclusive member-only privledges, and allow you to
          contribute to the governance of the community.
        </Trans>
      ),
    },
    {
      q: <Trans>What's a discount rate?</Trans>,
      a: (
        <Trans>
          Projects can be created with an optional discount rate designed to
          incentivize supporters to contribute earlier rather than later. The
          amount of tokens rewarded per amount paid to your project will
          decrease by the discount rate with each new funding cycle. A higher
          discount rate will incentivize supporters to pay your project earlier
          rather than later.
        </Trans>
      ),
    },
    {
      q: <Trans>What's a bonding curve?</Trans>,
      a: (
        <Trans>
          <p>
            A bonding curve rewards people who wait longer to redeem your tokens
            for overflow.
          </p>
          <p>
            For example, with a bonding curve of 70%, redeeming 10% of the token
            supply at any given time will claim around 7% of the total overflow.
          </p>
          <p>The rest is left to share between token holders.</p>,
          <p>
            For more info, check out this{' '}
            <ExternalLink href="https://youtu.be/dxqc3yMqi5M">
              short video
            </ExternalLink>{' '}
            on bonding curves.
          </p>
        </Trans>
      ),
    },
    {
      q: <Trans>Does a project benefit from its own overflow?</Trans>,
      a: (
        <Trans>
          <p>
            A project can choose to reserve a percentage of tokens for itself.
            Instead of being distributed to paying users, this percentage of
            tokens is instead minted for the project.
          </p>
          <p>
            Holding these tokens entitles a project to a portion of its own
            overflow.
          </p>
        </Trans>
      ),
    },
    {
      q: (
        <Trans>
          Can I change my project's contract after it's been created?
        </Trans>
      ),
      a: (
        <Trans>
          Project owners can configure a delay period, meaning reconfigurations
          to an upcoming funding cycle must be submitted a certain number of
          days before it starts. For example, a 3-day delay period means
          reconfigurations must be submitted at least 3 days before the next
          funding cycle starts. This gives token holders time to react to the
          decision and reduces the chance of rug-pulls.
        </Trans>
      ),
    },
    {
      q: <Trans>Can I delete a project?</Trans>,
      a: (
        <Trans>
          It isn't possible to remove a project's data from the blockchain, but
          we can hide it in the app if you'd like to prevent people from seeing
          or interacting with it — just let us know in{' '}
          <JBDiscordLink>Discord</JBDiscordLink>. Keep in mind people will still
          be able to use your project by interacting directly with the contract.
        </Trans>
      ),
    },
    {
      q: <Trans>Why Ethereum?</Trans>,
      a: (
        <Trans>
          <p>
            A mechanism like Juicebox where upfront financial commitments should
            be honored over time is only guaranteed within an ecosystem like
            Ethereum.
          </p>
          <p>
            Ethereum provides a public environment where internet apps like
            Juicebox can run in a permission-less, trustless, and unstoppable
            fashion.
          </p>
          <p>
            This means that anyone can see the code that they're using, anyone
            can use the code without asking for permission, and no one can mess
            with the code or take it down.
          </p>
          <p>
            People using Juicebox are interacting with each other through public
            infrastructure—not a private, profit-seeking corporate service that
            brokers the exchange.
          </p>
          <p>
            Juicebox was built to allow people and projects to get paid for
            creating public art and infrastructure, as much as or more than they
            would working towards corporate ends. No more shady business.
          </p>
        </Trans>
      ),
    },
    {
      q: <Trans>What's going on under the hood?</Trans>,
      a: (
        <Trans>
          <p>
            This website (juicebox.money) connects to the Juicebox protocol's
            smart contracts, deployed on the Ethereum network. (note: anyone
            else can make a website that also connects to these same smart
            contracts. For now, don't trust any site other than this one to
            access the Juicebox protocol).
          </p>
          <p>
            Creating a Juicebox project mints you an NFT (ERC-721) representing
            ownership over it. Whoever owns this NFT can configure the rules of
            the game and how payouts are distributed.
          </p>
          <p>
            The project's tokens that are minted and distributed as a result of
            a received payment are ERC-20's. The amount of tokens minted and
            distributed are proportional to the volume of payments received,
            weighted by the project's discount rate over time.
          </p>
        </Trans>
      ),
    },
    {
      q: <Trans>How decentralized is Juicebox?</Trans>,
      a: (
        <Trans>
          <p>
            Juicebox is a governance-minimal protocol. There are only a few
            levers that can be tuned, none of which impose changes for users
            without their consent. The Juicebox governance smart contract can
            adjust these levers.
          </p>
          <p>
            The Juicebox protocol is governed by a community of JBX token
            holders who vote on proposals fortnightly.
          </p>
        </Trans>
      ),
    },
    {
      q: <Trans>What are the risks?</Trans>,
      a: (
        <Trans>
          <p>
            Juicebox has handled tens of thousands of ETH through its protocol,
            and has so far had 0 security mishaps.
          </p>{' '}
          <p>
            However, Juicebox is still experimental software. Although the
            Juicebox contract team have done their part to shape the smart
            contracts for public use and have tested the code thoroughly, the
            risk of exploits is never 0%.
          </p>
          <p>
            Due to their public nature, any exploits to the contracts may have
            irreversible consequences, including loss of funds. Please use
            Juicebox with caution.
          </p>
          <p>
            <ExternalLink href={helpPagePath('/dev/learn/risks')}>
              Learn more
            </ExternalLink>{' '}
            about the risks.
          </p>
        </Trans>
      ),
    },
    {
      q: <Trans>How have the contracts been tested?</Trans>,
      a: (
        <Trans>
          <p>
            There are unit tests written for every condition of every function
            in the contracts, and integration tests for every workflow that the
            protocol supports.
          </p>
          <p>
            There was also a script written to iteratively run the integration
            tests using a random input generator, prioritizing edge cases. The
            code has successfully passed over 1 million test cases through this
            stress-testing script.
          </p>{' '}
          <p>
            The code could always use more eyes and more critique to further the
            community's confidence. Join our{' '}
            <JBDiscordLink>Discord</JBDiscordLink> and check out the code on{' '}
            <ExternalLink href="https://github.com/jbx-protocol">
              GitHub
            </ExternalLink>{' '}
            to work with us.
          </p>
        </Trans>
      ),
    },
    {
      q: <Trans>Has Juicebox been audited?</Trans>,
      a: (
        <Trans>
          <p>
            The Juicebox V2 smart contracts have had multiple security audits.{' '}
            <ExternalLink href={helpPagePath('dev/resources/security')}>
              Read the audit reports.
            </ExternalLink>
          </p>
          <p>
            While Juicebox has been audited, it is still experimental software,
            and there are risks. Please use Juicebox with caution.
          </p>
          <p>
            <ExternalLink href={helpPagePath('/dev/learn/risks')}>
              Learn more
            </ExternalLink>{' '}
            about the risks.
          </p>
        </Trans>
      ),
    },
    {
      q: <Trans>Will it work on L2s?</Trans>,
      a: (
        <Trans>
          <p>
            That's the plan, but the core Juicebox contracts will first be
            deployed to Ethereum Mainnet.
          </p>
          <p>
            The contract team will soon start working on L2 payment terminals
            for Juicebox projects.
          </p>
        </Trans>
      ),
    },
    {
      q: (
        <Trans>
          Do I have to make my project open source to use Juicebox as its
          business model?
        </Trans>
      ),
      img: {
        src: '/assets/cooler_if_you_did.png',
        alt: t`It'd be a lot cooler if you did`,
      },
    },
    {
      q: <Trans>Who is Peel?</Trans>,
      a: (
        <Trans>
          <Link href="/p/peel" target="_blank">
            Peel
          </Link>{' '}
          is the DAO that manages the juicebox.money frontend interface. You can
          reach out to Peel either through the{' '}
          <ExternalLink href="https://discord.gg/XvmfY4Hkcz">
            Peel Discord
          </ExternalLink>{' '}
          or the <JBDiscordLink>Juicebox Discord</JBDiscordLink>.
        </Trans>
      ),
    },
    {
      q: <Trans>How do I create a project?</Trans>,
      a: (
        <Trans>
          If you're interested in creating a project but still confused on how
          to get started, consider watching this{' '}
          <ExternalLink href="https://youtu.be/R43XqPriS5M">
            instructional video
          </ExternalLink>
          . Also feel free to reach out in the{' '}
          <JBDiscordLink>Juicebox Discord</JBDiscordLink> where our team will be
          happy to help bring your project idea to life!
        </Trans>
      ),
    },
  ]
}
