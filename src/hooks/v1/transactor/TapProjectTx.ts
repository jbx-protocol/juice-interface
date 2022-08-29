import { BigNumber } from '@ethersproject/bignumber'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContext } from 'react'

import { V1CurrencyOption } from 'models/v1/currencyOption'

import { TransactorInstance } from '../../Transactor'

export function useTapProjectTx(): TransactorInstance<{
  tapAmount: BigNumber
  minAmount: BigNumber
  currency: V1CurrencyOption
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId, terminal } = useContext(V1ProjectContext)

  return ({ tapAmount, minAmount, currency }, txOpts) => {
    if (
      !transactor ||
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
      'tap',
      [
        BigNumber.from(projectId).toHexString(),
        tapAmount.toHexString(),
        currency,
        minAmount?.toHexString(),
      ],
      txOpts,
    )
  }
}
