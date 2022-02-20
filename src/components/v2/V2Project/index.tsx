import ProjectHeader from 'components/shared/ProjectHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'
import { fromPermille } from 'utils/formatNumber'

export default function V2Project() {
  const { projectId, metadata, fundingCycle } = useContext(V2ProjectContext)
  if (!projectId) return null

  return (
    <div>
      <ProjectHeader metadata={metadata} />
      {fundingCycle && (
        <div>
          <ul>
            <li>Discount rate: {fromPermille(fundingCycle.discountRate)}%</li>
            <li>Weight: {fundingCycle.weight.toString()}</li>
          </ul>
        </div>
      )}
    </div>
  )
}
