import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'

import { V1CurrencyOption } from 'models/v1/currencyOption'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { useV1ProjectTitle } from '../useProjectTitle'

export function useTapProjectTx(): TransactorInstance<{
  tapAmount: BigNumber
  minAmount: BigNumber
  currency: V1CurrencyOption
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { terminal } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV1ProjectTitle()

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
      {
        ...txOpts,
        title: t`Tap ${projectTitle}`,
      },
    )
  }
}
