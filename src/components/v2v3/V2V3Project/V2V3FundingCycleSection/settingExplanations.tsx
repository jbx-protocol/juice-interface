import { Trans } from '@lingui/macro'

export const DISTRIBUTION_LIMIT_EXPLANATION = (
  <Trans>
    The maximum amount of funds that can be distributed from the treasury in a
    funding cycle.
  </Trans>
)

export const DISCOUNT_RATE_EXPLANATION = (
  <Trans>
    The project token's issuance rate will decrease by this percentage every
    funding cycle. A higher discount rate will incentivize contributors to pay
    the project earlier.
  </Trans>
)

export const REDEMPTION_RATE_EXPLANATION = (
  <Trans>
    The redemption rate determines the amount of overflow each token can be
    redeemed for at any given time. On a lower redemption rate, redeeming a
    token increases the value of each remaining token, creating an incentive to
    hold tokens longer than other holders. A redemption rate of 100% means all
    tokens will have equal value regardless of when they are redeemed.
  </Trans>
)

export const MINT_RATE_EXPLANATION = (
  <Trans>
    <strong>Total project tokens minted when 1 ETH is contributed.</strong> This
    can change over time according to the discount rate and reserved tokens
    amount of future funding cycles.
  </Trans>
)

export const CONTRIBUTOR_RATE_EXPLAINATION = (
  <Trans>
    Newly minted project tokens <strong>received by contributors</strong> when
    they contribute 1 ETH to the treasury.
  </Trans>
)

export const RESERVED_RATE_EXPLAINATION = (
  <Trans>
    Percentage of newly minted tokens reserved for the project. The project
    owner is allocated all reserved tokens by default, but they can also be
    allocated to other wallet addresses (see <i>Reserved token splits</i>).
  </Trans>
)

export const RESERVED_TOKENS_EXPLAINATION = (
  <Trans>
    Amount of newly minted project tokens{' '}
    <strong>reserved for the project</strong> when 1 ETH is contributed.
  </Trans>
)

export const OWNER_MINTING_EXPLAINATION = (
  <Trans>
    Token minting allows the project owner to mint project tokens at any time.
  </Trans>
)

export const TERMINAL_CONFIG_EXPLAINATION = (
  <Trans>The project owner can add and remove payment terminals.</Trans>
)

export const RECONFIG_RULES_EXPLAINATION = (
  <Trans>Rules for determining how funding cycles can be reconfigured</Trans>
)
