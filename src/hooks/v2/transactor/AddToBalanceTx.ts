import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { TransactorInstance } from '../../Transactor'
import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'

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
      [projectId.toHexString(), value, ETH_TOKEN_ADDRESS, DEFAULT_MEMO],
      {
        ...txOpts,
        value,
      },
    )
  }
}
