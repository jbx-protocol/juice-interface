import { t } from '@lingui/macro'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { BigNumber } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/useTransactor'
import invariant from 'tiny-invariant'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useTransferTokensTx(): TransactorInstance<{
  amount: BigNumber
  to: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { userAddress } = useWallet()
  const { tokenSymbol } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return ({ amount, to }, txOpts) => {
    try {
      invariant(transactor && projectId && contracts?.Projects)

      return transactor(
        contracts.TicketBooth,
        'transfer',
        [
          userAddress,
          BigNumber.from(projectId).toHexString(),
          amount.toHexString(),
          to,
        ],
        {
          ...txOpts,
          title: t`Transfer unclaimed ${tokenSymbolText({
            tokenSymbol,
            plural: true,
          })}`,
        },
      )
    } catch {
      const missingParam = !transactor
        ? 'transactor'
        : !projectId
        ? 'projectId'
        : !contracts?.Projects
        ? 'contracts.Projects'
        : !amount
        ? 'amount'
        : !to
        ? 'to'
        : undefined

      return handleTransactionException({
        txOpts,
        missingParam,
        functionName: 'transfer',
        cv: '1',
      })
    }
  }
}
