import { t } from '@lingui/macro'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { BigNumber } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useRedeemTokensTx(): TransactorInstance<{
  redeemAmount: BigNumber
  minAmount: BigNumber
  preferConverted: boolean
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { terminal, tokenSymbol } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()

  return ({ redeemAmount, minAmount, preferConverted }, txOpts) => {
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
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'redeem',
      [
        userAddress,
        BigNumber.from(projectId).toHexString(),
        redeemAmount.toHexString(),
        minAmount.toHexString(),
        userAddress,
        preferConverted,
      ],
      {
        ...txOpts,
        title: t`Redeem ${tokenSymbolText({
          tokenSymbol,
          plural: true,
        })}`,
      },
    )
  }
}
