import axios from 'axios'
import { NetworkName } from 'models/network-name'
import { getEtherscanApiUrl } from 'utils/etherscan'

import { FlattenedJBETHERC20ProjectPayer } from './FlattenedJBETHERC20ProjectPayer'

export async function verifyProjectPayer({
  contractAddress,
  networkName,
}: {
  contractAddress: string
  networkName: NetworkName
}) {
  console.info('!! begin verify')
  // const contractName = V2ContractName.JBETHERC20ProjectPayer
  // const reader = new FileReader()

  console.info(
    'FlattenedJBETHERC20ProjectPayer: ',
    FlattenedJBETHERC20ProjectPayer,
  )

  const data = {
    apikey: 'EGEHSB12MUCRPKB9918314DIA7P8DAB368',
    module: 'contract',
    action: 'verifysourcecode',
    sourceCode: FlattenedJBETHERC20ProjectPayer,
    contractaddress: contractAddress,
    codeformat: 'solidity-single-file',
    contractname: 'JBETHERC20ProjectPayer',
    compilerversion: 'v0.7.6+commit.7338295f',
    optimizationused: 1,
    // runs:200
    // constructorArguements:0xfce353f66162630000000000000000000000000
    // evmversion://leave blank for compiler default
    // licenseType:1
    // libraryname1:'SafeMath'
    // libraryaddress1:'0xCfE28868F6E0A24b7333D22D8943279e76aC2cdc'
  }

  const etherscanBaseUrl = getEtherscanApiUrl(networkName)

  console.info(
    `calling ${etherscanBaseUrl}/api with \n data: ${JSON.stringify(data)}`,
  )

  const response = await axios.post(``, data)
  console.info('!!etherscan verify response; ', response)
  return response.data
}
