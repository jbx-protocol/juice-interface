import { Trans } from '@lingui/macro'

export const DISTRIBUTION_LIMIT_EXPLANATION = (
  <Trans>
    The maximum amount of funds that can be distributed from the treasury in a
    funding cycle.
  </Trans>
)

export const DISCOUNT_RATE_EXPLANATION = (
  <Trans>
    The project token's issuance rate decreases by the{' '}
    <strong>discount rate</strong> every funding cycle. A higher discount rate
    incentivizes contributors to fund the project earlier.
  </Trans>
)

export const REDEMPTION_RATE_EXPLANATION = (
  <Trans>
    <p>
      The redemption rate determines the amount of overflow each token can be
      redeemed for at any given time.
    </p>
    <p>
      A redemption rate of 100% means all tokens will have equal value
      regardless of when they are redeemed.
    </p>
    <p>
      On a lower redemption rate, redeeming a token increases the value of each
      remaining token, creating an incentive to hold tokens longer than other
      holders.
    </p>
  </Trans>
)

export const MINT_RATE_EXPLANATION = (
  <Trans>
    Total project tokens minted the project receives 1 ETH. The project's{' '}
    <strong>discount rate</strong> and <strong>reserved rate</strong> affect the
    total mint rate over time.
  </Trans>
)

export const CONTRIBUTOR_RATE_EXPLAINATION = (
  <Trans>
    The amount of project tokens contributors will recieve when they contribute
    1 ETH to this project.
  </Trans>
)

export const RESERVED_RATE_EXPLAINATION = (
  <Trans>The percentage of newly minted tokens reserved for the project.</Trans>
)

export const RESERVED_TOKENS_EXPLAINATION = (
  <Trans>
    The amount of newly minted project tokens reserved for the project when 1
    ETH is contributed.
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
  <Trans>Rules for determining how funding cycles can be reconfigured.</Trans>
)
