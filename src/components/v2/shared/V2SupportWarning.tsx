import { Trans } from '@lingui/macro'
import V2Switch from 'components/Landing/V2Switch'

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

      <V2Switch />
    </div>
  )
}
