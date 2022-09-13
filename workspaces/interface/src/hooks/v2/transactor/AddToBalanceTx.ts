import { BigNumber } from '@ethersproject/bignumber'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'
import { TransactorInstance } from 'hooks/Transactor'

const DEFAULT_METADATA = 0

export function useAddToBalanceTx(): TransactorInstance<{
  value: BigNumber
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  const DEFAULT_MEMO = ''

  return ({ value }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBETHPaymentTerminal) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts?.JBETHPaymentTerminal,
      'addToBalanceOf',
      [projectId, value, ETH_TOKEN_ADDRESS, DEFAULT_MEMO, DEFAULT_METADATA],
      {
        ...txOpts,
        value,
      },
    )
  }
}
