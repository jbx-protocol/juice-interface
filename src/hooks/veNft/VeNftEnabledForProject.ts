import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'

export function useVeNftEnabledForProject(
  projectId: number | undefined,
): boolean {
  return (
    process.env.REACT_APP_VENFT_SUBGRAPH_URL !== undefined &&
    readNetwork.name === NetworkName.rinkeby &&
    projectId === 1
  )
}
