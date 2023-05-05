import { ContractInterface } from 'ethers'

export interface ContractJson {
  address: string | undefined
  abi: ContractInterface | undefined
}

export interface ForgeDeploy {
  receipts: { contractAddress: string }[]
  transactions: { contractName: string; contractAddress: string }[]
}
