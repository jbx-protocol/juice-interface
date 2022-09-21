import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import { useV2ContractLoader } from 'hooks/v2/V2ContractLoader'

export const V2ContractsProvider: React.FC = ({ children }) => {
  const contracts = useV2ContractLoader()

  return (
    <V2ContractsContext.Provider
      value={{
        contracts,
      }}
    >
      {children}
    </V2ContractsContext.Provider>
  )
}
