import { NETWORKS_BY_NAME } from 'constants/networks'
import { NetworkName } from 'models/network-name'
import { ForgeDeploy } from '../loadV2V3Contract'

export const loadJBProjectHandlesContract = async (network: NetworkName) => {
  const contractJson = {
    abi: (
      await import(
        `@jbx-protocol/project-handles/out/JBProjectHandles.sol/JBProjectHandles.json`
      )
    ).abi,
    address: (
      (await import(
        `@jbx-protocol/project-handles/broadcast/Deploy.sol/${NETWORKS_BY_NAME[network].chainId}/run-latest.json`
      )) as ForgeDeploy
    ).receipts[0].contractAddress, // contractAddress is prefixed `0x0x` in error, trim first `0x`
  }

  return contractJson
}
