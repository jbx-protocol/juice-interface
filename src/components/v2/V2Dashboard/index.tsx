import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'
import V2MainnetWarning from '../shared/V2MainnetWarning'
import V2Dashboard from './Dashboard'

export default function V2DashboardContainer() {
  const isRinkeby = readNetwork.name === NetworkName.rinkeby

  return (
    <>
      {!isRinkeby && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <V2MainnetWarning />
        </div>
      )}
      {isRinkeby && <V2Dashboard />}
    </>
  )
}
