import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { useTokenUriResolver } from 'hooks/TokenUriResolver/contracts/TokenUriResolver'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'
import { t } from '@lingui/macro'
import { useV2ProjectTitle } from '../ProjectTitle'

export function useSetTokenUriResolverForProjectTx(): TransactorInstance<{
  resolver: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const TokenUriResolver = useTokenUriResolver()
  const projectTitle = useV2ProjectTitle()

  return ({ resolver }, txOpts) => {
    if (!transactor || !projectId || !TokenUriResolver) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      TokenUriResolver,
      'setTokenUriResolverForProject',
      [projectId, resolver],
      {
        ...txOpts,
        title: t`Set metadata resolver for ${projectTitle}\'s project NFT`,
      },
    )
  }
}
