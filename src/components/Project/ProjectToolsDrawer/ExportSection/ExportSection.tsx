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
      <h3>
        <Trans>Export data</Trans>
      </h3>
      <Space direction="vertical" size="large">
        {exportPayoutsButton && (
          <div>
            <h4 className="text-black dark:text-slate-100">
              <Trans>Payouts</Trans>
            </h4>
            <p>
              <Trans>Export this cycle's payouts to CSV.</Trans>
            </p>
            {exportPayoutsButton}
          </div>
        )}

        {exportReservedTokensButton && (
          <div>
            <h4 className="text-black dark:text-slate-100">
              <Trans>Reserved token recipients</Trans>
            </h4>
            <p>
              <Trans>
                Export a list of this cycle's reserved token recipients to CSV.
              </Trans>
            </p>
            {exportReservedTokensButton}
          </div>
        )}
      </Space>
    </section>
  )
}
