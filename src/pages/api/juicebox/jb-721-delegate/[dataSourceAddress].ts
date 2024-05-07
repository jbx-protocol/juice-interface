import { readNetwork } from 'constants/networks'
import { IJB721TieredDelegate_V3_INTERFACE_ID } from 'constants/nftRewards'
import { readProvider } from 'constants/readProvider'
import { Contract } from 'ethers'
import { ForgeDeploy, addressFor } from 'forge-run-parser'
import { loadJB721DelegateJson } from 'hooks/JB721Delegate/contracts/useJB721DelegateAbi'
import { loadJB721DelegateAddress } from 'hooks/JB721Delegate/contracts/useJB721DelegateContractAddress'
import { enableCors } from 'lib/api/nextjs'
import { getLogger } from 'lib/logger'
import { JB721DelegateVersion } from 'models/v2v3/contracts'
import { NextApiRequest, NextApiResponse } from 'next'
import { isEqualAddress, isZeroAddress } from 'utils/address'
import JBDelegatesRegistryJson from './IJBDelegatesRegistry.json'

const logger = getLogger('api/juicebox/jb-721-delegate/[dataSourceAddress]')

async function loadJBDelegatesRegistryDeployments() {
  const deployments = (await import(
    `@jbx-protocol/juice-delegates-registry/broadcast/Deploy.s.sol/${readNetwork.chainId}/run-latest.json`
  )) as ForgeDeploy

  return deployments
}

async function loadJBDelegatesRegistryAddress() {
  const deployments = await loadJBDelegatesRegistryDeployments()

  const address = addressFor('JBDelegatesRegistry', deployments)

  return address!
}

async function fetchDeployerOf(dataSourceAddress: string) {
  const JBDelegatesRegistryAddress = await loadJBDelegatesRegistryAddress()

  const JBDelegatesRegistry = new Contract(
    JBDelegatesRegistryAddress,
    JBDelegatesRegistryJson.abi,
    readProvider,
  )

  // theres 2 registries, so need to check if the dataSourceAddress might be in the old one
  const oldRegistry = await JBDelegatesRegistry.oldRegistry()
  const OldJBDelegatesRegistry = new Contract(
    oldRegistry,
    JBDelegatesRegistryJson.abi,
    readProvider,
  )

  const [deployerAddressResult, deployerAddressOldRegistryResult] =
    await Promise.allSettled([
      JBDelegatesRegistry.deployerOf(dataSourceAddress),
      OldJBDelegatesRegistry.deployerOf(dataSourceAddress),
    ])
  if (
    deployerAddressResult.status === 'rejected' &&
    deployerAddressOldRegistryResult.status === 'rejected'
  ) {
    logger.error(
      {
        deployerAddress: deployerAddressResult,
        deployerAddressOldRegistry: deployerAddressOldRegistryResult,
      },
      'Failed to resolve deployer',
    )
    return null
  }
  let deployerAddress, deployerAddressOldRegistry
  if (deployerAddressResult.status === 'fulfilled') {
    deployerAddress = deployerAddressResult.value
  }
  if (deployerAddressOldRegistryResult.status === 'fulfilled') {
    deployerAddressOldRegistry = deployerAddressOldRegistryResult.value
  }

  return deployerAddress || deployerAddressOldRegistry
}

async function isJB721DelegateV3(dataSourceAddress: string) {
  const JB721TieredGovernanceJson = await loadJB721DelegateJson(
    'JB721TieredGovernance',
    JB721DelegateVersion.JB721DELEGATE_V3,
  )
  if (!JB721TieredGovernanceJson?.abi) return false

  const contract = new Contract(
    dataSourceAddress,
    JB721TieredGovernanceJson.abi,
    readProvider,
  )
  const supportsInterface = await contract.supportsInterface(
    IJB721TieredDelegate_V3_INTERFACE_ID,
  )

  return Boolean(supportsInterface)
}

async function isJB721DelegateV3_1(deployerAddress: string) {
  const deployerV3_1Address = await loadJB721DelegateAddress(
    'JBTiered721DelegateDeployer',
    JB721DelegateVersion.JB721DELEGATE_V3_1,
  )

  return (
    Boolean(deployerAddress) &&
    !isZeroAddress(deployerAddress) &&
    isEqualAddress(deployerV3_1Address, deployerAddress)
  )
}

async function isJB721DelegateV3_2(deployerAddress: string) {
  const deployerV3_2Address = await loadJB721DelegateAddress(
    'JBTiered721DelegateDeployer',
    JB721DelegateVersion.JB721DELEGATE_V3_2,
  )

  return (
    Boolean(deployerAddress) &&
    !isZeroAddress(deployerAddress) &&
    isEqualAddress(deployerV3_2Address, deployerAddress)
  )
}

async function isJB721DelegateV3_3(deployerAddress: string) {
  const deployerV3_3Address = await loadJB721DelegateAddress(
    'JBTiered721DelegateDeployer',
    JB721DelegateVersion.JB721DELEGATE_V3_3,
  )

  return (
    Boolean(deployerAddress) &&
    !isZeroAddress(deployerAddress) &&
    isEqualAddress(deployerV3_3Address, deployerAddress)
  )
}

async function isJB721DelegateV3_4(deployerAddress: string) {
  const deployerV3_4Address = await loadJB721DelegateAddress(
    'JBTiered721DelegateDeployer',
    JB721DelegateVersion.JB721DELEGATE_V3_4,
  )

  return (
    Boolean(deployerAddress) &&
    !isZeroAddress(deployerAddress) &&
    isEqualAddress(deployerV3_4Address, deployerAddress)
  )
}

async function fetchJB721DelegateVersion(dataSourceAddress: string) {
  const isV3 = await isJB721DelegateV3(dataSourceAddress)
  if (isV3) return JB721DelegateVersion.JB721DELEGATE_V3

  const deployerAddress = await fetchDeployerOf(dataSourceAddress)
  const results = await Promise.allSettled([
    isJB721DelegateV3_1(deployerAddress),
    isJB721DelegateV3_2(deployerAddress),
    isJB721DelegateV3_3(deployerAddress),
    isJB721DelegateV3_4(deployerAddress),
  ])
  const errors = results.filter(result => result.status === 'rejected')
  if (errors.length === 4) {
    logger.error({ error: errors }, 'Failed to resolve delegate')
    return null
  } else {
    logger.warn({ failures: errors }, 'Failed to resolve delegate')
  }
  const [isV3_1, isV3_2, isV3_3, isV3_4] = results.map(result =>
    result.status === 'fulfilled' ? result.value : false,
  )
  if (isV3_1) return JB721DelegateVersion.JB721DELEGATE_V3_1
  if (isV3_2) return JB721DelegateVersion.JB721DELEGATE_V3_2
  if (isV3_3) return JB721DelegateVersion.JB721DELEGATE_V3_3
  if (isV3_4) return JB721DelegateVersion.JB721DELEGATE_V3_4

  return null
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  enableCors(res)

  if (req.method !== 'GET') {
    return res.status(404)
  }

  try {
    const { dataSourceAddress } = req.query

    if (!dataSourceAddress) {
      return res.status(400).json({ error: 'dataSourceAddress is required' })
    }

    const version = await fetchJB721DelegateVersion(dataSourceAddress as string)

    // cache for 1 week
    res.setHeader(
      'Cache-Control',
      `s-maxage=${86400 * 7}, stale-while-revalidate`,
    )
    const data = { version, dataSourceAddress }
    logger.info({ data })
    return res.status(200).json(data)
  } catch (err) {
    logger.error({ error: err })
    return res.status(500).json({ error: 'failed to resolve delegate' })
  }
}

export default handler
