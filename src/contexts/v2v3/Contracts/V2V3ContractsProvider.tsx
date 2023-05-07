import { useV2V3ContractLoader } from 'contexts/v2v3/Contracts/useV2V3ContractLoader'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { CV2V3 } from 'models/v2v3/cv'
import { useCallback, useState } from 'react'

export const V2V3ContractsProvider: React.FC<
  React.PropsWithChildren<{
    initialCv?: CV2V3
  }>
> = ({ initialCv, children }) => {
  const [cv, setCv] = useState<CV2V3 | undefined>(initialCv)
  const [cvs, setCvs] = useState<CV2V3[]>([])

  const contracts = useV2V3ContractLoader({ cv })

  const setCvWithLog = useCallback(
    (newCv: CV2V3) => {
      if (newCv === cv) return

      console.info(
        'V2V3ContractsProvider::Switching contracts version to',
        newCv,
      )
      setCv(newCv)
    },
    [setCv, cv],
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
