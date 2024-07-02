import { CardSection } from 'components/CardSection'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { useContext } from 'react'

import FundingCyclePreview from './FundingCyclePreview'
import ReservedTokens from './ReservedTokens'
import Spending from './Spending'

export default function CurrentFundingCycle() {
  const { currentFC, currentPayoutMods, currentTicketMods } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  if (!projectId) return null

  return (
    <div className="relative">
      <CardSection>
        <FundingCyclePreview fundingCycle={currentFC} />
      </CardSection>
      <CardSection>
        <Spending payoutMods={currentPayoutMods} />
      </CardSection>
      <CardSection>
        <ReservedTokens
          fundingCycle={currentFC}
          ticketMods={currentTicketMods}
        />
      </CardSection>
    </div>
  )
}
