import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber, constants } from 'ethers'
import { PayoutMod } from 'models/mods'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useSetPayoutModsTx(): TransactorInstance<{
  configured: BigNumber
  payoutMods: PayoutMod[]
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId, terminal } = useContext(ProjectContext)

  return ({ configured, payoutMods }, txOpts) => {
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
      'setPayoutMods',
      [
        projectId.toHexString(),
        configured.toHexString(),
        payoutMods.map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
          projectId: m.projectId || BigNumber.from(0).toHexString(),
          allocator: constants.AddressZero,
        })),
      ],
      txOpts,
    )
  }
}
