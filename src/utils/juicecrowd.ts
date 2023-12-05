import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/networkName'

export function getJuicecrowdUrl(projectId: number) {
  const prefix = readNetwork.name === NetworkName.goerli ? 'goerli.' : ''
  return `https://${prefix}juicecrowd.gg/p/${projectId}`
}
