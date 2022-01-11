import { BigNumber } from '@ethersproject/bignumber'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { ProjectMetadataV3 } from 'models/project-metadata'
import { ProjectType } from 'models/project-type'
import { TerminalVersion } from 'models/terminal-version'
import { createContext } from 'react'

export type ProjectContextType = {
  projectId: BigNumber | undefined
  projectType: ProjectType | undefined
  createdAt: number | undefined
  handle: string | undefined
  metadata: ProjectMetadataV3 | undefined
  owner: string | undefined // owner address
  earned: BigNumber | undefined
  currentFC: FundingCycle | undefined
  queuedFC: FundingCycle | undefined
  currentPayoutMods: PayoutMod[] | undefined
  currentTicketMods: TicketMod[] | undefined
  queuedPayoutMods: PayoutMod[] | undefined
  queuedTicketMods: TicketMod[] | undefined
  tokenSymbol: string | undefined
  tokenAddress: string | undefined
  balance: BigNumber | undefined
  balanceInCurrency: BigNumber | undefined
  isPreviewMode: boolean | undefined
  isArchived: boolean | undefined
  terminal:
    | {
        version: TerminalVersion | undefined
        address: string | undefined
        name: ContractName | undefined
      }
    | undefined
}

export const ProjectContext = createContext<ProjectContextType>({
  projectId: undefined,
  projectType: 'standard',
  createdAt: undefined,
  handle: undefined,
  metadata: undefined,
  owner: undefined,
  earned: undefined,
  currentFC: undefined,
  queuedFC: undefined,
  currentPayoutMods: undefined,
  currentTicketMods: undefined,
  queuedPayoutMods: undefined,
  queuedTicketMods: undefined,
  tokenAddress: undefined,
  tokenSymbol: undefined,
  balance: undefined,
  balanceInCurrency: undefined,
  isPreviewMode: false,
  isArchived: false,
  terminal: undefined,
})
