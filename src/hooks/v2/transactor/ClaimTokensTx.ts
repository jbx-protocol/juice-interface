import { NetworkContext } from 'contexts/networkContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { handleTransact } from 'utils/transactor'

export function useClaimTokensTx(): TransactorInstance<{
  claimAmount: BigNumber
}> {
  const { transactor, contracts, version } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ claimAmount }, txOpts) => {
    return handleTransact({
      transactor,
      contract: contracts?.JBTokenStore,
      fnName: 'claimFor',
      args: [userAddress, projectId, claimAmount.toHexString()],
      txOpts,
      version,
      optionalArgs: [],
    })
  }
}
