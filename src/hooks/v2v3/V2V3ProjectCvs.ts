import { CV_V2, CV_V3 } from 'constants/cv'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { CV2V3 } from 'models/v2v3/cv'
import qs from 'qs'
import { useContext, useEffect, useState } from 'react'
import { hasFundingCycle } from 'utils/v2v3/cv'

export const useLoadV2V3ProjectCvs = (projectId: number | undefined) => {
  const { setCv, setCvs } = useContext(V2V3ContractsContext)

  const [loadingCsv, setLoadingCsv] = useState<boolean>(false)

  useEffect(() => {
    async function load() {
      if (!projectId) return

      setLoadingCsv(true)

      const [hasV2FundingCycle, hasV3FundingCycle] = await Promise.all([
        hasFundingCycle(projectId, CV_V2),
        hasFundingCycle(projectId, CV_V3),
      ])

      const cvs: CV2V3[] = []
      if (hasV2FundingCycle) cvs.push(CV_V2)
      if (hasV3FundingCycle) cvs.push(CV_V3)

      const queryCv = qs.parse(window.location.search.slice(1)).cv as CV2V3
      // Use the query param if it's valid.
      // Otherwise use the latest available version.
      const initialCv = cvs.includes(queryCv)
        ? queryCv
        : hasV3FundingCycle
        ? CV_V3
        : CV_V2

      setCv?.(initialCv)
      setCvs?.(cvs)

      setLoadingCsv(false)
    }

    load()
  }, [projectId, setCvs, setCv])

  return { loading: loadingCsv }
}
