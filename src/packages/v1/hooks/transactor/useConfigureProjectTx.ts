import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { constants } from 'ethers'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { V1UserContext } from 'packages/v1/contexts/User/V1UserContext'

import { BigNumber } from 'ethers'
import { TransactorInstance } from 'hooks/useTransactor'
import {
  V1FundingCycleMetadata,
  V1FundingCycleProperties,
} from 'packages/v1/models/fundingCycle'
import { PayoutMod, TicketMod } from 'packages/v1/models/mods'
import { useContext } from 'react'

import { useV1ProjectTitle } from '../useProjectTitle'

export function useConfigureProjectTx(): TransactorInstance<{
  fcProperties: V1FundingCycleProperties
  fcMetadata: Omit<V1FundingCycleMetadata, 'version'>
  payoutMods: PayoutMod[]
  ticketMods: TicketMod[]
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { terminal } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV1ProjectTitle()

  return ({ fcProperties, fcMetadata, payoutMods, ticketMods }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.Projects ||
      !terminal?.version
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const properties: Record<keyof V1FundingCycleProperties, string> = {
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
        BigNumber.from(projectId).toHexString(),
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
      {
        ...txOpts,
        title: t`Edit ${projectTitle}`,
      },
    )
  }
}
