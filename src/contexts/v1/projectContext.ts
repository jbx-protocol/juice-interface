import { BigNumber } from '@ethersproject/bignumber'
import { PayoutMod, TicketMod } from 'models/mods'
import { ProjectType } from 'models/project-type'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { V1TerminalName, V1TerminalVersion } from 'models/v1/terminals'
import { createContext } from 'react'

export type V1ProjectContextType = {
  projectType: ProjectType | undefined
  createdAt: number | undefined
  handle: string | undefined
  owner: string | undefined // owner address
  earned: BigNumber | undefined
  currentFC: V1FundingCycle | undefined
  queuedFC: V1FundingCycle | undefined
  currentPayoutMods: PayoutMod[] | undefined
  currentTicketMods: TicketMod[] | undefined
  queuedPayoutMods: PayoutMod[] | undefined
  queuedTicketMods: TicketMod[] | undefined
  tokenSymbol: string | undefined
  tokenAddress: string | undefined
  balance: BigNumber | undefined
  balanceInCurrency: BigNumber | undefined
  overflow: BigNumber | undefined
  isPreviewMode: boolean | undefined
  terminal:
    | {
        version: V1TerminalVersion | undefined
        address: string | undefined
        name: V1TerminalName | undefined
      }
    | undefined
}

export const V1ProjectContext = createContext<V1ProjectContextType>({
  projectType: 'standard',
  createdAt: undefined,
  handle: undefined,
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
  overflow: undefined,
  isPreviewMode: false,
  terminal: undefined,
})
