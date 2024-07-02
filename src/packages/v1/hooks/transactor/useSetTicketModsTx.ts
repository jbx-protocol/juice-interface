import { t } from '@lingui/macro'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { V1UserContext } from 'packages/v1/contexts/User/V1UserContext'

import { useWallet } from 'hooks/Wallet'
import { TicketMod } from 'packages/v1/models/mods'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { ethers } from 'ethers'
import { TransactorInstance } from 'hooks/useTransactor'
import { toHexString } from 'utils/bigNumbers'
import { useV1ProjectTitle } from '../useProjectTitle'

export function useSetTicketModsTx(): TransactorInstance<{
  configured: bigint
  ticketMods: TicketMod[]
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { userAddress } = useWallet()
  const { terminal } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV1ProjectTitle()

  return ({ configured, ticketMods }, txOpts) => {
    if (
      !transactor ||
      !userAddress ||
      !projectId ||
      !contracts?.Projects ||
      !terminal?.version
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.ModStore,
      'setTicketMods',
      [
        toHexString(BigInt(projectId)),
        toHexString(configured),
        ticketMods.map(m => ({
          preferUnstaked: false,
          percent: toHexString(BigInt(m.percent)),
          lockedUntil: toHexString(BigInt(m.lockedUntil ?? 0)),
          beneficiary: m.beneficiary || ethers.ZeroAddress,
        })),
      ],
      {
        ...txOpts,
        title: t`Set reserved tokens of ${projectTitle}`,
      },
    )
  }
}
