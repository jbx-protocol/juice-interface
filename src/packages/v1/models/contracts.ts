import { Contract } from 'ethers'

export enum V1ContractName {
  FundingCycles = 'FundingCycles',
  TerminalV1 = 'TerminalV1',
  TerminalV1_1 = 'TerminalV1_1',
  TerminalDirectory = 'TerminalDirectory',
  ModStore = 'ModStore',
  OperatorStore = 'OperatorStore',
  Projects = 'Projects',
  TicketBooth = 'TicketBooth',
}

export type V1Contracts = Record<V1ContractName, Contract>
