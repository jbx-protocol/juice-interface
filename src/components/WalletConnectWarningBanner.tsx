import { Trans } from '@lingui/macro'
import Banner from 'components/Banner'
import ExternalLink from 'components/ExternalLink'

export function WalletConnectWarningBanner() {
  return (
    <Banner
      body={
        <Trans>
          <strong>Warning:</strong> An ongoing Ledger Connect vulnerability may
          affect Juicebox users.{' '}
          <strong>Clear your cache before using Juicebox.</strong> Exercise
          caution.{' '}
          <ExternalLink href="https://cointelegraph.com/news/multiple-dapps-using-ledger-connector-compromised">
            Learn more.
          </ExternalLink>
        </Trans>
      }
      variant="warning"
      textAlign="center"
    />
  )
}
