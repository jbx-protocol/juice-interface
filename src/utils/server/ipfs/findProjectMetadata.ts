import Bottleneck from 'bottleneck'
import { IPFS_GATEWAY_HOSTNAMES } from 'constants/ipfs'
import { ipfsGatewayFetch } from 'lib/api/ipfs'
import {
  AnyProjectMetadata,
  consolidateMetadata,
  ProjectMetadata,
} from 'models/projectMetadata'

import { GlobalInfuraScheduler } from './infuraScheduler'

/** A gateway that has not answered by now is one to walk past, not to wait on. */
const GATEWAY_TIMEOUT_MS = 10_000
/** Attempts per gateway before moving to the next one. */
const ATTEMPTS_PER_GATEWAY = 2

export const findProjectMetadata = async ({
  metadataCid, // ipfs hash
  limiter,
}: {
  metadataCid: string
  limiter?: Bottleneck
}): Promise<ProjectMetadata> => {
  limiter = limiter ?? GlobalInfuraScheduler
  let lastError: unknown

  // Walk the gateways rather than retrying one forever. A gateway that stops
  // resolving used to hang or throw here, and this call sits inside project page
  // generation — so the whole page 500'd on one vendor's DNS record.
  for (const hostname of IPFS_GATEWAY_HOSTNAMES) {
    for (let attempt = 0; attempt < ATTEMPTS_PER_GATEWAY; attempt++) {
      try {
        const response = await limiter.schedule(
          async () =>
            await ipfsGatewayFetch<AnyProjectMetadata>(
              metadataCid,
              { timeout: GATEWAY_TIMEOUT_MS },
              hostname,
            ),
        )
        const metadata = consolidateMetadata(response.data)
        Object.keys(metadata).forEach(key =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (metadata as any)[key] === undefined
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              delete (metadata as any)[key]
            : {},
        )
        return metadata
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        lastError = e
        console.error('IPFS request failed', {
          metadataCid,
          hostname,
          status: e?.response?.status,
          code: e?.code,
          error: e?.message,
        })
        if (
          !isTemporaryServiceError({
            status: e?.response?.status,
            code: e?.code,
          })
        ) {
          break
        }
      }
    }
  }

  throw lastError
}

/**
 * Checks if the response has returned a value that might be resolvable by
 * trying again at a later time.
 */
function isTemporaryServiceError({
  status,
  code,
}: {
  status: number | undefined
  code: string | undefined
}) {
  if (code === 'ECONNRESET') {
    return true
  }
  if (status) {
    switch (status) {
      case 429:
      case 500:
      case 503:
      case 504:
        return true
      default:
        return false
    }
  }
  return false
}
