import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { GroupedSplits } from 'packages/v2v3/models/splits'
import { sanitizeSplit } from 'packages/v2v3/utils/v2v3Splits'
import { useContext } from 'react'
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
