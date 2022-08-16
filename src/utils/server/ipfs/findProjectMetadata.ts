import axios from 'axios'
import Bottleneck from 'bottleneck'
import { consolidateMetadata } from 'models/project-metadata'

import { GlobalPinataScheduler } from '../bottleneck'

export const findProjectMetadata = async ({
  url,
  limiter,
}: {
  url: string
  limiter?: Bottleneck
}) => {
  limiter = limiter ?? GlobalPinataScheduler
  /*
   * Safe to do so, as the static timeout will catch this and retry later.
   */
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const response = await limiter.schedule(async () => await axios.get(url))
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
        console.info('IPFS request temporarily unavailable, retry shortly', {
          url,
          status: e?.response?.status,
          code: e?.code,
          error: e?.message,
        })
        continue
      }
      console.info('IPFS request responded with error', {
        url,
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
