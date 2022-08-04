import axios from 'axios'
import { getEtherscanBaseUrl } from 'components/EtherscanLink'
import { NetworkName } from 'models/network-name'
import { V2ContractName } from 'models/v2/contracts'

export async function verifyProjectPayer({
  contractAddress,
  networkName,
}: {
  contractAddress: string
  networkName: NetworkName
}) {
  const contractName = V2ContractName.JBETHERC20ProjectPayer
  const sourceCode = '' // TODO: sourceCode
  const data = {
    apikey: 'EGEHSB12MUCRPKB9918314DIA7P8DAB368',
    module: 'contract',
    action: 'verifysourcecode',
    sourceCode: sourceCode,
    contractaddress: contractAddress,
    codeformat: 'solidity-single-file',
    contractname: contractName,
    compilerversion: 'v0.7.6+commit.7338295f',
    optimizationused: 1,
    // runs:200
    // constructorArguements:0xfce353f66162630000000000000000000000000
    // evmversion://leave blank for compiler default
    // licenseType:1
    // libraryname1:'SafeMath'
    // libraryaddress1:'0xCfE28868F6E0A24b7333D22D8943279e76aC2cdc'
  }

  const etherscanBaseUrl = getEtherscanBaseUrl(networkName)

  const response = await axios.post(`${etherscanBaseUrl}/api`, data)
  console.info('etherscan verify response; ', response)
  return response.data
}
