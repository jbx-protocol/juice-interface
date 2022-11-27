import { SECONDS_IN_DAY } from 'constants/numbers'
import { readProvider } from 'constants/readProvider'
import { resolveAddress } from 'lib/ens/resolver'
import { useEffect, useState } from 'react'

export type EnsCacheRecord = {
  name: string | null
  expires: number
}

const ensLocalstorageKey = () =>
  readProvider?.network?.chainId
    ? `jb_ensDict_${readProvider.network.chainId}`
    : undefined

export const getEnsCache = () => {
  if (typeof window === 'undefined') return {}

  try {
    return JSON.parse(
      window.localStorage.getItem(ensLocalstorageKey() ?? '') ?? '{}',
    ) as Record<string, EnsCacheRecord>
  } catch (e) {
    console.warn('ENS storage not found', e)
    return {}
  }
}

export const cacheEnsRecord = (address: string, record: EnsCacheRecord) => {
  const key = ensLocalstorageKey()
  if (!key) return

  window.localStorage?.setItem(
    key,
    JSON.stringify({
      ...getEnsCache(),
      [address]: record,
    }),
  )
}

const getEnsNameFromCache = (address: string, expiryTime: number) => {
  const cache = getEnsCache()
  // Try getting from cache first
  const record = cache[address]
  if (record?.expires > expiryTime) {
    return record.name
  }
}

/**
 * Try to resolve an address to an ENS name.
 */
export function useEnsName(address: string | undefined) {
  const [ensName, setEnsName] = useState<string | null>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const now = new Date().valueOf()

    async function loadEnsName() {
      if (!address) return

      const ensNameFromCache = getEnsNameFromCache(address, now)
      // if cache hit, don't fetch
      if (ensNameFromCache !== undefined) {
        setEnsName(ensNameFromCache)
        return
      }

      // if a fetch is already in progress, bail
      if (loading) {
        return
      }

      setLoading(true)
      const name = await resolveAddress(address)

      const newRecord = {
        name: name ?? null, // set name to null to indicate no ENS name.
        expires: now + SECONDS_IN_DAY * 1000, // Expires in one day
      }

      // update state
      setEnsName(name)
      setLoading(false)
      // sync with localstorage
      cacheEnsRecord(address, newRecord)
    }

    loadEnsName()
  }, [address, loading])

  if (!address) return

  return ensName
}
