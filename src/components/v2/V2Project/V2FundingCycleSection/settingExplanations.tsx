import { Trans } from '@lingui/macro'

export const DISCOUNT_RATE_EXPLANATION = (
  <Trans>
    The ratio of tokens rewarded per payment amount will decrease by this
    percentage with each new funding cycle. A higher discount rate will
    incentivize supporters to pay your project earlier than later.
  </Trans>
)

export const REDEMPTION_RATE_EXPLANATION = (
  <Trans>
    This rate determines the amount of overflow that each token can be redeemed
    for at any given time. On a lower bonding curve, redeeming a token increases
    the value of each remaining token, creating an incentive to hold tokens
    longer than others. A redemption rate of 100% means all tokens will have
    equal value regardless of when they are redeemed.
  </Trans>
)
