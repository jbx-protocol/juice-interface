import { Trans } from '@lingui/macro'
import { MinimalCollapse } from 'components/MinimalCollapse'

export function PayoutConfigurationExplainerCollapse({
  className,
}: {
  className?: string
}) {
  return (
    <MinimalCollapse
      className={className}
      header={<Trans>How do I decide?</Trans>}
    >
      <p>
        <Trans>
          Use <strong>Percentages</strong> if you'd like to pay out all of the
          ETH in the treasury. Since no funds will be left over, your token
          holders won't be able to redeem their tokens for ETH. This can make it
          harder to build trust with your community.
        </Trans>
      </p>

      <p>
        <Trans>
          Otherwise, use <strong>Amounts</strong>. Amounts let you pre-define
          the amount of ETH you can pay out from the project each cycle. The
          leftover ETH can be used for future cycles, or token redemptions if
          you enable them.
        </Trans>
      </p>
    </MinimalCollapse>
  )
}
