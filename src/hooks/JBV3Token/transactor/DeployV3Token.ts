import { t } from '@lingui/macro'
import { CV_V2 } from 'constants/cv'
import { TransactionContext } from 'contexts/transactionContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useLoadV2V3Contract } from 'hooks/v2v3/LoadV2V3Contract'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { useJBV3TokenDeployer } from '../contracts/JBV3TokenDeployer'

export function useDeployV3TokenTx(): TransactorInstance<{
  tokenName: string
  tokenSymbol: string
  v3ProjectId: number
  v1ProjectId?: number
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts: v1Contracts } = useContext(V1UserContext)
  const deployer = useJBV3TokenDeployer()

  const V2JBTokenStore = useLoadV2V3Contract({
    cv: CV_V2,
    contractName: V2V3ContractName.JBTokenStore,
  })

  return ({ tokenName, tokenSymbol, v3ProjectId, v1ProjectId }, txOpts) => {
    if (!deployer || !transactor || !V2JBTokenStore) {
      return Promise.resolve(false)
    }

    return transactor(
      deployer,
      'deploy',
      [
        tokenName,
        tokenSymbol,
        v1ProjectId ? v1Contracts?.TicketBooth.address : undefined, // assumes all V1 projects use the same ticketbooth (accurate i think?)
        V2JBTokenStore.address,
        v3ProjectId,
        v1ProjectId,
      ],
      {
        ...txOpts,
        title: t`Launch V3 migration token`,
      },
    )
  }
}
