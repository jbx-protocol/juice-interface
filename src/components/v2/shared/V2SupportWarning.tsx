import { Trans } from '@lingui/macro'

import { readNetwork } from 'constants/networks'

export default function V2SupportWarning() {
  return (
    <div>
      <img
        style={{ maxWidth: 200, marginBottom: '2rem' }}
        src="/assets/blueberry-ol.png"
        alt="Sexy blueberry with bright pink lipstick spraying a can of spraypaint"
      />
      <h3>
        <Trans>Juicebox V2 on {readNetwork.name} isn't enabled.</Trans>
      </h3>
      <p>
        <Trans>
          The Juicebox V2 frontend is still in development. Some features are
          missing and there are known bugs.
        </Trans>
      </p>
    </div>
  )
}
