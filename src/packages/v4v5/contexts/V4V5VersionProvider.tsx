import React, { createContext, useContext, PropsWithChildren, useMemo } from 'react'
import { useJBContractContext, useJBProjectMetadataContext } from 'juice-sdk-react'
import { useProjectQuery } from 'generated/v4/graphql'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { PV_V4 } from 'constants/pv'

interface V4V5VersionContextType {
  version: 4 | 5
  loading: boolean
}

const V4V5VersionContext = createContext<V4V5VersionContextType | undefined>(undefined)

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
  defaultVersion = 4
}) => {
  // Query bendystraw to get the actual project version
  const { data, loading } = useProjectQuery({
    client: bendystrawClient,
    variables: {
      projectId: Number(projectId),
      chainId: chainId || 0,
      version: parseInt(PV_V4) // Initial query, will get actual version from response
    },
    skip: !projectId || !chainId,
  })

  const version = useMemo(() => {
    // If we have data from bendystraw, use the version from there
    if (data?.project?.version) {
      return data.project.version as 4 | 5
    }
    // Otherwise use the default version
    return defaultVersion
  }, [data?.project?.version, defaultVersion])

  const value = useMemo(() => ({
    version,
    loading
  }), [version, loading])

  return (
    <V4V5VersionContext.Provider value={value}>
      {children}
    </V4V5VersionContext.Provider>
  )
}