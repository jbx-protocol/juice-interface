import { NetworkName } from 'models/network-name'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { ContractJson } from '../loadV2V3Contract'

/**
 * Courtesey of ser DrGorilla.eth
 */
const V2_GOERLI_CONTRACT_ADDRESSES: { [k in V2V3ContractName]?: string } = {
  JBOperatorStore: '0xF4144dFa5441818B815BbbAcA30e94DBB424354C',
  JBPrices: '0x57bF7C005B77d487074AB3b6Dcd3E5f4D420E3C1',
  JBProjects: '0x21263a042aFE4bAE34F08Bb318056C181bD96D3b',
  JBDirectory: '0xeFA8232c90EB523AA4eAe5C0CA2Dd63b5bDC91a1',
  JBFundingCycleStore: '0xa0FbC1c00C6d9F9d0DD344245E05F7618530A748',
  JBTokenStore: '0x03104e05412729B98151875Fd83d20A95334E5b1',
  JBSplitsStore: '0x2293Dbbd37a2CC6bdba109429b91d8398b2CC11f',
  JBController: '0xE270E62137ceB784FCb1f47Ad7cA0Ba84Cc19d92',
  JBSingleTokenPaymentTerminalStore:
    '0x27c4640aF8d1B24f1353C5d112a30fCed19b4978',
  JBETHPaymentTerminal: '0x8E8d0C73ddee3819Aaa1A2943350012803Cb8AcE',
}

/**
 *  Defines the ABI filename to use for a given V2V3ContractName.
 */
const V2_CONTRACT_ABI_OVERRIDES: {
  [k in V2V3ContractName]?: {
    filename: string
    version: string
    addresses?: {
      [k in NetworkName]?: string
    }
  }
} = {
  DeprecatedJBSplitsStore: {
    version: '4.0.0',
    filename: 'JBSplitsStore',
  },
  DeprecatedJBDirectory: {
    version: '4.0.0',
    filename: 'JBDirectory',
  },
  JBETHERC20ProjectPayerDeployer: {
    version: 'latest',
    filename: 'JBETHERC20ProjectPayerDeployer',
    /**
     * This deployment of the JBETHERC20ProjectPayerDeployer has slightly different
     * internals to the one in the contracts-v2-latest package.
     *
     * It sets the beneficiary to tx.origin, instead of msg.sender.
     *
     * It was only deployed on mainnet, so we'll override it for mainnet only.
     */
    addresses: {
      [NetworkName.mainnet]: '0x325Ba0eFC2c750e0317561e79cFa6911e29B24CC',
    },
  },
}

/**
 * Return the contract JSON for a given V2 contract on Goerli.
 *
 * There is no V2 goerli deployment files in the contracts-v2 npm package.
 * So, we have to manually define the contract addresses, and use the
 * ABIs from mainnet.
 *
 * V2 on Goerli isn't really a thing, but we need to support it
 * to test various mainnet features (like project contract version upgrades).
 */
async function loadJuiceboxV2ContractGoerli(
  contractName: V2V3ContractName,
): Promise<ContractJson> {
  const contractJson = (await import(
    `@jbx-protocol/contracts-v2-latest/deployments/mainnet/${contractName}.json`
  )) as ContractJson

  return {
    abi: contractJson.abi,
    address: V2_GOERLI_CONTRACT_ADDRESSES[contractName],
  }
}

export const loadJuiceboxV2Contract = async (
  contractName: V2V3ContractName,
  network: NetworkName,
): Promise<ContractJson> => {
  if (network === NetworkName.goerli) {
    return loadJuiceboxV2ContractGoerli(contractName)
  }

  const contractOverride = V2_CONTRACT_ABI_OVERRIDES[contractName]

  const version = contractOverride?.version ?? 'latest'
  const filename = contractOverride?.filename ?? contractName
  const contractJson = (await import(
    `@jbx-protocol/contracts-v2-${version}/deployments/${network}/${filename}.json`
  )) as ContractJson

  const address = contractOverride?.addresses?.[network] ?? contractJson.address

  return {
    ...contractJson,
    address,
  }
}
