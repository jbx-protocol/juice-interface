/**
 * A script to generate a selection of typescript files that contain the ABI and address of JB contracts.
 * 
 * Behaviour differs slightly, depending on what contract we're importing.
 * 
 * The idea is: instead asyncronously importing the JSON files at runtime, we bundle them into a TS file, and import that instead.
 * This way:
 * - we reduce the number of individual files that Next/webpack builds
 * - we save on some total bundle size (the total TS files < the total JSON files)
 * - src code is simpler to read and understand
 */

const fs = require('fs')

const core = [
  'JBDirectory',
  'JBProjects',
  'JBFundingCycleStore',
  'JBFundAccessConstraintsStore',
  'JBOperatorStore',
  'JBSplitsStore',
  'JBTokenStore',
  'JBSingleTokenPaymentTerminalStore',
  'JBSingleTokenPaymentTerminalStore3_1',
  'JBSingleTokenPaymentTerminalStore3_1_1',
  'JBETHERC20ProjectPayerDeployer',
  'JBController',
  'JBController3_1',
  'JBETHPaymentTerminal',
  'JBETHPaymentTerminal3_1',
  'JBETHPaymentTerminal3_1_1',
  'JBETHPaymentTerminal3_1_2',
]

const coreV1 = [
  'FundingCycles',
  'TerminalV1',
  'TerminalV1_1',
  'TerminalDirectory',
  'ModStore',
  'OperatorStore',
  'Projects',
  'TicketBooth',
]

const juice721DelegateInterfaces = [
  'JB721TieredGovernance',
  'IJBTiered721DelegateStore',
  'IJBTiered721Delegate',
  'IJBTiered721DelegateProjectDeployer',
]

const V2_ADDRESS_OVERRIDES = {
  JBETHERC20ProjectPayerDeployer: {
    /**
     * This deployment of the JBETHERC20ProjectPayerDeployer has slightly different
     * internals to the one in the contracts-v2-latest package.
     *
     * It sets the beneficiary to tx.origin, instead of msg.sender.
     *
     * It was only deployed on mainnet, so we'll override it for mainnet only.
     */
    addresses: {
      mainnet: '0x325Ba0eFC2c750e0317561e79cFa6911e29B24CC',
    },
  },
  JBOperatorStore: {
    addresses: {
      sepolia: '0x8f63c744c0280ef4b32af1f821c65e0fd4150ab3',
    },
  },
  JBProjects: {
    addresses: {
      sepolia: '0x43CB8FCe4F0d61579044342A5d5A027aB7aE4D63',
    },
  },
  JBDirectory: {
    addresses: {
      sepolia: '0x3B3Bd16cc76cd53218e00b600bFCa27aA5057794',
    },
  },
  JBFundingCycleStore: {
    addresses: {
      sepolia: '0xCb881e166d527010B9eF11159b487f907040D7C4',
    },
  },
  JBTokenStore: {
    addresses: {
      sepolia: '0x25fdda0eBD9e979b8c1657780045Cf87392a14E4',
    },
  },
  JBSplitsStore: {
    addresses: {
      sepolia: '0xEdE89dB755855aF041b5f100B39db9324b5227Ac',
    },
  },
  JBController: {
    addresses: {
      sepolia: '0x0c750ac5805AC3357b72554e3AE70840BBD09A98',
    },
  },
  JBSingleTokenPaymentTerminalStore: {
    addresses: {
      sepolia: '0x981c8ECD009E3E84eE1fF99266BF1461a12e5c68',
    },
  },
  JBETHPaymentTerminal: {
    addresses: {
      sepolia: '0x55FF1D8093166c1fF9664efd613D8C543b95feFc',
    },
  },
}

const importV3Contract = (contract, network) => {
  try {
    const jsonData = require(`@jbx-protocol/juice-contracts-v3/deployments/${network}/${contract}.json`)
    return {
      address: jsonData.address,
      abi: jsonData.abi,
    }
  } catch (e) {
    return null
  }
}

const importV2Contract = (contract, network) => {
  try {
    // load the mainnet abi for v2. Sepolia addresses supplied in V2_ADDRESS_OVERRIDES
    const jsonData = require(`@jbx-protocol/contracts-v2-latest/deployments/mainnet/${contract}.json`)
    return {
      address:
        V2_ADDRESS_OVERRIDES[contract]?.addresses?.[network] ??
        jsonData.address,
      abi: jsonData.abi,
    }
  } catch (e) {
    return null
  }
}

const importV1Contract = (contract, network) => {
  try {
    const jsonData = require(`@jbx-protocol/contracts-v1/deployments/${network}/${contract}.json`)
    return {
      address: jsonData.address,
      abi: jsonData.abi,
    }
  } catch (e) {
    return null
  }
}

const importJuice721DelegateInterface = (interfaceName, version) => {
  try {
    const jsonData = require(`@jbx-protocol/juice-721-delegate-v${version}/out/${interfaceName}.sol/${interfaceName}.json`)
    return {
      abi: jsonData.abi,
    }
  } catch (e) {
    return null
  }
}

const importJuice721DelegateDeployment = (version, chainId) => {
  try {
    const jsonData = require(`@jbx-protocol/juice-721-delegate-v${version}/broadcast/Deploy.s.sol/${chainId}/run-latest.json`)
    return {
      transactions: jsonData.transactions.map(t => {
        return {
          contractName: t.contractName,
          contractAddress: t.contractAddress,
        }
      }),
    }
  } catch (e) {
    return null
  }
}

const codegenJuice721DelegateInterfaces = version => {
  return juice721DelegateInterfaces
    .map(contract => ({
      name: contract,
      contract: importJuice721DelegateInterface(contract, version),
    }))
    .map(({ name, contract }) => {
      if (!contract) {
        return null
      }

      return `export const ${name} = {
      address: undefined,
  abi: ${JSON.stringify(contract.abi)}
  } as const`
    })
    .filter(Boolean)
    .join('\n')
}


const codegenJuice721DelegateDeployment = (version) => {
  // mainnnet, sepolia
  return [1, 11155111]
    .map(chainId => ({chainId, deployment: importJuice721DelegateDeployment(version, chainId)}))
    .map((data) => {
      if (!data?.deployment) {
        return null
      }

      return `export const chain${data.chainId} = ${JSON.stringify(data.deployment)} as const`
    })
    .filter(Boolean)
    .join('\n')
}


const codegenV1 = network => {
  return coreV1
    .map(contract => ({
      name: contract,
      contract: importV1Contract(contract, network),
    }))
    .map(({ name, contract }) => {
      if (!contract) {
        return null
      }

      return `export const ${name} = {
  address: '${contract.address}',
  abi: ${JSON.stringify(contract.abi)}
  } as const`
    })
    .filter(Boolean)
    .join('\n')
}

const codegenV2 = network => {
  return core
    .map(contract => ({
      name: contract,
      contract: importV2Contract(contract, network),
    }))
    .map(({ name, contract }) => {
      if (!contract) {
        return null
      }

      return `export const ${name} = {
  address: '${contract.address}',
  abi: ${JSON.stringify(contract.abi)}
  } as const`
    })
    .filter(Boolean)
    .join('\n')
}

const codegenV3 = network => {
  return core
    .map(contract => ({
      name: contract,
      contract: importV3Contract(contract, network),
    }))
    .map(({ name, contract }) => {
      if (!contract) {
        return null
      }

      return `export const ${name} = {
  address: '${contract.address}',
  abi: ${JSON.stringify(contract.abi)}
  } as const`
    })
    .filter(Boolean)
    .join('\n')
}

// eslint-disable-next-line no-console
console.log('🧃 Generating Typescript files for contract deployment JSONs...')

const mainnetV1 = codegenV1('mainnet')
const mainnetV2 = codegenV2('mainnet')
const sepoliaV2 = codegenV2('sepolia')
const mainnetV3 = codegenV3('mainnet')
const sepoliaV3 = codegenV3('sepolia')

const juice721DelegateInterfacesV3 = codegenJuice721DelegateInterfaces('3')
const juice721DelegateInterfacesV3_1 = codegenJuice721DelegateInterfaces('3-1')
const juice721DelegateInterfacesV3_2 = codegenJuice721DelegateInterfaces('3-2')
const juice721DelegateInterfacesV3_3 = codegenJuice721DelegateInterfaces('3-3')
const juice721DelegateInterfacesV3_4 = codegenJuice721DelegateInterfaces('3-4')

const juice721DelegateDeploymentV3 = codegenJuice721DelegateDeployment('3')
const juice721DelegateDeploymentV3_1 = codegenJuice721DelegateDeployment('3-1')
const juice721DelegateDeploymentV3_2 = codegenJuice721DelegateDeployment('3-2')
const juice721DelegateDeploymentV3_3 = codegenJuice721DelegateDeployment('3-3')
const juice721DelegateDeploymentV3_4 = codegenJuice721DelegateDeployment('3-4')

fs.writeFileSync(
  'src/packages/v1/contexts/User/juice-contracts-v1-mainnet.ts',
  mainnetV1,
)

fs.writeFileSync(
  'src/packages/v2v3/utils/contractLoaders/contracts/juice-contracts-v2-mainnet.ts',
  mainnetV2,
)
fs.writeFileSync(
  'src/packages/v2v3/utils/contractLoaders/contracts/juice-contracts-v2-sepolia.ts',
  sepoliaV2,
)

fs.writeFileSync(
  'src/packages/v2v3/utils/contractLoaders/contracts/juice-contracts-v3-mainnet.ts',
  mainnetV3,
)
fs.writeFileSync(
  'src/packages/v2v3/utils/contractLoaders/contracts/juice-contracts-v3-sepolia.ts',
  sepoliaV3,
)

fs.writeFileSync(
  'src/packages/v2v3/hooks/JB721Delegate/contracts/interfaceAbis/juice-721-delegate-interfaces-v3.ts',
  juice721DelegateInterfacesV3,
)
fs.writeFileSync(
  'src/packages/v2v3/hooks/JB721Delegate/contracts/interfaceAbis/juice-721-delegate-interfaces-v3-1.ts',
  juice721DelegateInterfacesV3_1,
)
fs.writeFileSync(
  'src/packages/v2v3/hooks/JB721Delegate/contracts/interfaceAbis/juice-721-delegate-interfaces-v3-2.ts',
  juice721DelegateInterfacesV3_2,
)
fs.writeFileSync(
  'src/packages/v2v3/hooks/JB721Delegate/contracts/interfaceAbis/juice-721-delegate-interfaces-v3-3.ts',
  juice721DelegateInterfacesV3_3,
)
fs.writeFileSync(
  'src/packages/v2v3/hooks/JB721Delegate/contracts/interfaceAbis/juice-721-delegate-interfaces-v3-4.ts',
  juice721DelegateInterfacesV3_4,
)

fs.writeFileSync(
  'src/packages/v2v3/hooks/JB721Delegate/contracts/interfaceAbis/juice-721-delegate-interfaces-v3.ts',
  juice721DelegateInterfacesV3,
)

fs.writeFileSync(
  'src/packages/v2v3/hooks/JB721Delegate/contracts/deployments/juice-721-delegate-deployment-v3.ts',
  juice721DelegateDeploymentV3,
)

fs.writeFileSync(
  'src/packages/v2v3/hooks/JB721Delegate/contracts/deployments/juice-721-delegate-deployment-v3-1.ts',
  juice721DelegateDeploymentV3_1,
)
fs.writeFileSync(
  'src/packages/v2v3/hooks/JB721Delegate/contracts/deployments/juice-721-delegate-deployment-v3-2.ts',
  juice721DelegateDeploymentV3_2,
)
fs.writeFileSync(
  'src/packages/v2v3/hooks/JB721Delegate/contracts/deployments/juice-721-delegate-deployment-v3-3.ts',
  juice721DelegateDeploymentV3_3,
)
fs.writeFileSync(
  'src/packages/v2v3/hooks/JB721Delegate/contracts/deployments/juice-721-delegate-deployment-v3-4.ts',
  juice721DelegateDeploymentV3_4,
)



// eslint-disable-next-line no-console
console.log('🧃 Done')
