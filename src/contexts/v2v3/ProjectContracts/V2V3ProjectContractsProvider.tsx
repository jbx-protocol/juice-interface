import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useV2V3ProjectContracts } from 'hooks/v2v3/V2V3ProjectContracts'
import { useLoadV2V3ProjectCvs } from 'hooks/v2v3/V2V3ProjectCvs'

export const V2V3ProjectContractsProvider: React.FC<{
  projectId: number
}> = ({ children, projectId }) => {
  const {
    data: contracts,
    loading: projectContractsLoading,
    versions,
  } = useV2V3ProjectContracts({ projectId })
  const { loading: cvsLoading } = useLoadV2V3ProjectCvs(projectId)

  return (
    <V2V3ProjectContractsContext.Provider
      value={{
        contracts,
        loading: {
          cvsLoading,
          projectContractsLoading,
        },
        versions,
      }}
    >
      {children}
    </V2V3ProjectContractsContext.Provider>
  )
}
