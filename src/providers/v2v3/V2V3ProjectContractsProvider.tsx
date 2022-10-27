import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import { useV2V3ProjectContracts } from 'hooks/v2v3/V2V3ProjectContracts'
import { useSetCv } from './V2V3ContractsProvider'

export const V2V3ProjectContractsProvider: React.FC<{
  projectId: number
}> = ({ children, projectId }) => {
  const contracts = useV2V3ProjectContracts({ projectId })

  useSetCv(projectId)

  return (
    <V2V3ProjectContractsContext.Provider
      value={{
        contracts,
      }}
    >
      {children}
    </V2V3ProjectContractsContext.Provider>
  )
}
