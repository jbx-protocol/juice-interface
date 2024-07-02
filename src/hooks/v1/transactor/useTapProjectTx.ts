import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { useContext } from 'react'

import { V1CurrencyOption } from 'models/v1/currencyOption'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { toHexString } from 'utils/bigNumbers'
import { useV1ProjectTitle } from '../useProjectTitle'

export function useTapProjectTx(): TransactorInstance<{
  tapAmount: bigint
  minAmount: bigint
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
        toHexString(BigInt(projectId)),
        toHexString(tapAmount),
        currency,
        minAmount ? toHexString(minAmount) : undefined,
      ],
      {
        ...txOpts,
        title: t`Tap ${projectTitle}`,
      },
    )
  }
}
