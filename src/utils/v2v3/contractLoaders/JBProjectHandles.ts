import { NETWORKS_BY_NAME } from 'constants/networks'
import { NetworkName } from 'models/network-name'
import { ForgeDeploy } from '../loadV2V3Contract'

// TODO ask contract crew to add this to their package.
const GOERLI_ADDRESS = '0x3ff1f0583a41ce8b9463f74a1227c75fc13f7c27'

export const loadJBProjectHandlesContract = async (network: NetworkName) => {
  const contractJson = {
    abi: (
      await import(
        `@jbx-protocol/project-handles/out/JBProjectHandles.sol/JBProjectHandles.json`
      )
    ).abi,
    address:
      network === NetworkName.goerli
        ? GOERLI_ADDRESS
        : (
            (await import(
              `@jbx-protocol/project-handles/broadcast/Deploy.sol/${NETWORKS_BY_NAME[network].chainId}/run-latest.json`
            )) as ForgeDeploy
          ).receipts[0].contractAddress, // contractAddress is prefixed `0x0x` in error, trim first `0x`
  }

  return contractJson
}
