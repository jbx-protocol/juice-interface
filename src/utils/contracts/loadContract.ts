import { Contract, ContractInterface } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { NetworkName } from 'models/network-name'
import { V2ContractName } from 'models/v2/contracts'

import { mainnetPublicResolver } from 'constants/contracts/mainnet/PublicResolver'
import { rinkebyPublicResolver } from 'constants/contracts/rinkeby/PublicResolver'
import { TEMPORARY_NFT_DEPLOYER_ABI } from 'constants/contracts/rinkeby/TEMPORY_NFT_DEPLOYER_ABI'
import { NETWORKS_BY_NAME } from 'constants/networks'

export const loadContract = async (
  contractName: V2ContractName,
  network: NetworkName,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
): Promise<Contract | undefined> => {
  let contractJson: { abi: ContractInterface; address: string } | undefined =
    undefined

  if (contractName === V2ContractName.JBProjectHandles) {
    contractJson = await loadJBProjectHandlesContract(network)
  } else if (contractName === V2ContractName.PublicResolver) {
    contractJson = loadPublicResolverContract(network)
  } else if (contractName === V2ContractName.JBV1TokenPaymentTerminal) {
    contractJson = await loadJBV1TokenPaymentTerminalContract(network)
  } else if (
    contractName ===
    V2ContractName.JBTieredLimitedNFTRewardDataSourceProjectDeployer
  ) {
    contractJson = await loadJBNftRewardsDeployerContract()
  } else {
    contractJson = await loadJuiceboxV2Contract(contractName, network)
  }

  if (!contractJson) {
    throw new Error(
      `Error importing contract ${contractName}. Network: ${network})`,
    )
  }

  return new Contract(contractJson.address, contractJson.abi, signerOrProvider)
}

interface ForgeDeploy {
  receipts: { contractAddress: string }[]
}

/**
 *  Defines the ABI filename to use for a given V2ContractName.
 */
const CONTRACT_ABI_OVERRIDES: {
  [k in V2ContractName]?: { filename: string; version: string }
} = {
  DeprecatedJBController: {
    version: '4.0.0',
    filename: 'JBController',
  },
  DeprecatedJBSplitsStore: {
    version: '4.0.0',
    filename: 'JBSplitsStore',
  },
  DeprecatedJBDirectory: {
    version: '4.0.0',
    filename: 'JBDirectory',
  },
}

const loadJBProjectHandlesContract = async (network: NetworkName) => {
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

const loadPublicResolverContract = (network: NetworkName) => {
  // ENS contracts package currently doesn't include rinkeby information, and ABI contains errors
  if (network === NetworkName.mainnet) return mainnetPublicResolver
  if (network === NetworkName.rinkeby) return rinkebyPublicResolver
}

const loadJuiceboxV2Contract = async (
  contractName: V2ContractName,
  network: NetworkName,
) => {
  const contractOverride = CONTRACT_ABI_OVERRIDES[contractName]
  const version = contractOverride?.version ?? 'latest'
  const filename = contractOverride?.filename ?? contractName
  return await import(
    `@jbx-protocol/contracts-v2-${version}/deployments/${network}/${filename}.json`
  )
}

const loadJBV1TokenPaymentTerminalContract = async (network: NetworkName) => {
  const contractJson = {
    abi: (
      await import(
        `@jbx-protocol/juice-v1-token-terminal/out/JBV1TokenPaymentTerminal.sol/JBV1TokenPaymentTerminal.json`
      )
    ).abi,
    address: (
      (await import(
        `@jbx-protocol/juice-v1-token-terminal/broadcast/Deploy.sol/${NETWORKS_BY_NAME[network].chainId}/run-latest.json`
      )) as ForgeDeploy
    ).receipts[0].contractAddress,
  }

  return contractJson
}

const loadJBNftRewardsDeployerContract = async () => {
  const temporaryNftDeployerContractJson = {
    address: '0x1Db110f9FD09820c60CaFA89CB736910306bbec9',
    abi: TEMPORARY_NFT_DEPLOYER_ABI,
  }

  return temporaryNftDeployerContractJson
}
