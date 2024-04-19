import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'

import { TransactorInstance } from 'hooks/useTransactor'
import {
  V1FundingCycleMetadata,
  V1FundingCycleProperties,
} from 'models/v1/fundingCycle'
import { PayoutMod, TicketMod } from 'models/v1/mods'
import { useContext } from 'react'

import { ethers } from 'ethers'
import { toHexString } from 'utils/bigNumbers'
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
      target: toHexString(fcProperties.target),
      currency: toHexString(fcProperties.currency),
      duration: toHexString(fcProperties.duration),
      discountRate: toHexString(fcProperties.discountRate),
      cycleLimit: toHexString(fcProperties.cycleLimit),
      ballot: fcProperties.ballot,
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'configure',
      [
        toHexString(BigInt(projectId)),
        properties,
        fcMetadata,
        payoutMods.map(m => ({
          preferUnstaked: false,
          percent: toHexString(BigInt(m.percent)),
          lockedUntil: toHexString(BigInt(m.lockedUntil ?? 0)),
          beneficiary: m.beneficiary || ethers.ZeroAddress,
          projectId: m.projectId || toHexString(BigInt(0)),
          allocator: ethers.ZeroAddress,
        })),
        ticketMods.map(m => ({
          preferUnstaked: false,
          percent: toHexString(BigInt(m.percent)),
          lockedUntil: toHexString(BigInt(m.lockedUntil ?? 0)),
          beneficiary: m.beneficiary || ethers.ZeroAddress,
          allocator: ethers.ZeroAddress,
        })),
      ],
      {
        ...txOpts,
        title: t`Edit ${projectTitle}`,
      },
    )
  }
}
