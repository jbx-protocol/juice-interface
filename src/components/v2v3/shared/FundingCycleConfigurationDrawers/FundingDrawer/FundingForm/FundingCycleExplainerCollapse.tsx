import { Trans } from '@lingui/macro'
import { MinimalCollapse } from 'components/MinimalCollapse'

export function FundingCycleExplainerCollapse() {
  return (
    <MinimalCollapse header={<Trans>What are locked cycles?</Trans>}>
      <div>
        <p>
          <Trans>
            Your project's rules are locked in place for the duration of each
            locked cycle. You will also gain access to:
          </Trans>
        </p>
        <ol className="mb-0">
          <li>
            <Trans>
              <strong>Recurring cycles</strong>. Among other things, this allows
              you to predictably pay out ETH on weekly basis, or some other
              regular cadence.
            </Trans>
          </li>
          <li>
            <Trans>
              <strong>Issuance reduction rate</strong>. This allows you to
              predictably reduce your project token's issuance rate (tokens per
              ETH) over time without needing to manually edit your cycle.
            </Trans>
          </li>
        </ol>
      </div>
    </MinimalCollapse>
  )
}
