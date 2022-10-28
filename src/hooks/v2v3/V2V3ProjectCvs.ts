import { CV_V2, CV_V3 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { CV2V3 } from 'models/cv'
import { useContext, useEffect, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { hasFundingCycle } from 'utils/v2v3/cv'

export const useLoadV2V3ProjectCvs = (projectId: number | undefined) => {
  const { setCv, setCvs } = useContext(V2V3ContractsContext)

  const [loadingCsv, setLoadingCsv] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      if (!projectId) return

      setLoadingCsv(true)

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

      setCv?.(cv)
      setCvs?.(cvs)

      setLoadingCsv(false)
    }

    load()
  }, [projectId, setCvs, setCv])

  return { loading: loadingCsv }
}
