import { useProjectQuery } from 'generated/v4v5/graphql'
import { getBendystrawClient } from 'lib/apollo/bendystrawClient'
import { useRouter } from 'next/router'
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react'

interface V4V5VersionContextType {
  version: 4 | 5
  loading: boolean
}

const V4V5VersionContext = createContext<V4V5VersionContextType | undefined>(
  undefined,
)

export const useV4V5Version = () => {
  const context = useContext(V4V5VersionContext)
  if (!context) {
    throw new Error('useV4V5Version must be used within V4V5VersionProvider')
  }
  return context
}

interface V4V5VersionProviderProps extends PropsWithChildren {
  chainId?: number
  projectId?: number
  defaultVersion?: 4 | 5
}

export const V4V5VersionProvider: React.FC<V4V5VersionProviderProps> = ({
  children,
  chainId,
  projectId,
  defaultVersion,
}) => {
  const router = useRouter()

  // Auto-detect version from route if defaultVersion not provided
  const detectedVersion = useMemo((): 4 | 5 => {
    if (defaultVersion) return defaultVersion

    // Detect from pathname
    if (router.pathname.startsWith('/v5')) return 5
    if (router.pathname.startsWith('/v4')) return 4

    // Default fallback
    return 4
  }, [router.pathname, defaultVersion])

  // Query bendystraw to get the actual project version
  const { data, loading } = useProjectQuery({
    client: getBendystrawClient(chainId),
    variables: {
      projectId: Number(projectId),
      chainId: chainId || 0,
      version: detectedVersion, // Use detected version for initial query
    },
    skip: !projectId || !chainId,
  })

  const version = useMemo(() => {
    // Use the version from bendystraw if available, otherwise use detected version
    if (data?.project?.version) {
      return data.project.version as 4 | 5
    }
    return detectedVersion
  }, [data?.project?.version, detectedVersion])

  const value = useMemo(
    () => ({
      version,
      loading,
    }),
    [version, loading],
  )

  return (
    <V4V5VersionContext.Provider value={value}>
      {children}
    </V4V5VersionContext.Provider>
  )
}
