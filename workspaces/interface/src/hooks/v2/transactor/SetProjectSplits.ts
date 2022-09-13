import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { TransactorInstance } from 'hooks/Transactor'
import { GroupedSplits } from 'models/v2/splits'
import { useContext } from 'react'
import { sanitizeSplit } from 'utils/v2/splits'

export const useSetProjectSplits = <G>({
  domain,
}: {
  domain: string | undefined
}): TransactorInstance<{
  groupedSplits: GroupedSplits<G>
}> => {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)
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
      txOpts,
    )
  }
}
