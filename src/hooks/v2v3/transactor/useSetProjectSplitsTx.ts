import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { GroupedSplits } from 'models/splits'
import { useContext } from 'react'
import { sanitizeSplit } from 'utils/splits'
import { useV2ProjectTitle } from '../useProjectTitle'

export const useSetProjectSplits = <G>({
  domain,
}: {
  domain: string | undefined
}): TransactorInstance<{
  groupedSplits: GroupedSplits<G>
}> => {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const projectTitle = useV2ProjectTitle()

  return ({ groupedSplits }, txOpts) => {
    const txGroupedSplits = {
      group: groupedSplits.group,
      splits: groupedSplits.splits.map(sanitizeSplit),
    }
    if (!transactor || !projectId || !contracts?.JBSplitsStore || !domain) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBSplitsStore,
      'set',
      [projectId, domain, [txGroupedSplits]],
      {
        ...txOpts,
        title: t`Set splits for ${projectTitle}`,
      },
    )
  }
}
