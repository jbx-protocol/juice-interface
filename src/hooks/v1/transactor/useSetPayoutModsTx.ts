import { t } from '@lingui/macro'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { constants } from 'ethers'

import { BigNumber } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import { TransactorInstance } from 'hooks/useTransactor'
import { PayoutMod } from 'models/v1/mods'
import { useContext } from 'react'
import { useV1ProjectTitle } from '../useProjectTitle'

export function useSetPayoutModsTx(): TransactorInstance<{
  configured: BigNumber
  payoutMods: PayoutMod[]
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { terminal } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV1ProjectTitle()
  const { userAddress } = useWallet()

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
        BigNumber.from(projectId).toHexString(),
        configured.toHexString(),
        payoutMods.map(m => ({
          preferUnstaked: false,
          percent: BigNumber.from(m.percent).toHexString(),
          lockedUntil: BigNumber.from(m.lockedUntil ?? 0).toHexString(),
          beneficiary: m.beneficiary || constants.AddressZero,
          projectId: m.projectId || BigNumber.from(0).toHexString(),
          allocator: m.allocator ?? NULL_ALLOCATOR_ADDRESS,
        })),
      ],
      {
        ...txOpts,
        title: t`Set payouts of ${projectTitle}`,
      },
    )
  }
}
