import { Trans } from '@lingui/macro'
import Banner from 'components/Banner'
import ExternalLink from 'components/ExternalLink'

export function WalletConnectWarningBanner() {
  return (
    <Banner
      body={
        <Trans>
          <strong>Warning:</strong> On-going <strong>Ledger Connect</strong>{' '}
          vulnerability. Exercise caution.{' '}
          <ExternalLink href="https://cointelegraph.com/news/multiple-dapps-using-ledger-connector-compromised">
            Learn more
          </ExternalLink>
        </Trans>
      }
      variant="warning"
      textAlign="center"
    />
  )
}
