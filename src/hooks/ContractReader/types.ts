import { Contract, EventFilter } from '@ethersproject/contracts'

export type ContractConfig<ContractName extends string> =
  | ContractName
  | Contract
  | undefined

export type ContractUpdateOn<C extends string> = {
  contract?: C | Contract | undefined
  eventName?: string
  topics?: EventFilter['topics']
}
