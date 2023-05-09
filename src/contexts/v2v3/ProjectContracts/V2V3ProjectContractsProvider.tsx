import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useLoadV2V3ProjectCvs } from 'hooks/v2v3/useV2V3ProjectCvs'
import { useV2V3ProjectContracts } from './useV2V3ProjectContracts'

export const V2V3ProjectContractsProvider: React.FC<
  React.PropsWithChildren<{
    projectId: number
  }>
> = ({ children, projectId }) => {
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
