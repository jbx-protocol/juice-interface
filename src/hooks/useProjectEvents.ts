import { useMemo } from 'react'

import {
  OrderDirection,
  ProjectEvent_OrderBy,
  useProjectEventsQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { ProjectEventsQueryArgs } from 'models/projectEvents'
import { RomanStormVariables } from 'constants/romanStorm'

export function useProjectEvents({
  filter,
  pv,
  projectId,
  from,
  first,
  skip,
}: ProjectEventsQueryArgs) {
  const projectSnapshotTimestamp = useMemo(() => {
    if (projectId === RomanStormVariables.PROJECT_ID) {
      return RomanStormVariables.SNAPSHOT_TIMESTAMP
    }
    return null
  }, [projectId])

  return useProjectEventsQuery({
    client,
    variables: {
      first,
      skip,

      // Always order by timestamp descending
      orderBy: ProjectEvent_OrderBy.timestamp,
      orderDirection: OrderDirection.desc,

      where: {
        ...(pv ? { pv } : {}),
        ...(projectId ? { projectId } : {}),
        ...(projectSnapshotTimestamp
          ? { timestamp_gt: projectSnapshotTimestamp }
          : {}),
        ...(from
          ? {
              // subgraph needs addresses to be lowercased
              from: from.toLowerCase(),
            }
          : {}),

        // Always filter out projectEvents where these properties are not null. We have no cases for showing them in the UI and don't want them to pollute the query result
        mintTokensEvent: null,
        useAllowanceEvent: null,
        distributeToTicketModEvent: null,
        distributeToPayoutModEvent: null,
        v1InitEvent: null,
        distributeToPayoutSplitEvent: null,
        distributeToReservedTokenSplitEvent: null,
        initEvent: null,
        migrateEvent: null,

        // ProjectEvents have exactly one non-null Event field. We can use `<filter>_not: null` to return only projectEvents where the matching Event field is defined
        ...(!filter || filter === 'all'
          ? {}
          : {
              [filter + '_not']: null,
            }),
      },
    },
  })
}
