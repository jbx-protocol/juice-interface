import { Trans } from '@lingui/macro'
import Banner from 'components/Banner'
import ExternalLink from 'components/ExternalLink'

export function WalletConnectWarningBanner() {
  return (
    <Banner
      body={
        <Trans>
          <strong>Warning:</strong> An ongoing Ledger Connect vulnerability
          could affect many dapps. Juicebox should be safe, but{' '}
          <strong>exercise caution.</strong>{' '}
          <ExternalLink href="https://twitter.com/Ledger/status/1735326240658100414">
            Learn more.
          </ExternalLink>
        </Trans>
      }
      variant="warning"
      textAlign="center"
    />
  )
}
