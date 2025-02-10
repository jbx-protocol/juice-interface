import { ContractInterface } from '@ethersproject/contracts'

export interface ContractJson {
  address: string | undefined
  abi: ContractInterface | undefined
}

export interface ForgeDeploy {
  receipts: { contractAddress: string }[]
  transactions: { contractName: string; contractAddress: string }[]
}
