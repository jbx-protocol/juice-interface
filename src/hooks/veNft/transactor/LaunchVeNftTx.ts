import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useContext } from 'react'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'

export type ExtendLockTx = TransactorInstance<{
  name: string
  symbol: string
  uriResolver: string
  lockDurationOptions: number[]
}>

export function useLaunchVeNftTx(): ExtendLockTx {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { userAddress } = useWallet()
  const { projectId } = useContext(ProjectMetadataContext)

  return ({ name, symbol, uriResolver, lockDurationOptions }, txOpts) => {
    if (
      !transactor ||
      !userAddress ||
      !projectId ||
      !contracts?.JBTokenStore ||
      !contracts?.JBOperatorStore ||
      !contracts?.JBVeNftDeployer
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBVeNftDeployer,
      'deployVeNFT',
      [
        projectId, // _projectId
        name, // _name
        symbol, // _symbol
        uriResolver, // _uriResolver
        contracts.JBTokenStore.address, // _tokenStore
        contracts.JBOperatorStore.address, // _operatorStore
        lockDurationOptions, // _lockDurationOptions
        userAddress, // _owner
      ],
      {
        ...txOpts,
        title: t`Launch veNFT ${symbol}`,
      },
    )
  }
}
