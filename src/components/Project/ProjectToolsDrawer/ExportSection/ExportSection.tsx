import { Trans } from '@lingui/macro'
import { Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export function ExportSection({
  exportPayoutsButton,
  exportReservedTokensButton,
}: {
  exportPayoutsButton: JSX.Element | undefined
  exportReservedTokensButton: JSX.Element | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <section>
      <h3>
        <Trans>Export data</Trans>
      </h3>
      <Space direction="vertical" size="large">
        {exportPayoutsButton && (
          <div>
            <h4 style={{ color: colors.text.primary }}>
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
            <h4 style={{ color: colors.text.primary }}>
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
