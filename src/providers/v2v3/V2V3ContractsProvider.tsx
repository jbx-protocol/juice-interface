import { CV_V2, CV_V3 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useV2V3ContractLoader } from 'hooks/v2v3/V2V3ContractLoader'
import { CV2V3 } from 'models/cv'
import { useContext, useEffect, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { hasFundingCycle } from 'utils/v2v3/cv'

export const useSetCv = (projectId: number | undefined) => {
  const { setVersion, setCvs } = useContext(V2V3ContractsContext)

  useEffect(() => {
    async function load() {
      if (!projectId) return

      const [hasV2FundingCycle, hasV3FundingCycle] = await Promise.all([
        hasFundingCycle(projectId, CV_V2),
        featureFlagEnabled(FEATURE_FLAGS.V3)
          ? hasFundingCycle(projectId, CV_V3)
          : Promise.resolve(false),
      ])

      const cv = hasV3FundingCycle ? CV_V3 : CV_V2

      const cvs: CV2V3[] = []
      if (hasV2FundingCycle) cvs.push(CV_V2)
      if (hasV3FundingCycle) cvs.push(CV_V3)

      setVersion?.(cv)
      setCvs?.(cvs)
    }

    load()
  }, [projectId, setVersion, setCvs])
}

// TODO this needs to probably be reverted, and there
// needs to be some other logic that determines which CV to use
export const V2V3ContractsProvider: React.FC<{
  initialCv?: CV2V3
}> = ({ initialCv, children }) => {
  const [cv, setCv] = useState<CV2V3 | undefined>(initialCv)
  const [cvs, setCvs] = useState<CV2V3[]>()

  const contracts = useV2V3ContractLoader({ cv })

  return (
    <V2V3ContractsContext.Provider
      value={{
        contracts,
        cv,
        cvs,
        setVersion: (newCv: CV2V3) => {
          console.info(
            'V2V3ContractsProvider::Switching contracts version to',
            newCv,
          )
          setCv(newCv)
        },
        setCvs,
      }}
    >
      {children}
    </V2V3ContractsContext.Provider>
  )
}
