import { CV_V2 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useV2V3ContractLoader } from 'hooks/v2v3/V2V3ContractLoader'

export const V2V3ContractsProvider: React.FC = ({ children }) => {
  const contracts = useV2V3ContractLoader({ cv: CV_V2 })

  return (
    <V2V3ContractsContext.Provider
      value={{
        cv: CV_V2,
        contracts,
      }}
    >
      {children}
    </V2V3ContractsContext.Provider>
  )
}
