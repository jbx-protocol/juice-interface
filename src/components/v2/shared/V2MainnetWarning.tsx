import { Trans } from '@lingui/macro'
import ExternalLink from 'components/shared/ExternalLink'

export default function V2MainnetWarning() {
  return (
    <div>
      <img
        style={{ maxWidth: 200, marginBottom: '2rem' }}
        src="/assets/blueberry-ol.png"
        alt="Sexy blueberry with bright pink lipstick spraying a can of spraypaint"
      />
      <h3>
        <Trans>Juicebox V2 on mainnet isn't supported.</Trans>
      </h3>
      <p>
        <Trans>
          Head to{' '}
          <ExternalLink href="https://rinkeby.juicebox.money">
            rinkeby.juicebox.money
          </ExternalLink>{' '}
          to create a project using the Juicebox V2 contracts on Rinkeby.
        </Trans>
      </p>
    </div>
  )
}
