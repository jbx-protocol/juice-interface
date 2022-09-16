import { CV_V2 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useV2V3ContractLoader } from 'hooks/v2v3/V2V3ContractLoader'
import { V2CVType, V3CVType } from 'models/cv'
import { useState } from 'react'

export const V2V3ContractsProvider: React.FC = ({ children }) => {
  const [cv, setCv] = useState<V2CVType | V3CVType>(CV_V2) // TODO decide on whether to default to v3

  const contracts = useV2V3ContractLoader({ cv })

  return (
    <V2V3ContractsContext.Provider
      value={{
        setVersion: (newCv: V2CVType | V3CVType) => {
          console.info(
            'V2V3ContractsProvider::Switching contracts version to',
            newCv,
          )
          setCv(newCv)
        },
        cv,
        contracts,
      }}
    >
      {children}
    </V2V3ContractsContext.Provider>
  )
}
