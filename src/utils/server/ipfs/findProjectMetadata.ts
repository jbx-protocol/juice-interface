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
      const status = e?.response?.status
      if (status === 504 || status === 500 || e?.code === 'ECONNRESET') {
        console.info('IPFS request timed out, retrying', {
          url,
          status,
          code: e?.code,
          error: e?.message,
        })
        continue
      }
      console.info('IPFS request responded with error', {
        url,
        status,
        code: e?.code,
        error: e?.message,
      })
      throw e
    }
  }
}
