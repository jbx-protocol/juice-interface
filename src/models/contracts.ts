import { InterfaceAbi } from 'ethers'

export interface ContractJson {
  address: string | undefined
  abi: InterfaceAbi | undefined
}

export interface ForgeDeploy {
  receipts: { contractAddress: string }[]
  transactions: { contractName: string; contractAddress: string }[]
}
