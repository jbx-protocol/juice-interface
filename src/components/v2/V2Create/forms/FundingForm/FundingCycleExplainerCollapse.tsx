import { Trans } from '@lingui/macro'
import { MinimalCollapse } from 'components/MinimalCollapse'

export function FundingCycleExplainerCollapse() {
  return (
    <MinimalCollapse header="What are automatted funding cycles?">
      <div>
        <p>
          <Trans>
            Automatted funding cycles enable the following characteristics:
          </Trans>
        </p>
        <ol style={{ marginBottom: 0 }}>
          <li>
            <Trans>
              <strong>Recurring funding cycles</strong>. For example, distribute
              funds from your project's treasury every week.
            </Trans>
          </li>
          <li>
            <Trans>
              <strong>Discount rate</strong>, to reduce your project token's
              issuance rate (tokens per ETH) each funding cycle.
            </Trans>
          </li>
        </ol>
      </div>
    </MinimalCollapse>
  )
}
