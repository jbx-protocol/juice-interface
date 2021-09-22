import { CardSection } from 'components/shared/CardSection'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import FundingCyclePreview from './FundingCyclePreview'
import ReservedTokens from '../Dashboard/ReservedTokens'
import Spending from '../Dashboard/Spending'

export default function CurrentFundingCycle({
  showCurrentDetail,
}: {
  showCurrentDetail?: boolean
}) {
  const { projectId, currentFC, currentPayoutMods, currentTicketMods } =
    useContext(ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!projectId) return null

  return (
    <div style={{ position: 'relative' }}>
      <CardSection>
        <FundingCyclePreview
          fundingCycle={currentFC}
          showDetail={showCurrentDetail}
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
  )
}
