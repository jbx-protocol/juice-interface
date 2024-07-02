import { t } from '@lingui/macro'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { V1UserContext } from 'packages/v1/contexts/User/V1UserContext'

import { ethers } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import { TransactorInstance } from 'hooks/useTransactor'
import { PayoutMod } from 'packages/v1/models/mods'
import { useContext } from 'react'
import { toHexString } from 'utils/bigNumbers'
import { useV1ProjectTitle } from '../useProjectTitle'

export function useSetPayoutModsTx(): TransactorInstance<{
  configured: bigint
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
        toHexString(BigInt(projectId)),
        toHexString(configured),
        payoutMods.map(m => ({
          preferUnstaked: false,
          percent: toHexString(BigInt(m.percent)),
          lockedUntil: toHexString(BigInt(m.lockedUntil ?? 0)),
          beneficiary: m.beneficiary || ethers.ZeroAddress,
          projectId: m.projectId || toHexString(BigInt(0)),
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
