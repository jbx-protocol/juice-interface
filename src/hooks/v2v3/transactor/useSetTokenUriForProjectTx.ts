import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { useContext } from 'react'
import { t } from '@lingui/macro'
import { TransactorInstance } from 'hooks/useTransactor'
import { useV2ProjectTitle } from '../useProjectTitle'
import { useTokenUriResolver } from 'hooks/TokenUriResolver/contracts/useTokenUriResolver'

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
