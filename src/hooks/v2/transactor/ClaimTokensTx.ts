import { NetworkContext } from 'contexts/networkContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { handleTransactor } from 'utils/transactorHelper'

export function useClaimTokensTx(): TransactorInstance<{
  claimAmount: BigNumber
}> {
  const { transactor, contracts, version } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ claimAmount }, txOpts) => {
    return handleTransactor({
      args: [userAddress, projectId, claimAmount.toHexString()],
      contract: contracts?.JBTokenStore,
      fnName: 'claimFor',
      transactor,
      txOpts,
      version,
    })
  }
}
