import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { t } from '@lingui/macro'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactorInstance } from 'hooks/Transactor'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function usePrintTokensTx(): TransactorInstance<{
  value: BigNumber
  currency: V1CurrencyOption
  beneficiary: string
  memo: string
  preferUnstaked: boolean
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { terminal, tokenSymbol } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return ({ value, currency, beneficiary, memo, preferUnstaked }, txOpts) => {
    if (!transactor || !contracts || !projectId || !terminal?.version) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    let terminalContract: Contract
    let functionName: string
    let args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any

    switch (terminal.version) {
      case '1':
        terminalContract = contracts.TerminalV1
        functionName = 'printPreminedTickets'
        args = [
          BigNumber.from(projectId).toHexString(),
          value.toHexString(),
          BigNumber.from(currency).toHexString(),
          beneficiary,
          memo ?? '',
          preferUnstaked,
        ]
        break
      case '1.1':
        terminalContract = contracts.TerminalV1_1
        functionName = 'printTickets'
        args = [
          BigNumber.from(projectId).toHexString(),
          value.toHexString(),
          beneficiary,
          memo ?? '',
          preferUnstaked,
        ]
    }

    return transactor(terminalContract, functionName, args, {
      ...txOpts,
      title: t`Mint ${tokenSymbolText({
        tokenSymbol,
        plural: true,
      })}`,
    })
  }
}
