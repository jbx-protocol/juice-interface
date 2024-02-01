import { ipfsGatewayFetch } from 'lib/api/ipfs'
import { DBProject, DBProjectRow, SGSBCompareKey } from 'models/dbProject'
import { Json } from 'models/json'
import {
  ProjectTagName,
  filterValidTags,
  isValidProjectTag,
} from 'models/project-tags'
import { ProjectMetadata, consolidateMetadata } from 'models/projectMetadata'
import { PV } from 'models/pv'

import { Project } from 'generated/graphql'
import { formatError } from './format/formatError'
import { parseBigNumberKeyVals } from './graph'
import { isIpfsCID } from './ipfs'

/**
 * Max number of attempts to resolve IPFS metadata for a project in database
 */
const MAX_METADATA_RETRIES = 3

export const sgDbCompareKeys: SGSBCompareKey[] = [
  'id',
  'projectId',
  'pv',
  'handle',
  'metadataUri',
  'currentBalance',
  'volume',
  'volumeUSD',
  'redeemVolume',
  'redeemVolumeUSD',
  'redeemCount',
  'creator',
  'owner',
  'contributorsCount',
  'nftsMintedCount',
  'createdAt',
  'trendingScore',
  'trendingVolume',
  'deployer',
  'terminal',
  'paymentsCount',
  'trendingPaymentsCount',
  'createdWithinTrendingWindow',
]

export const parseDBProject = (r: DBProjectRow): DBProject =>
  parseDBProjectJson(parseDBProjectsRow(r))

// Parse DB Project json, converting strings to BigNumbers
export const parseDBProjectJson = (j: Json<DBProject>): DBProject => ({
  ...j,
  tags: j.tags ?? [],
  ...parseBigNumberKeyVals(j, [
    'currentBalance',
    'volume',
    'volumeUSD',
    'trendingScore',
    'trendingVolume',
    'redeemVolume',
    'redeemVolumeUSD',
  ]),
})

// Parse DB Project row, converting property names from snake_case to camelCase
export function parseDBProjectsRow(p: DBProjectRow): Json<DBProject> {
  return {
    archived: p.archived,
    contributorsCount: p.contributors_count,
    createdAt: p.created_at,
    createdWithinTrendingWindow: p.created_within_trending_window,
    creator: p.creator,
    currentBalance: p.current_balance,
    deployer: p.deployer,
    description: p.description,
    handle: p.handle,
    id: p.id,
    logoUri: p.logo_uri,
    metadataUri: p.metadata_uri,
    name: p.name,
    nftsMintedCount: p.nfts_minted_count,
    owner: p.owner,
    paymentsCount: p.payments_count,
    projectId: p.project_id,
    pv: p.pv as PV,
    redeemCount: p.redeem_count,
    redeemVolume: p.redeem_volume,
    redeemVolumeUSD: p.redeem_voume_usd,
    tags: p.tags as ProjectTagName[],
    terminal: p.terminal,
    volume: p.volume,
    volumeUSD: p.volume_usd,
    trendingPaymentsCount: p.trending_payments_count,
    trendingScore: p.trending_score,
    trendingVolume: p.trending_volume,
    _hasUnresolvedMetadata: p._has_unresolved_metadata,
    _metadataRetriesLeft: p._metadata_retries_left,
    _updatedAt: p._updated_at,
  }
}

// Format DB Project json for insertion into DB, converting property names from camelCase to snake_case
export function formatDBProjectRow(
  p: Json<Omit<DBProject, '_updatedAt'>>,
): Omit<DBProjectRow, '_updated_at'> {
  return {
    archived: p.archived,
    contributors_count: p.contributorsCount,
    created_at: p.createdAt,
    created_within_trending_window: p.createdWithinTrendingWindow || false,
    creator: p.creator,
    current_balance: p.currentBalance,
    deployer: p.deployer,
    description: p.description,
    handle: p.handle,
    id: p.id,
    logo_uri: p.logoUri,
    metadata_uri: p.metadataUri,
    name: p.name,
    nfts_minted_count: p.nftsMintedCount,
    owner: p.owner,
    payments_count: p.paymentsCount,
    project_id: p.projectId,
    pv: p.pv,
    redeem_count: p.redeemCount,
    redeem_volume: p.redeemVolume,
    redeem_voume_usd: p.redeemVolumeUSD,
    tags: p.tags,
    terminal: p.terminal,
    trending_payments_count: p.trendingPaymentsCount,
    trending_score: p.trendingScore,
    trending_volume: p.trendingVolume,
    volume: p.volume,
    volume_usd: p.volumeUSD,
    _has_unresolved_metadata: p._hasUnresolvedMetadata ?? null,
    _metadata_retries_left: p._metadataRetriesLeft ?? null,
  }
}

/**
 * Deep compare list of Subgraph projects against list of database projects and return the list of Subgraph projects that have changed.
 *
 * @param sgProjects List of Subgraph projects
 * @param dbProjects List of database projects
 * @param retryIpfs If true, any project that previously failed to resolve metadata will be marked for change, regardless of if the project has since changed in the Subgraph.
 * @param returnAllProjects If true, all projects will be returned.
 */
export function formatSgProjectsForUpdate({
  sgProjects,
  dbProjects,
  retryIpfs,
  returnAllProjects,
}: {
  sgProjects: Json<Pick<Project, SGSBCompareKey>>[]
  dbProjects: Record<string, Json<DBProject>>
  retryIpfs?: boolean
  returnAllProjects?: boolean
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

  const formattedSgProjects = sgProjects.map(formatSGProjectForDB)

  const subgraphProjects = returnAllProjects
    ? formattedSgProjects
    : formattedSgProjects.filter(sgProject => {
        const id = sgProject.id

        const dbProject = dbProjects[id]

        if (!dbProject) {
          idsOfNewProjects.add(id)
          return true
        }

        const { _hasUnresolvedMetadata, _metadataRetriesLeft } = dbProject

        if (
          retryIpfs &&
          _hasUnresolvedMetadata &&
          (_metadataRetriesLeft || _metadataRetriesLeft === undefined)
        ) {
          retryMetadataCount += 1
          return true
        }

        if (dbProject.tags?.some(t => !isValidProjectTag(t))) {
          return true
        }

        // Deep compare Subgraph project vs. database project and find any discrepancies
        const propertiesToUpdate = sgDbCompareKeys.filter(k => {
          const oldVal = dbProject[k]
          const newVal = sgProject[k]

          // Store a record of properties that need updating
          if (oldVal !== newVal) {
            if (k === 'createdWithinTrendingWindow') {
              // Hack. DB only stores boolean for this property, but subgraph may return undefined/null
              if (!oldVal && !newVal) return false
            }

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

  // console.log('asdf', { changedSubgraphProjects })

  return {
    subgraphProjects,
    updatedProperties,
    retryMetadataCount,
    idsOfNewProjects,
  }
}

/**
 * Attempt to resolve metadata from IPFS for a Subgraph project, and return the project as a DBProject with metadata properties included if successful. If there's an error resolving metadata, return the error.
 */
export async function formatWithMetadata({
  sgProject,
  dbProject,
}: {
  sgProject: Json<Pick<Project, SGSBCompareKey>>
  dbProject:
    | Pick<
        DBProject,
        | '_hasUnresolvedMetadata'
        | '_metadataRetriesLeft'
        | 'metadataUri'
        | 'archived'
        | 'description'
        | 'logoUri'
        | 'name'
        | 'tags'
      >
    | undefined
}): Promise<{
  project: Json<Omit<DBProject, '_updatedAt'>>
  error?: string
  retriesRemaining?: number
}> {
  const { metadataUri } = sgProject

  // if metadataUri is missing or invalid, or no retries remaining for unresolved metadata
  if (
    !metadataUri ||
    !isIpfsCID(metadataUri) ||
    (dbProject?._hasUnresolvedMetadata && dbProject?._metadataRetriesLeft === 0)
  ) {
    return {
      project: {
        ...sgProject,
        _hasUnresolvedMetadata: true,
        _metadataRetriesLeft: 0,
        name: null,
        description: null,
        logoUri: null,
        tags: null,
        archived: null,
      },
    }
  }

  // If metadataUri has not changed, we don't need to resolve new metadata and can simply append existing dbProject metadata properties
  if (sgProject.metadataUri === dbProject?.metadataUri) {
    const { archived, description, logoUri, name, tags } = dbProject

    return {
      project: {
        ...sgProject,
        archived,
        description,
        logoUri,
        name,
        tags: filterValidTags(tags) ?? null,
      },
    }
  }

  try {
    // We need to use a timeout here, because if the object can't be found the request may never resolve. We use 30 seconds to stay well below the max of 60 seconds for vercel edge functions.
    const { data: metadata } = await ipfsGatewayFetch<ProjectMetadata>(
      metadataUri,
      {
        timeout: 30000,
      },
    )

    const { name, description, logoUri, tags, archived } =
      consolidateMetadata(metadata)

    return {
      project: {
        ...sgProject,
        name: name ?? null,
        description: description ?? null,
        logoUri: logoUri ?? null,
        tags: filterValidTags(tags) ?? null,
        archived: archived ?? null,
      },
    }
  } catch (error) {
    // decrement metadataRetriesLeft, or set to max if previously unset
    const retriesRemaining = dbProject?._metadataRetriesLeft
      ? dbProject._metadataRetriesLeft - 1
      : MAX_METADATA_RETRIES

    return {
      error: formatError(error),
      retriesRemaining,
      project: {
        ...sgProject,
        _hasUnresolvedMetadata: true,
        _metadataRetriesLeft: retriesRemaining,
        name: null,
        description: null,
        logoUri: null,
        tags: null,
        archived: null,
      },
    }
  }
}

// BigNumber values are stored as strings. To sort by these they must have an equal number of digits, so we pad them with leading 0s up to a 32 char length.
function padBigNumForSort(bn: string) {
  return bn.padStart(32, '0')
}

export function formatSGProjectForDB(
  p: Json<Pick<Project, SGSBCompareKey>>,
): Json<Pick<Project, SGSBCompareKey>> {
  return {
    ...p,
    // Adjust BigNumber values before we compare them to database values
    currentBalance: padBigNumForSort(p.currentBalance),
    redeemVolume: padBigNumForSort(p.redeemVolume),
    redeemVolumeUSD: padBigNumForSort(p.redeemVolumeUSD),
    trendingScore: padBigNumForSort(p.trendingScore),
    trendingVolume: padBigNumForSort(p.trendingVolume),
    volume: padBigNumForSort(p.volume),
    volumeUSD: padBigNumForSort(p.volumeUSD),
  }
}
