import Bottleneck from 'bottleneck'
import { ipfsGet } from 'lib/api/ipfs'
import {
  AnyProjectMetadata,
  consolidateMetadata,
  ProjectMetadata,
} from 'models/projectMetadata'

import { GlobalInfuraScheduler } from './infuraScheduler'

export const findProjectMetadata = async ({
  metadataCid, // ipfs hash
  limiter,
}: {
  metadataCid: string
  limiter?: Bottleneck
}): Promise<ProjectMetadata> => {
  limiter = limiter ?? GlobalInfuraScheduler
  /*
   * Safe to do so, as the static timeout will catch this and retry later.
   */
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const response = await limiter.schedule(
        async () => await ipfsGet<AnyProjectMetadata>(metadataCid),
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
      if (
        isTemporaryServiceError({ status: e?.response?.status, code: e?.code })
      ) {
        console.error('IPFS request temporarily unavailable, retry shortly', {
          metadataCid,
          status: e?.response?.status,
          code: e?.code,
          error: e?.message,
        })
        continue
      }
      console.error('IPFS request responded with error', {
        metadataCid,
        status: e?.response?.status,
        code: e?.code,
        error: e?.message,
      })
      throw e
    }
  }
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
