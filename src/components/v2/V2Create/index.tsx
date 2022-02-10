import { V2ProjectContext } from 'contexts/v2/projectContext'
import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'

import V2WarningBanner from './V2WarningBanner'
import V2MainnetWarning from './V2MainnetWarning'

export default function V2Create() {
  const isMainnet = readNetwork.name === NetworkName.mainnet
  // TODO
  const project = {
    projectId: undefined,
  }

  return (
    <V2ProjectContext.Provider value={project}>
      <V2WarningBanner />

      <div style={{ padding: '1rem', textAlign: 'center' }}>
        {isMainnet && <V2MainnetWarning />}

        {!isMainnet && (
          <p>
            Creating projects on the Juicebox V2 contracts is in development.
            Come back soon!
          </p>
        )}
      </div>
    </V2ProjectContext.Provider>
  )
}
