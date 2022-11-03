import { V1UserContext } from 'contexts/v1/userContext'
import { useTransactor } from 'hooks/Transactor'
import { useV1ContractLoader } from 'hooks/v1/V1ContractLoader'

export const V1UserProvider: React.FC = ({ children }) => {
  const contracts = useV1ContractLoader()
  const transactor = useTransactor()

  return (
    <V1UserContext.Provider
      value={{
        contracts,
        transactor,
      }}
    >
      {children}
    </V1UserContext.Provider>
  )
}
