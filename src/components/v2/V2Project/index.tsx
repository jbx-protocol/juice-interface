import PayInput from 'components/shared/inputs/Pay/PayInput'
import ProjectHeader from 'components/shared/ProjectHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useV1PayProjectTx } from 'hooks/v1/transactor/PayProjectTx'
import { useContext } from 'react'
import { fromPermille } from 'utils/formatNumber'

import V2PayButton from './Pay/V2PayButton'

export default function V2Project() {
  const {
    projectId,
    projectMetadata,
    fundingCycle,
    payoutSplits,
    reserveTokenSplits,
  } = useContext(V2ProjectContext)

  const payProjectTx = useV1PayProjectTx() // TODO: make this V2

  if (!projectId) return null

  const start = fundingCycle?.start
    ? new Date(fundingCycle?.start?.mul(1000).toNumber())
    : null

  const end =
    fundingCycle?.start && fundingCycle?.duration
      ? new Date(
          fundingCycle?.start.add(fundingCycle?.duration).mul(1000).toNumber(),
        )
      : null

  return (
    <div>
      <ProjectHeader metadata={projectMetadata} />
      {fundingCycle && (
        <div>
          <h2>Funding Cycle details</h2>
          <ul>
            <li>FC#{fundingCycle?.number.toNumber()}</li>
            <li>Discount rate: {fromPermille(fundingCycle.discountRate)}%</li>
            <li>Start: {start?.toISOString()}</li>
            <li>End: {end?.toISOString()}</li>
            <li>Weight: {fundingCycle.weight.toString()}</li>
            <li>Metadata: {fundingCycle?.metadata.toString()}</li>
          </ul>

          <h3>ETH payouts</h3>
          <ul>
            {payoutSplits?.map(split => (
              <li>{split.beneficiary}</li>
            ))}
          </ul>

          <h3>Reserve token allocation</h3>
          <ul>
            {reserveTokenSplits?.map(split => (
              <li>{split.beneficiary}</li>
            ))}
          </ul>
        </div>
      )}
      <PayInput PayButton={V2PayButton} payProjectTx={payProjectTx} />
    </div>
  )
}
