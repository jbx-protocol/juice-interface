import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useV2V3ContractLoader } from 'hooks/v2v3/V2V3ContractLoader'
import { CV2V3 } from 'models/cv'
import { useCallback, useState } from 'react'

export const V2V3ContractsProvider: React.FC<{
  initialCv?: CV2V3
}> = ({ initialCv, children }) => {
  const [cv, setCv] = useState<CV2V3 | undefined>(initialCv)
  const [cvs, setCvs] = useState<CV2V3[]>()

  const contracts = useV2V3ContractLoader({ cv })

  const setCvWithLog = useCallback(
    (newCv: CV2V3) => {
      console.info(
        'V2V3ContractsProvider::Switching contracts version to',
        newCv,
      )
      setCv(newCv)
    },
    [setCv],
  )

  return (
    <V2V3ContractsContext.Provider
      value={{
        contracts,
        cv,
        cvs,
        setCv: setCvWithLog,
        setCvs,
      }}
    >
      {children}
    </V2V3ContractsContext.Provider>
  )
}
