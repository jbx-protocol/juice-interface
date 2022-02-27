import axios from 'axios'
import { IpfsCacheData, IpfsCacheJsonData } from 'models/ipfs-cache/cache-data'
import { IpfsCacheName } from 'models/ipfs-cache/cache-name'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { getPinnedListByTag, ipfsCidUrl, unpinIpfsFileByCid } from 'utils/ipfs'

export type IpfsCacheOpts<T extends IpfsCacheName> = {
  ttlMin: number
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
        const list = await getPinnedListByTag(IpfsCacheName.trending)

        if (!list.count) {
          setCache(null)
          return
        }

        // Most recent cache file is returned first in array
        const latest = list.rows[0]

        // Cache expires every 12 min, will update 5 times an hour. (Arbitrary)
        const isExpired = moment(latest.date_pinned).isBefore(
          moment().subtract({ minutes: opts.ttlMin }),
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

        // Unpin cache files, including latest if expired
        // There should never be more than one cache file, but simultaneous page views may result in multiple
        list.rows.splice(0, isExpired ? 1 : 0).reduce(async (_, row) => {
          // Use sequential requests as simultaenous requests may be rate limited
          await unpinIpfsFileByCid(row.ipfs_pin_hash)
        }, Promise.resolve())
      } catch (e) {
        console.error('Error loading IPFS cache', tag, e)
      }
    }

    load()
  }, [tag, opts])

  return cache
}
