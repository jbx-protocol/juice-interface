import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'

export type ExtendLockTx = TransactorInstance<{
  name: string
  symbol: string
  uriResolver: string
  lockDurationOptions: number[]
}>

export function useLaunchVeNftTx(): ExtendLockTx {
  const { transactor, contracts } = useContext(V2UserContext)
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
