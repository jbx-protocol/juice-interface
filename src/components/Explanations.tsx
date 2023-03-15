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
