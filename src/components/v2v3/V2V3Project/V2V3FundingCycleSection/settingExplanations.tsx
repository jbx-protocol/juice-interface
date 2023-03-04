import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { helpPagePath } from 'utils/routes'

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
    The total number of tokens issued when this project is paid 1 ETH. By
    default these tokens are sent to the payer, but some of these tokens may be
    reserved for recipients chosen by the project owner.
  </Trans>
)

export const CONTRIBUTOR_RATE_EXPLAINATION = (
  <Trans>
    The number of tokens sent to someone who pays this project 1 ETH.
  </Trans>
)

export const RESERVED_RATE_EXPLAINATION = (
  <Trans>
    The reserved rate sets aside a percentage of token issuance for recipients
    chosen by the project owner.
  </Trans>
)

export const RESERVED_TOKENS_EXPLAINATION = (
  <Trans>
    The number of project tokens reserved for recipients chosen by the project
    owner when someone pays this project 1 ETH.
  </Trans>
)

export const OWNER_MINTING_EXPLAINATION = (
  <Trans>
    While enabled, the project owner can mint any amount of project tokens.
  </Trans>
)

export const TERMINAL_CONFIG_EXPLAINATION = (
  <Trans>
    While enabled, the project owner can change the project's{' '}
    <ExternalLink href={helpPagePath(`/dev/learn/glossary/payment-terminal/`)}>
      payment terminals
    </ExternalLink>{' '}
    at any time.
  </Trans>
)

export const CONTROLLER_CONFIG_EXPLAINATION = (
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

export const TERMINAL_MIGRATION_EXPLAINATION = (
  <Trans>
    While enabled, the project owner can migrate the project's current{' '}
    <ExternalLink href={helpPagePath(`/dev/learn/glossary/payment-terminal/`)}>
      payment terminals
    </ExternalLink>{' '}
    to another version of the contract.
  </Trans>
)

export const CONTROLLER_MIGRATION_EXPLAINATION = (
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
    While payments are paused, your project will not be able to receive
    payments. Adding to balance will still work.
  </Trans>
)

export const RECONFIG_RULES_EXPLAINATION = (
  <Trans>
    <p>
      Edits must be made before this deadline. This gives token holders time to
      verify the edits before they take effect.
    </p>
    <p>
      For example: with a 1-day edit deadline, edits must be made at least 1 day
      before a cycle starts.
    </p>
  </Trans>
)

export const HOLD_FEES_EXPLAINATION = (
  <Trans>
    When enabled, fees are held in the project instead of being processed
    automatically.{' '}
    <ExternalLink href={helpPagePath('/dev/learn/glossary/hold-fees')}>
      Learn more.
    </ExternalLink>
  </Trans>
)

export const USE_DATASOURCE_FOR_REDEEM_EXPLAINATION = (
  <Trans>
    While enabled, NFTs can be redeemed to reclaim some of the ETH that isn't
    needed for payouts. Tokens won't be redeemable.
  </Trans>
)

export const PREVENT_OVERSPENDING_EXPLAINATION = (
  <Trans>
    When enabled, supporters can only mint NFTs by paying their exact price.
    This ensures that they can reclaim their full payment amount if they redeem
    their NFT.
  </Trans>
)

export const FEES_EXPLANATION = (
  <Trans>
    Payouts to Ethereum addresses incur a 2.5% JBX membership fee. Payouts to
    other Juicebox projects don't incur fees.{' '}
    <ExternalLink href={helpPagePath(`/dao/reference/jbx/`)}>
      Learn more
    </ExternalLink>
    .
  </Trans>
)
