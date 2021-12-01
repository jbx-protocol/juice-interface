import { CardSection } from 'components/shared/CardSection'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { hasFundingTarget } from 'utils/fundingCycle'

import ReservedTokens from '../Dashboard/ReservedTokens'
import PayoutModsList from '../shared/PayoutModsList'
import FundingCycleDetails from './FundingCycleDetails'

export default function QueuedFundingCycle() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { projectId, queuedFC, queuedPayoutMods, queuedTicketMods } =
    useContext(ProjectContext)

  if (!projectId) return null

  return (
    <div>
      {queuedFC?.number.gt(0) ? (
        hasFundingTarget(queuedFC) ? (
          <div style={{ position: 'relative' }}>
            <CardSection>
              <FundingCycleDetails fundingCycle={queuedFC} />
            </CardSection>
            <CardSection>
              <PayoutModsList
                mods={queuedPayoutMods}
                fundingCycle={queuedFC}
                projectId={projectId}
                fee={queuedFC.fee}
              />
            </CardSection>
            <CardSection>
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
