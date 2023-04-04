import { ipfsGet } from 'lib/api/ipfs'
import { MAX_METADATA_RETRIES } from 'lib/api/supabase/projects'
import { Json } from 'models/json'
import { consolidateMetadata, ProjectMetadata } from 'models/projectMetadata'
import { Project } from 'models/subgraph-entities/vX/project'
import { SBProject, SGSBCompareKey } from 'models/supabaseProject'

import { formatError } from './format/formatError'
import { parseBigNumberKeyVals } from './graph'
import { isIpfsCID } from './ipfs'

export const sgSbCompareKeys: SGSBCompareKey[] = [
  'id',
  'projectId',
  'pv',
  'handle',
  'metadataUri',
  'currentBalance',
  'totalPaid',
  'createdAt',
  'trendingScore',
  'deployer',
  'terminal',
  'paymentsCount',
]

export const parseSBProjectJson = (j: Json<SBProject>): SBProject => ({
  ...j,
  tags: j.tags ?? [],
  archived: j.archived ?? false,
  ...parseBigNumberKeyVals(j, ['currentBalance', 'totalPaid', 'trendingScore']),
})

export function getChangedSubgraphProjects({
  sgProjects,
  sbProjects,
  retryIpfs,
}: {
  sgProjects: Json<Pick<Project, SGSBCompareKey>>[]
  sbProjects: Record<string, Json<SBProject>>
  retryIpfs?: boolean
}) {
  const idsOfNewProjects = new Set<string>([])

  const updatedProperties: {
    [id: string]: {
      key: string
      oldVal: string | undefined | null
      newVal: string | undefined | null
    }[]
  } = {}

  let retryMetadataCount = 0

  const changedSubgraphProjects = sgProjects
    .map(p => ({
      ...p,
      // Adjust BigNumber values before we compare them to supabase values
      currentBalance: padBigNumForSort(p.currentBalance),
      totalPaid: padBigNumForSort(p.totalPaid),
      trendingScore: padBigNumForSort(p.trendingScore),
    }))
    .filter(sgProject => {
      const id = sgProject.id

      const sbProject = sbProjects[id]

      if (!sbProject) {
        idsOfNewProjects.add(id)
        return true
      }

      const { _hasUnresolvedMetadata, _metadataRetriesLeft } = sbProject

      if (
        retryIpfs &&
        _hasUnresolvedMetadata &&
        (_metadataRetriesLeft || _metadataRetriesLeft === undefined)
      ) {
        retryMetadataCount += 1
        return true
      }

      // Deep compare Subgraph project vs. Supabase project and find any discrepancies
      const propertiesToUpdate = sgSbCompareKeys.filter(k => {
        const oldVal = sbProject[k]
        const newVal = sgProject[k]

        // Store a record of properties that need updating
        if (oldVal !== newVal) {
          updatedProperties[id] = [
            ...(updatedProperties[id] ?? []),
            {
              key: k,
              oldVal: oldVal?.toString(),
              newVal: newVal?.toString(),
            },
          ]
          return true
        }

        return false
      })

      // Return true if any properties are out of date
      return propertiesToUpdate.length
    })

  return {
    changedSubgraphProjects,
    updatedProperties,
    retryMetadataCount,
    idsOfNewProjects,
  }
}

export async function tryResolveMetadata({
  sgProject,
  _metadataRetriesLeft,
  _hasUnresolvedMetadata,
}: {
  sgProject: Json<Pick<Project, SGSBCompareKey>>
} & Partial<
  Pick<SBProject, '_hasUnresolvedMetadata' | '_metadataRetriesLeft'>
>) {
  const { metadataUri } = sgProject

  // if metadataUri is missing or invalid, or no retries remaining for unresolved metadata
  if (
    !metadataUri ||
    !isIpfsCID(metadataUri) ||
    (_hasUnresolvedMetadata && _metadataRetriesLeft === 0)
  ) {
    return {
      project: {
        ...sgProject,
        _hasUnresolvedMetadata: true,
        _metadataRetriesLeft: 0,
      } as Json<SBProject>,
    }
  }

  try {
    const { data: metadata } = await ipfsGet<ProjectMetadata>(metadataUri, {
      timeout: 30000,
    })

    const { name, description, logoUri, tags, archived } =
      consolidateMetadata(metadata)

    return {
      project: {
        ...sgProject,
        name,
        description,
        logoUri,
        tags,
        archived,
      } as Json<SBProject>,
    }
  } catch (error) {
    // decrement metadataRetriesLeft, or set to max if previously unset
    const retriesRemaining = _metadataRetriesLeft
      ? _metadataRetriesLeft - 1
      : MAX_METADATA_RETRIES

    return {
      error: formatError(error),
      retriesRemaining,
      project: {
        ...sgProject,
        _hasUnresolvedMetadata: true,
        _metadataRetriesLeft: retriesRemaining,
      } as Json<SBProject>,
    }
  }
}

// BigNumber values are stored as strings (sql type: keyword). To sort by these they must have an equal number of digits, so we pad them with leading 0s up to a 32 char length.
function padBigNumForSort(bn: string) {
  return bn.padStart(32, '0')
}
