import { SECONDS_IN_DAY } from 'constants/numbers'
import { EnsCacheContext } from 'contexts/ensCacheContext'
import { resolveAddress } from 'lib/ens/resolver'
import { cacheEnsRecord } from 'providers/EnsCacheProvider'
import { useContext, useEffect } from 'react'

/**
 * Try to resolve an address to an ENS name.
 */
export function useEnsName(address: string | undefined) {
  const { cache, pending, setCache, setPending } = useContext(EnsCacheContext)

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

      setPending?.({ ...pending, [address]: true })
      const name = await resolveAddress(address)

      const newRecord = {
        name: name ?? null, // set name to null to indicate no ENS name.
        expires: now + SECONDS_IN_DAY * 1000, // Expires in one day
      }

      // update state
      setCache?.({ ...cache, [address]: newRecord })
      setPending?.({ ...pending, [address]: false })
      // sync with localstorage
      cacheEnsRecord(address, newRecord)
    }

    loadEnsName()
  }, [address, cache, pending, now, setCache, setPending])

  if (!address) return

  return cache[address]?.name
}
