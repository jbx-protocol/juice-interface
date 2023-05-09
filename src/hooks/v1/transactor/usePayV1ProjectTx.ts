import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { BigNumber } from 'ethers'
import { TransactorInstance } from 'hooks/useTransactor'
import { useV1ProjectTitle } from '../useProjectTitle'

export function usePayV1ProjectTx(): TransactorInstance<{
  note: string
  preferUnstaked: boolean
  value: BigNumber
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { terminal } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV1ProjectTitle()
  const { userAddress } = useWallet()

  return ({ note, preferUnstaked, value }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.TicketBooth ||
      !terminal?.version
    ) {
      const missingParam = !transactor
        ? 'transactor'
        : !projectId
        ? 'projectId'
        : !contracts?.TicketBooth
        ? 'contracts.TicketBooth'
        : !terminal?.version
        ? 'terminal.version'
        : null

      txOpts?.onError?.(
        new DOMException(
          `Missing ${missingParam ?? 'parameter not found'} in v1 transactor`,
        ),
      )
      return Promise.resolve(false)
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'pay',
      [
        BigNumber.from(projectId).toHexString(),
        userAddress,
        note || '',
        preferUnstaked,
      ],
      {
        ...txOpts,
        value: value.toHexString(),
        title: t`Pay ${projectTitle}`,
      },
    )
  }
}
