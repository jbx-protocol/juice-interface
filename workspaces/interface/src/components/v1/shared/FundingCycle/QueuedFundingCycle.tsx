import { CardSection } from 'components/CardSection'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useContext } from 'react'

import PayoutModsList from '../PayoutModsList'
import FundingCycleDetails from './FundingCycleDetails'
import ReservedTokens from './ReservedTokens'

export default function QueuedFundingCycle() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { projectId, queuedFC, queuedPayoutMods, queuedTicketMods } =
    useContext(V1ProjectContext)

  if (!projectId) return null

  return (
    <div>
      {queuedFC?.number.gt(0) ? (
        <div style={{ position: 'relative' }}>
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
      ) : (
        <div>No upcoming funding cycle</div>
      )}
    </div>
  )
}
