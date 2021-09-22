import { Contract } from '@ethersproject/contracts'
import { ContractName } from 'models/contract-name'

export type Contracts = Record<ContractName, Contract>
