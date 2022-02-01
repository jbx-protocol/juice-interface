import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { BigNumber, constants } from 'ethers'
import { TicketMod } from 'models/mods'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useSetTicketModsTx(): TransactorInstance<{
  configured: BigNumber
  ticketMods: TicketMod[]
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId, terminal } = useContext(V1ProjectContext)

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
        projectId.toHexString(),
        configured.toHexString(),
        ticketMods.map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
        })),
      ],
      txOpts,
    )
  }
}
