import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import { PayoutMod } from 'models/mods'
import { useContext } from 'react'
import { useV1ProjectTitle } from '../ProjectTitle'

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
