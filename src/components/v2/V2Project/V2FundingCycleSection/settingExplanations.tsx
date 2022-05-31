import { Trans } from '@lingui/macro'

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
