import { CardSection } from 'components/shared/CardSection'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import FundingCyclePreview from './FundingCyclePreview'
import ReservedTokens from './ReservedTokens'
import Spending from './Spending'

export default function CurrentFundingCycle({
  showCurrentDetail,
}: {
  showCurrentDetail?: boolean
}) {
  const {
    projectId,
    currentFC,
    currentPayoutMods,
    currentTicketMods,
  } = useContext(ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!projectId) return null

  return (
    <div style={{ position: 'relative' }}>
      <CardSection padded style={{ marginBottom: 10 }}>
        <Spending fundingCycle={currentFC} payoutMods={currentPayoutMods} />
      </CardSection>
      <CardSection padded style={{ marginBottom: 10 }}>
        <ReservedTokens
          fundingCycle={currentFC}
          ticketMods={currentTicketMods}
        />
      </CardSection>
      <CardSection padded>
        <FundingCyclePreview
          fundingCycle={currentFC}
          showDetail={showCurrentDetail}
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
