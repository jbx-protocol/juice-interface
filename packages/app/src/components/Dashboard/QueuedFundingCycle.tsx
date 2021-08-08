import { CardSection } from 'components/shared/CardSection'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { hasFundingTarget } from 'utils/fundingCycle'

import FundingCycleDetails from './FundingCycleDetails'
import PayoutModsList from './PayoutModsList'
import ReservedTokens from './ReservedTokens'

export default function QueuedFundingCycle() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const {
    projectId,
    isOwner,
    queuedFC,
    queuedPayoutMods,
    queuedTicketMods,
  } = useContext(ProjectContext)

  if (!projectId) return null

  return (
    <div>
      {queuedFC?.number.gt(0) ? (
        hasFundingTarget(queuedFC) ? (
          <div style={{ position: 'relative' }}>
            <CardSection padded style={{ marginBottom: 10 }}>
              <FundingCycleDetails fundingCycle={queuedFC} />
            </CardSection>
            <CardSection padded style={{ marginBottom: 10 }}>
              <PayoutModsList
                mods={queuedPayoutMods}
                fundingCycle={queuedFC}
                projectId={projectId}
                isOwner={isOwner}
              />
            </CardSection>
            <CardSection padded>
              <ReservedTokens
                fundingCycle={queuedFC}
                ticketMods={queuedTicketMods}
                hideActions={true}
              />
            </CardSection>
            <div
              style={{
                position: 'absolute',
                zIndex: -1,
                left: 10,
                right: -10,
                top: 10,
                bottom: 0,
                background: colors.background.l1,
              }}
            ></div>
          </div>
        ) : null
      ) : (
        <div>No upcoming funding cycle</div>
      )}
    </div>
  )
}
