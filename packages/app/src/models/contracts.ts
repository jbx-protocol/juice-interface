import { Contract } from '@ethersproject/contracts'

import { ContractName } from 'constants/contract-name'

export type Contracts = Record<ContractName, Contract>
