import { Trans } from '@lingui/macro'
import Banner from 'components/Banner'
import ExternalLink from 'components/ExternalLink'

export function JuicecrowdBanner() {
  return (
    <Banner
      body={
        <Trans>
          Juicecrowd submissions are now open.{' '}
          <strong className="font-semibold">3 ETH</strong> prize pool.{' '}
          <ExternalLink href="https://juicecrowd.gg">Learn more</ExternalLink>
        </Trans>
      }
      variant="blue"
      textAlign="center"
    />
  )
}
