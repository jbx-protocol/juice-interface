import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'

export function useVeNftEnabled(projectId: number | undefined): boolean {
  const isEnabled = readNetwork.name === NetworkName.rinkeby && projectId === 1
  return isEnabled
}
