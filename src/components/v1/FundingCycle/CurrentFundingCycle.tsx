import { CardSection } from 'components/shared/CardSection'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useContext } from 'react'

import FundingCyclePreview from './FundingCyclePreview'
import ReservedTokens from './ReservedTokens'
import Spending from './Spending'

export default function CurrentFundingCycle({
  showCurrentDetail,
}: {
  showCurrentDetail?: boolean
}) {
  const { projectId, currentFC, currentPayoutMods, currentTicketMods } =
    useContext(V1ProjectContext)

  if (!projectId) return null

  return (
    <div style={{ position: 'relative' }}>
      <CardSection>
        <FundingCyclePreview
          fundingCycle={currentFC}
          expand={showCurrentDetail}
        />
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
