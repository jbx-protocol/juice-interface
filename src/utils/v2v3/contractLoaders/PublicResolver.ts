import { goerliPublicResolver } from 'constants/contracts/goerli/PublicResolver'
import { mainnetPublicResolver } from 'constants/contracts/mainnet/PublicResolver'
import { NetworkName } from 'models/network-name'

export const loadPublicResolverContract = (network: NetworkName) => {
  // ENS contracts package currently doesn't include goerli information, and ABI contains errors
  if (network === NetworkName.mainnet) return mainnetPublicResolver
  if (network === NetworkName.goerli) return goerliPublicResolver
}
