import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { onCatch, TransactorInstance } from 'hooks/Transactor'
import invariant from 'tiny-invariant'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useMintTokensTx(): TransactorInstance<{
  value: BigNumber
  beneficiary: string
  preferClaimed: boolean
  memo: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId, tokenSymbol, cv } = useContext(V2ProjectContext)

  // TODO new V2 feature:
  // Whether to use the current funding cycle's reserved rate in the mint calculation.
  const reservedRate = true

  return ({ value, beneficiary, preferClaimed, memo }, txOpts) => {
    try {
      invariant(transactor && projectId && contracts)
      return transactor(
        contracts?.JBController,
        'mintTokensOf',
        [
          projectId,
          value.toHexString(),
          beneficiary,
          memo ?? '',
          preferClaimed,
          reservedRate,
        ],
        {
          ...txOpts,
          title: t`Mint ${tokenSymbolText({
            tokenSymbol,
            plural: true,
          })}`,
        },
      )
    } catch {
      const missingParam = !transactor
        ? 'transactor'
        : !contracts
        ? 'contracts'
        : !projectId
        ? 'projectId'
        : undefined

      return onCatch({
        txOpts,
        missingParam,
        functionName: 'mintTokensOf',
        cv,
      })
    }
  }
}
