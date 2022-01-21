import { Contract } from '@ethersproject/contracts'

export enum JuiceboxV1ContractName {
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

export type JuiceboxV1Contracts = Record<JuiceboxV1ContractName, Contract>
