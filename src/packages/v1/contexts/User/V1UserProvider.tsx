import { useTransactor } from 'hooks/useTransactor'
import { V1UserContext } from 'packages/v1/contexts/User/V1UserContext'
import { useV1ContractLoader } from 'packages/v1/contexts/User/useV1ContractLoader'

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
