import { ipfsGet } from 'lib/api/ipfs'
import { CURRENT_VERSION, MAX_METADATA_RETRIES } from 'lib/sepana/constants'
import { Json } from 'models/json'
import { AnyProjectMetadata } from 'models/projectMetadata'
import { SepanaProject, SGSepanaCompareKey } from 'models/sepana'
import { Project } from 'models/subgraph-entities/vX/project'

import { formatError } from './format/formatError'
import { parseBigNumberKeyVals } from './graph'
import { ipfsGatewayUrl, isIpfsCID } from './ipfs'

export const sgSepanaCompareKeys: SGSepanaCompareKey[] = [
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
]

export const parseSepanaProjectJson = (
  j: Json<SepanaProject>,
): SepanaProject => ({
  ...j,
  ...parseBigNumberKeyVals(j, ['currentBalance', 'totalPaid', 'trendingScore']),
})

export function getChangedSubgraphProjects({
  subgraphProjects,
  sepanaProjects,
  retryIpfs,
}: {
  subgraphProjects: Json<Pick<Project, SGSepanaCompareKey>>[]
  sepanaProjects: Record<string, Json<SepanaProject>>
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

  const changedSubgraphProjects = subgraphProjects.filter(subgraphProject => {
    const id = subgraphProject.id

    const sepanaProject = sepanaProjects[subgraphProject.id]

    if (!sepanaProject) {
      idsOfNewProjects.add(id)
      return true
    }

    if (sepanaProject._v !== CURRENT_VERSION) {
      return true
    }

    const { _hasUnresolvedMetadata, _metadataRetriesLeft } = sepanaProject

    if (
      retryIpfs &&
      _hasUnresolvedMetadata &&
      (_metadataRetriesLeft || _metadataRetriesLeft === undefined)
    ) {
      retryMetadataCount++
      return true
    }

    // Deep compare Subgraph project vs. Sepana project and find any discrepancies
    const propertiesToUpdate = sgSepanaCompareKeys.filter(k => {
      const oldVal = sepanaProject[k]
      const newVal = subgraphProject[k]

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
  subgraphProject,
  _metadataRetriesLeft,
  _hasUnresolvedMetadata,
}: {
  subgraphProject: Json<Pick<Project, SGSepanaCompareKey>>
} & Partial<
  Pick<SepanaProject, '_hasUnresolvedMetadata' | '_metadataRetriesLeft'>
>) {
  const { metadataUri } = subgraphProject

  // if metadataUri is missing or invalid, or no retries remaining for unresolved metadata
  if (
    !metadataUri ||
    !isIpfsCID(metadataUri) ||
    (_hasUnresolvedMetadata && _metadataRetriesLeft === 0)
  ) {
    return {
      project: {
        ...subgraphProject,
        _hasUnresolvedMetadata: true,
        _metadataRetriesLeft: 0,
      } as Json<SepanaProject>,
    }
  }

  try {
    const {
      data: { name, description, logoUri },
    } = await ipfsGet<AnyProjectMetadata>(ipfsGatewayUrl(metadataUri), {
      timeout: 10000,
    })

    return {
      project: {
        ...subgraphProject,
        name,
        description,
        logoUri,
      } as Json<SepanaProject>,
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
        ...subgraphProject,
        _hasUnresolvedMetadata: true,
        _metadataRetriesLeft: retriesRemaining,
      } as Json<SepanaProject>,
    }
  }
}
