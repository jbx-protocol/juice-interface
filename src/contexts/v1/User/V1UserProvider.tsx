import { useV1ContractLoader } from 'contexts/v1/User/useV1ContractLoader'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { useTransactor } from 'hooks/useTransactor'

export const V1UserProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
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
