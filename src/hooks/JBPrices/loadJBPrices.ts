import { CV_V2, CV_V3 } from 'constants/cv'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { Contract } from 'ethers'
import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { CV2V3 } from 'models/v2v3/cv'

export async function loadJBPrices({
  cv,
}: {
  cv: CV2V3 | undefined
}): Promise<Contract | undefined> {
  let contractJson: ContractJson | undefined
  if (cv === CV_V2) {
    if (readNetwork.name === NetworkName.goerli) {
      contractJson = await import(
        '@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBPrices.json'
      )
      contractJson.address = '0x57bF7C005B77d487074AB3b6Dcd3E5f4D420E3C1'
    } else if (readNetwork.name === NetworkName.sepolia) {
      contractJson = await import(
        '@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBPrices.json'
      )
      contractJson.address = '0x6EF51C14045B386A0ae6374E48a9EeB928105ffb'
    } else {
      contractJson = await import(
        '@jbx-protocol/contracts-v2-latest/deployments/mainnet/JBPrices.json'
      )
    }
  }

  if (cv === CV_V3) {
    if (readNetwork.name === NetworkName.sepolia) {
      contractJson = await import(
        '@jbx-protocol/juice-contracts-v3/deployments/sepolia/JBPrices.json'
      )
    } else {
      contractJson = await import(
        '@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBPrices.json'
      )
    }
  }

  if (!contractJson || !contractJson.address || !contractJson.abi)
    return undefined

  return new Contract(contractJson.address, contractJson.abi, readProvider)
}
