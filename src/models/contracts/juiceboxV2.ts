import { Contract } from '@ethersproject/contracts'

export enum JuiceboxV2ContractName {
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

export type JuiceboxV2Contracts = Record<JuiceboxV2ContractName, Contract>
