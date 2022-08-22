import useSubgraphQuery from 'hooks/SubgraphQuery'
import { featureFlagEnabled } from 'utils/featureFlags'

import { FEATURE_FLAGS } from 'constants/featureFlags'

export const useVeNftContractForProject = (projectId: number | undefined) => {
  return useSubgraphQuery(
    {
      entity: 'veNftContract',
      keys: ['address', 'uriResolver'],
      where: [
        {
          key: 'projectId',
          value: projectId || '',
        },
      ],
    },
    {
      enabled: featureFlagEnabled(FEATURE_FLAGS.VENFT),
    },
  )
}
