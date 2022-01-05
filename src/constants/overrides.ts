import { NetworkName } from 'models/network-name'

// IDs of projects with pay disabled
export const disablePayOverrides: Partial<Record<NetworkName, Set<number>>> = {
  [NetworkName.mainnet]: new Set([
    140, // ponzidao
    36, // constitutiondao
  ]),
}
