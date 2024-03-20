import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import Link from 'next/link'
import { ReactNode } from 'react'
import { helpPagePath } from 'utils/routes'

const JB_FEE = 2.5

const JBDiscordLink = ({ children }: { children: ReactNode }) => (
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
  id: string
  q: JSX.Element
  a?: JSX.Element
}[] {
  return [
    {
      id: 'how-it-works',
      q: <Trans>How do I use this website?</Trans>,
      a: (
        <Trans>
          <p>
            This website interacts with the Ethereum blockchain — to use it,
            you'll need to have a wallet and some ETH (ETH is the main currency
            on Ethereum). You can get a free wallet from{' '}
            <ExternalLink href="https://metamask.io">MetaMask.io</ExternalLink>,
            and buy ETH from within the wallet by using a credit card.
          </p>
        </Trans>
      ),
    },
    {
      id: 'what-is-juicebox',
      q: <Trans>What's Juicebox?</Trans>,
      a: (
        <Trans>
          <p>
            Juicebox is a programmable crypto fundraising platform for web3. It
            helps people fund, operate, and scale their projects transparently
            using Ethereum, which is a type of programmable cryptocurrency.
          </p>
          <p>Juicebox is funded and owned by its community.</p>
        </Trans>
      ),
    },
    {
      id: 'what-is-juicebox-fee',
      q: <Trans>What happens when I pay a project?</Trans>,
      a: (
        <Trans>
          <p>
            When you pay a project, you <i>may</i> receive that project's tokens
            or NFTs (depending on how the project is set up).
          </p>
          <p>
            By default, these tokens represent a partial claim on the project's
            ETH, and they are often used for governance rights, community
            access, or other membership perks.
          </p>
          <p>
            All of this can change from project to project. Read everything
            carefully, and make sure you understand the project's rules before
            you support it. If you need help,{' '}
            <Link href="/contact">contact us</Link>, or stop by the{' '}
            <JBDiscordLink>Juicebox Discord server</JBDiscordLink>.
          </p>
        </Trans>
      ),
    },
    {
      id: 'what-does-juicebox-do',
      q: <Trans>What does Juicebox actually do?</Trans>,
      a: (
        <Trans>
          <p>To summarize:</p>
          <ol className="list-decimal pl-10">
            <li>
              When people pay a project, they receive the project's tokens. Like
              other tokens, these can be used for governance, for token-gated
              websites, and other purposes.
            </li>
            <li>
              Projects can pay out ETH to the wallets or Juicebox projects of
              their choosing. These payouts can be pre-defined, and they can
              also be changed over time.
            </li>
            <li>
              If people are unhappy with the direction a project is headed, they
              can redeem their tokens to claim a share of the ETH held in the
              project.
            </li>
          </ol>
          <p>
            Project creators have powerful controls over each one of these
            mechanics. They can change token issuance rates, redemption rates,
            payouts, and other rules over time, leading to powerful and elegant
            tokenomics. They can also lock their project's rules in place for
            pre-determined amounts of time (called <i>cycles</i>), guaranteeing
            that they can't rugpull the community. Juicebox lets projects take
            control if they need to, but it also lets them give up control to
            build trust.
          </p>
          <p>
            Importantly, Juicebox's crypto fundraising platform is on-chain and
            non-custodial. Project creators actually own their projects, and
            JuiceboxDAO has no way to access a project's ETH or change its
            rules.
          </p>
          <p>
            To learn more, visit{' '}
            <ExternalLink href={helpPagePath('/')}>our docs</ExternalLink>.
          </p>
        </Trans>
      ),
    },
    {
      id: 'how-decentralized-is-juicebox',
      q: <Trans>How decentralized is Juicebox?</Trans>,
      a: (
        <Trans>
          <p>
            Juicebox is a{' '}
            <ExternalLink href={helpPagePath('/dev/learn/administration/')}>
              governance-minimal
            </ExternalLink>{' '}
            protocol. There are only a few levers that can be tuned, none of
            which impose changes for users without their consent. The Juicebox
            governance smart contract can adjust these levers.
          </p>
          <p>
            The Juicebox protocol is governed by a community of JBX token
            holders who vote on proposals fortnightly.
          </p>
          <p>
            Juicebox is on-chain and non-custodial. Project creators actually
            own their projects, and JuiceboxDAO has no way to access project's
            ETH or change their rules.
          </p>
        </Trans>
      ),
    },
    {
      id: 'has-juicebox-been-audited',
      q: <Trans>Has Juicebox been audited? What are the risks?</Trans>,
      a: (
        <Trans>
          <p>
            Juicebox has had{' '}
            <ExternalLink href={helpPagePath('/dev/resources/security/')}>
              multiple security audits
            </ExternalLink>
            , and has handled tens of thousands of ETH through its protocol.
          </p>
          <p>
            However, Juicebox is still experimental software. Although the
            Juicebox contract team have done their part to shape the smart
            contracts for public use and have tested the code thoroughly, the
            risk of exploits is never 0%.
          </p>
          <p>
            Due to their public nature, any exploits to the contracts may have
            irreversible consequences, including loss of ETH. Please use
            Juicebox with caution.
          </p>
          <p>
            <ExternalLink href={helpPagePath('/dev/learn/risks/')}>
              Learn more about the risks.
            </ExternalLink>
          </p>
        </Trans>
      ),
    },
    {
      id: 'what-does-juicebox-cost',
      q: <Trans>What does Juicebox cost?</Trans>,
      a: (
        <Trans>
          <p>
            When Juicebox projects make payouts to external wallets (like
            "vitalik.eth"), they incur a {JB_FEE}% fee, which is paid to{' '}
            <Link href="/@juicebox">JuiceboxDAO</Link>. In exchange, they
            receive JuiceboxDAO's project tokens, allowing them to govern the
            protocol. They can also redeem these tokens to reclaim some of the
            fees.
          </p>
          <p>
            <b>Payouts to other Juicebox projects don't incur any fees.</b>
          </p>
          <p>
            <ExternalLink href={helpPagePath(`/dao/jbx/#about-fees`)}>
              Learn more about fees
            </ExternalLink>
            .
          </p>
        </Trans>
      ),
    },
    {
      id: 'who-is-peel-who-is-juiceboxdao',
      q: <Trans>Who is Peel? Who is JuiceboxDAO?</Trans>,
      a: (
        <Trans>
          <p>
            <Link href="/@peel">Peel</Link> manages this website — the
            juicebox.money frontend interface. You can reach out to Peel through
            the{' '}
            <ExternalLink href="https://discord.gg/XvmfY4Hkcz">
              Peel Discord
            </ExternalLink>
            .
          </p>
          <p>
            <Link href="/@juicebox">JuiceboxDAO</Link> builds and governs the
            Juicebox fundraising protocol and other community resources. You can
            reach out to JuiceboxDAO through the{' '}
            <JBDiscordLink>Juicebox Discord</JBDiscordLink>.
          </p>
        </Trans>
      ),
    },
    {
      id: 'how-do-i-set-up-my-project',
      q: <Trans>How should I set up my project?</Trans>,
      a: (
        <Trans>
          <p>
            If you're looking for help planning or deploying your project, you
            can <Link href="/contact">contact onboarding</Link>. For project
            setup tips and more resources, take a look at the{' '}
            <ExternalLink href={helpPagePath('/user/')}>
              Project Creator Docs
            </ExternalLink>
            . You should also join JuiceboxDAO's{' '}
            <JBDiscordLink>Discord server</JBDiscordLink>, where DAO
            contributors can guide you through the project creation process.
          </p>
        </Trans>
      ),
    },
    {
      id: 'i-have-another-question',
      q: <Trans>I have another question!</Trans>,
      a: (
        <Trans>
          <p>
            For more information, or help with anything else,{' '}
            <Link href="/contact">contact onboarding</Link> and join the{' '}
            <JBDiscordLink>JuiceboxDAO Discord server</JBDiscordLink>.
          </p>
        </Trans>
      ),
    },
  ]
}
