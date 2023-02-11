import { CV_V2, CV_V3 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { CV2V3 } from 'models/v2v3/cv'
import { useContext, useEffect, useState } from 'react'
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
        hasFundingCycle(projectId, CV_V3),
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
