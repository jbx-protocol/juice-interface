import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber, constants } from 'ethers'
import { FundingCycleMetadata } from 'models/funding-cycle-metadata'
import { FCProperties } from 'models/funding-cycle-properties'
import { PayoutMod, TicketMod } from 'models/mods'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useConfigureProjectTx(): TransactorInstance<{
  fcProperties: FCProperties
  fcMetadata: Omit<FundingCycleMetadata, 'version'>
  payoutMods: PayoutMod[]
  ticketMods: TicketMod[]
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { projectId, terminal } = useContext(ProjectContext)

  return ({ fcProperties, fcMetadata, payoutMods, ticketMods }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.Projects ||
      !terminal?.version
    ) {
      if (txOpts?.onDone) txOpts.onDone()
      return Promise.resolve(false)
    }

    const properties: Record<keyof FCProperties, string> = {
      target: fcProperties.target.toHexString(),
      currency: fcProperties.currency.toHexString(),
      duration: fcProperties.duration.toHexString(),
      discountRate: fcProperties.discountRate.toHexString(),
      cycleLimit: fcProperties.cycleLimit.toHexString(),
      ballot: fcProperties.ballot,
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'configure',
      [
        projectId.toHexString(),
        properties,
        fcMetadata,
        payoutMods.map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
          projectId: m.projectId || BigNumber.from(0).toHexString(),
          allocator: constants.AddressZero,
        })),
        ticketMods.map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
          allocator: constants.AddressZero,
        })),
      ],
      txOpts,
    )
  }
}
