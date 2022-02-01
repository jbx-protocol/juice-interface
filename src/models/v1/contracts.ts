import { Contract } from '@ethersproject/contracts'

export enum V1ContractName {
  FundingCycles = 'FundingCycles',
  TerminalV1 = 'TerminalV1',
  TerminalV1_1 = 'TerminalV1_1',
  TerminalDirectory = 'TerminalDirectory',
  ModStore = 'ModStore',
  OperatorStore = 'OperatorStore',
  Prices = 'Prices',
  Projects = 'Projects',
  TicketBooth = 'TicketBooth',
}

export type V1Contracts = Record<V1ContractName, Contract>
