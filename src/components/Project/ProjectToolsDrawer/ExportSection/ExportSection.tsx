import { Trans } from '@lingui/macro'
import { Space } from 'antd'

export function ExportSection({
  exportPayoutsButton,
  exportReservedTokensButton,
}: {
  exportPayoutsButton: JSX.Element | undefined
  exportReservedTokensButton: JSX.Element | undefined
}) {
  return (
    <section>
      <h3 className="text-primary">
        <Trans>Export data</Trans>
      </h3>
      <Space direction="vertical" size="large">
        {exportPayoutsButton && (
          <div>
            <h4 className="text-black dark:text-slate-100">
              <Trans>Payouts</Trans>
            </h4>
            <p>
              <Trans>Export the current funding cycle's payouts to CSV.</Trans>
            </p>
            {exportPayoutsButton}
          </div>
        )}

        {exportReservedTokensButton && (
          <div>
            <h4 className="text-black dark:text-slate-100">
              <Trans>Reserved token allocation</Trans>
            </h4>
            <p>
              <Trans>
                Export the current funding cycle's reserved token allocation to
                CSV.
              </Trans>
            </p>
            {exportReservedTokensButton}
          </div>
        )}
      </Space>
    </section>
  )
}
