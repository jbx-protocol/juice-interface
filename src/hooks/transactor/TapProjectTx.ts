import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'

import { CurrencyOption } from 'models/currency-option'

import { TransactorInstance } from './Transactor'

export function useTapProjectTx(): TransactorInstance<{
  tapAmount: BigNumber
  minAmount: BigNumber
  currency: CurrencyOption
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId, terminal } = useContext(ProjectContext)

  return ({ tapAmount, minAmount, currency }, txOpts) => {
    if (
      !transactor ||
      !userAddress ||
      !projectId ||
      !contracts?.Projects ||
      !terminal?.version
    ) {
      if (txOpts?.onDone) txOpts.onDone()
      return Promise.resolve(false)
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'tap',
      [
        projectId.toHexString(),
        tapAmount.toHexString(),
        currency,
        minAmount?.toHexString(),
      ],
      txOpts,
    )
  }
}
