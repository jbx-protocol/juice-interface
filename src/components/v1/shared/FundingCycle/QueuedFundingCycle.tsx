import { Trans } from '@lingui/macro'
import { CardSection } from 'components/CardSection'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useContext } from 'react'
import PayoutModsList from '../PayoutModsList'
import FundingCycleDetails from './FundingCycleDetails'
import ReservedTokens from './ReservedTokens'

export default function QueuedFundingCycle() {
  const { queuedFC, queuedPayoutMods, queuedTicketMods } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  if (!projectId) return null

  return (
    <div>
      {queuedFC?.number.gt(0) ? (
        <div className="relative">
          <CardSection>
            <FundingCycleDetails fundingCycle={queuedFC} />
          </CardSection>
          <CardSection>
            <PayoutModsList
              mods={queuedPayoutMods}
              fundingCycle={queuedFC}
              projectId={projectId}
              feePerbicent={queuedFC.fee}
            />
          </CardSection>
          <CardSection>
            <ReservedTokens
              fundingCycle={queuedFC}
              ticketMods={queuedTicketMods}
              hideActions={true}
            />
          </CardSection>
        </div>
      ) : (
        <div className="text-grey-500 dark:text-slate-100">
          <Trans>No upcoming cycle</Trans>
        </div>
      )}
    </div>
  )
}
