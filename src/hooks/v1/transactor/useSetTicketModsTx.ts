import { t } from '@lingui/macro'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { constants } from 'ethers'

import { BigNumber } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import { TicketMod } from 'models/v1/mods'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { useV1ProjectTitle } from '../useProjectTitle'

export function useSetTicketModsTx(): TransactorInstance<{
  configured: BigNumber
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
        BigNumber.from(projectId).toHexString(),
        configured.toHexString(),
        ticketMods.map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
        })),
      ],
      {
        ...txOpts,
        title: t`Set reserved tokens of ${projectTitle}`,
      },
    )
  }
}
