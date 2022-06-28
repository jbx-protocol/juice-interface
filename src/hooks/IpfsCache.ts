import axios from 'axios'
import { IpfsCacheData, IpfsCacheJsonData } from 'models/ipfs-cache/cache-data'
import { IpfsCacheName } from 'models/ipfs-cache/cache-name'
import moment, { DurationInputArg1 } from 'moment'
import { useEffect, useState } from 'react'
import { getPinnedListByTag, ipfsCidUrl } from 'utils/ipfs'

type IpfsCacheOpts<T extends IpfsCacheName> = {
  ttl: DurationInputArg1
  deserialize?: (x: IpfsCacheJsonData[T]) => IpfsCacheData[T]
}

export function useIpfsCache<T extends IpfsCacheName>(
  tag: T,
  opts: IpfsCacheOpts<T>,
) {
  // Use `null` value to indicate missing or expired cache
  const [cache, setCache] = useState<IpfsCacheData[T] | null>()

  useEffect(() => {
    async function load() {
      try {
        // Load pinned items by tag
        const list = await getPinnedListByTag(tag)

        if (!list.count) {
          setCache(null)
          return
        }

        // Most recent cache file is returned first in array
        const latest = list.rows[0]

        const isExpired = moment(latest.date_pinned).isBefore(
          moment().subtract(opts.ttl),
        )

        if (isExpired) {
          setCache(null)
        } else {
          // Get data from latest cache if not expired
          const data: { data: IpfsCacheJsonData[T] } = await axios.get(
            ipfsCidUrl(latest.ipfs_pin_hash),
          )

          setCache(
            opts?.deserialize
              ? opts.deserialize(data.data)
              : (data.data as unknown as IpfsCacheData[T]),
          )
        }
      } catch (e) {
        console.error('Error loading IPFS cache', tag, e)
      }
    }

    load()
  }, [tag, opts])

  return cache
}
