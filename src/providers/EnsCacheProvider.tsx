import { readProvider } from 'constants/readProvider'
import { EnsCacheContext } from 'contexts/ensCacheContext'
import { useState } from 'react'

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

export const EnsCacheProvider: React.FC = ({ children }) => {
  // initially populate in-memory cache from localstorage
  const [cache, setCache] = useState<Record<string, EnsCacheRecord>>(
    getEnsCache(),
  )
  const [pending, setPending] = useState<Record<string, boolean>>({})

  return (
    <EnsCacheContext.Provider value={{ cache, pending, setCache, setPending }}>
      {children}
    </EnsCacheContext.Provider>
  )
}
