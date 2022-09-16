import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { TransactorInstance } from 'hooks/Transactor'
import { GroupedSplits } from 'models/splits'
import { useContext } from 'react'
import { sanitizeSplit } from 'utils/splits'
import { useV2ProjectTitle } from '../ProjectTitle'

export const useSetProjectSplits = <G>({
  domain,
}: {
  domain: string | undefined
}): TransactorInstance<{
  groupedSplits: GroupedSplits<G>
}> => {
  const { transactor, contracts } = useContext(V2UserContext)
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
