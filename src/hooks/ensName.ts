import { SECONDS_IN_DAY } from 'constants/numbers'
import { resolveAddress } from 'lib/ens/resolver'
import {
  cacheEnsRecord,
  EnsCacheRecord,
  getEnsCache,
} from 'providers/EnsCacheProvider'
import { useEffect, useState } from 'react'

/**
 * Try to resolve an address to an ENS name.
 */
export function useEnsName(address: string | undefined) {
  const [cache, setCache] = useState<Record<string, EnsCacheRecord>>(
    getEnsCache(),
  )
  const [pending, setPending] = useState<Record<string, boolean>>({})

  const now = new Date().valueOf()

  useEffect(() => {
    const getEnsNameFromCache = (address: string) => {
      // Try getting from cache first
      const record = cache[address]
      if (record?.expires > now) {
        return record.name
      }

      // if a fetch is already in progress, bail
      if (pending[address]) {
        return
      }
    }

    async function loadEnsName() {
      if (!address) return

      const ensNameFromCache = getEnsNameFromCache(address)
      // if cache hit, don't fetch
      // if a fetch is already in progress, bail
      if (ensNameFromCache !== undefined || pending[address]) return

      setPending({ ...pending, [address]: true })
      const name = await resolveAddress(address)

      const newRecord = {
        name: name ?? null, // set name to null to indicate no ENS name.
        expires: now + SECONDS_IN_DAY * 1000, // Expires in one day
      }

      // update state
      setCache({ ...cache, [address]: newRecord })
      setPending({ ...pending, [address]: false })
      // sync with localstorage
      cacheEnsRecord(address, newRecord)
    }

    loadEnsName()
  }, [address, cache, pending, now])

  if (!address) return

  return cache[address]?.name
}
