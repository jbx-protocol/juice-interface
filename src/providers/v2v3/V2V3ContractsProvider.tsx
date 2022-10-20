import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useV2V3ContractLoader } from 'hooks/v2v3/V2V3ContractLoader'
import { CV2V3 } from 'models/cv'
import { useState } from 'react'

export const V2V3ContractsProvider: React.FC<{
  initialCv: CV2V3
  cvs?: CV2V3[]
}> = ({ children, initialCv, cvs }) => {
  const [cv, setCv] = useState<CV2V3>(initialCv)

  const contracts = useV2V3ContractLoader({ cv })

  return (
    <V2V3ContractsContext.Provider
      value={{
        setVersion: (newCv: CV2V3) => {
          console.info(
            'V2V3ContractsProvider::Switching contracts version to',
            newCv,
          )
          setCv(newCv)
        },
        cv,
        contracts,
        cvs,
      }}
    >
      {children}
    </V2V3ContractsContext.Provider>
  )
}
