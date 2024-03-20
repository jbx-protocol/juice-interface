import { Trans } from '@lingui/macro'

export const ISSUE_ERC20_EXPLANATION = (
  <Trans>
    Create an ERC-20, and allow your supporters to claim your project's tokens
    as that ERC-20. This makes your tokens compatible with tools like Uniswap.
  </Trans>
)

export const PROJECT_PAYER_ADDRESS_EXPLANATION = (
  <Trans>
    Deploy an address which forwards ETH to your project. This makes it easier
    to pay your project with third-party tools.
  </Trans>
)

export const SPLITS_PAYER_ADDRESS_EXPLANATION = (
  <Trans>
    Deploy an address which forwards ETH directly to your project's payouts.
  </Trans>
)

export const CYCLE_EXPLANATION = (
  <Trans>
    <p>With unlocked cycles, you can edit your project's rules at any time.</p>
    <p>
      With locked cycles, you can lock your project's rules for a period of time
      (like 3 minutes, 2 years, or 14 days), helping you build trust with your
      supporters.
    </p>
    <p>
      This choice isn't permanent — you can switch between locked and unlocked
      cycles in the future.
    </p>
  </Trans>
)

export const LOCKED_PAYOUT_EXPLANATION = (
  <Trans>
    If locked, this payout can't be edited or removed until the lock expires or
    the cycle is edited.
  </Trans>
)

import ExternalLink from 'components/ExternalLink'
import Link from 'next/link'
import { helpPagePath, v2v3ProjectRoute } from 'utils/routes'

export const DISTRIBUTION_LIMIT_EXPLANATION = (
  <Trans>
    The amount of ETH which can be paid out from this project during the cycle.
    Payouts reset each cycle.
  </Trans>
)

export const DISCOUNT_RATE_EXPLANATION = (
  <Trans>
    The issuance rate is reduced by this amount each cycle (unless the owner
    changes the issuance rate).
  </Trans>
)

export const REDEMPTION_RATE_EXPLANATION = (
  <Trans>
    <p>
      Supporters can burn their tokens to reclaim some of the ETH not needed for
      payouts. The amount of ETH they receive depends on the redemption rate.
    </p>
    <p>
      At 100%, redemptions are 1:1 — somebody redeeming 10% of all project
      tokens will receive 10% of the available ETH. At 0%, redemptions are
      turned off.
    </p>
    <p>
      Anywhere else, redemptions take place along a bonding curve, meaning
      people who redeem first will get less ETH per token, and people who redeem
      later will get more ETH per token.
    </p>
    <p>
      Learn more in this{' '}
      <ExternalLink href="https://youtu.be/dxqc3yMqi5M">
        {' '}
        short video
      </ExternalLink>
      .
    </p>
  </Trans>
)

export const MINT_RATE_EXPLANATION = (
  <Trans>
    The total number of tokens issued when this project is paid 1 ETH. Some of
    these tokens may be reserved by the project, and the rest are sent to the
    payer.
  </Trans>
)

export const CONTRIBUTOR_RATE_EXPLANATION = (
  <Trans>
    The number of tokens sent to someone who pays this project 1 ETH.
  </Trans>
)

export const RESERVED_RATE_EXPLANATION = (
  <Trans>
    A percentage of token issuance which is set aside for addresses and other
    projects chosen by the project owner.
  </Trans>
)

export const RESERVED_TOKENS_EXPLANATION = (
  <Trans>
    The number of tokens set aside for reserved token recipients when someone
    pays this project 1 ETH.
  </Trans>
)

export const OWNER_MINTING_EXPLANATION = (
  <Trans>
    While enabled, the project owner can mint any amount of project tokens.
  </Trans>
)

export const OWNER_MINTING_RISK = (
  <Trans>
    Enabling owner token minting isn't recommended as it allows the project
    owner to create unlimited tokens, which appears risky to supporters.
  </Trans>
)

export const TERMINAL_CONFIG_EXPLANATION = (
  <Trans>
    While enabled, the project owner can change the project's{' '}
    <ExternalLink href={helpPagePath(`/dev/learn/glossary/payment-terminal/`)}>
      payment terminals
    </ExternalLink>{' '}
    at any time.
  </Trans>
)

export const CONTROLLER_CONFIG_EXPLANATION = (
  <Trans>
    While enabled, the project owner can change the project's{' '}
    <ExternalLink
      href={helpPagePath(`/dev/learn/architecture/#surface-contracts`)}
    >
      controller
    </ExternalLink>{' '}
    at any time.
  </Trans>
)

export const TERMINAL_MIGRATION_EXPLANATION = (
  <Trans>
    While enabled, the project owner can migrate the project's current{' '}
    <ExternalLink href={helpPagePath(`/dev/learn/glossary/payment-terminal/`)}>
      payment terminals
    </ExternalLink>{' '}
    to another version of the contract.
  </Trans>
)

export const CONTROLLER_MIGRATION_EXPLANATION = (
  <Trans>
    While enabled, the project owner can migrate the project's current{' '}
    <ExternalLink
      href={helpPagePath(`/dev/learn/architecture/#surface-contracts`)}
    >
      controller
    </ExternalLink>{' '}
    to another version of the contract.
  </Trans>
)

export const PAUSE_TRANSFERS_EXPLANATION = (
  <Trans>
    While transfers are paused, this project's tokens can't be transferred to
    other addresses. The project's ERC-20 tokens (if already issued) are always
    transferable, and will not be affected by this rule.
  </Trans>
)

export const PAUSE_PAYMENTS_EXPLANATION = (
  <Trans>
    While payments to this project are paused, your project will not be able to
    receive payments. Transferring ETH to this project will still work.
  </Trans>
)

export const RECONFIG_RULES_EXPLANATION = (
  <Trans>
    <p>
      Edits to this project must be made before this deadline. This gives token
      holders time to verify the edits before they take effect.
    </p>
    <p>
      For example: with a 1-day edit deadline, edits must be made at least 1 day
      before a cycle starts.
    </p>
  </Trans>
)

export const RECONFIG_RULES_WARN = (
  <Trans>
    Adding an edit deadline is recommended. Projects with no deadline will
    appear risky to contributors.
  </Trans>
)

export const HOLD_FEES_EXPLANATION = (
  <Trans>
    When enabled, fees are held in the project instead of being processed
    automatically.{' '}
    <ExternalLink href={helpPagePath('/dev/learn/glossary/hold-fees')}>
      Learn more.
    </ExternalLink>
  </Trans>
)

export const PREVENT_OVERSPENDING_EXPLANATION = (
  <Trans>
    When enabled, supporters can only mint NFTs by paying their exact price.
    This ensures that they can reclaim their full payment amount if they redeem
    their NFT.
  </Trans>
)

export const FEES_EXPLANATION = (
  <Trans>
    Payouts to other Juicebox projects don't incur fees. A 2.5% fee is taken
    from all other payouts. This project's owner will receive{' '}
    <Link href={v2v3ProjectRoute({ projectId: 1 })}>JBX</Link> in exchange for
    fees paid.{' '}
    <ExternalLink href={helpPagePath(`/dao/jbx/`)}>Learn more</ExternalLink>.
  </Trans>
)

export const DATASOURCE_EXPLANATION = (
  <Trans>
    A contract which defines custom behavior which can be used when somebody
    pays this project or redeems from it.{' '}
    <ExternalLink href={helpPagePath(`/dev/learn/glossary/data-source/`)}>
      Learn more
    </ExternalLink>
  </Trans>
)

export const USE_DATASOURCE_FOR_PAY_EXPLANATION = (
  <Trans>
    While enabled, this project will use the custom behavior defined in the
    contract above when somebody pays this project. Exercise caution.
  </Trans>
)

export const USE_DATASOURCE_FOR_REDEEM_EXPLANATION = (
  <Trans>
    While enabled, this project will use the custom behavior defined in the
    contract above when somebody redeems from this project. Exercise caution.
  </Trans>
)

export const NFT_DATASOURCE_EXPLANATION = (
  <Trans>
    This contract manages NFT minting and redeeming for this project.
  </Trans>
)

export const USE_NFT_DATASOURCE_FOR_REDEEM_EXPLANATION = (
  <Trans>
    While enabled, NFTs can be redeemed to reclaim some of the ETH that isn't
    needed for payouts, but it won't be possible to redeem this project's
    tokens.
  </Trans>
)

export const USE_NFT_DATASOURCE_FOR_PAY_EXPLANATION = (
  <Trans>
    While enabled, NFTs can be minted when this project receives a payment.
  </Trans>
)
