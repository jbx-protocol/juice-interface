import { BigNumber } from '@ethersproject/bignumber'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { ProjectMetadata } from 'models/project-metadata'
import { ProjectType } from 'models/project-type'
import { createContext } from 'react'

export type ProjectContext = {
  projectId: BigNumber | undefined
  projectType: ProjectType | undefined
  createdAt: number | undefined
  handle: string | undefined
  metadata: ProjectMetadata | undefined
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
  balanceInCurrency: BigNumber | undefined
  isPreviewMode: boolean | undefined
}

export const ProjectContext = createContext<ProjectContext>({
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
  balanceInCurrency: undefined,
  isPreviewMode: false,
})
