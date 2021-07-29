import { BigNumber } from '@ethersproject/bignumber'
import { CardSection } from 'components/shared/CardSection'
import { ThemeContext } from 'contexts/themeContext'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { useContext } from 'react'
import FundingCyclePreview from './FundingCyclePreview'
import ReservedTokens from './ReservedTokens'
import Spending from './Spending'

export default function CurrentFundingCycle({
  projectId,
  isOwner,
  fundingCycle,
  tokenSymbol,
  payoutMods,
  ticketMods,
  balanceInCurrency,
  showCurrentDetail,
}: {
  projectId: BigNumber
  isOwner?: boolean
  fundingCycle: FundingCycle | undefined
  tokenSymbol: string | undefined
  payoutMods: PayoutMod[] | undefined
  ticketMods: TicketMod[] | undefined
  balanceInCurrency: BigNumber | undefined
  showCurrentDetail?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div style={{ position: 'relative' }}>
      <CardSection padded style={{ marginBottom: 10 }}>
        <Spending
          fundingCycle={fundingCycle}
          payoutMods={payoutMods}
          projectId={projectId}
          isOwner={isOwner}
          balanceInCurrency={balanceInCurrency}
        />
      </CardSection>
      <CardSection padded style={{ marginBottom: 10 }}>
        <ReservedTokens
          fundingCycle={fundingCycle}
          ticketMods={ticketMods}
          tokenSymbol={tokenSymbol}
          projectId={projectId}
          isOwner={isOwner}
        />
      </CardSection>
      <CardSection padded>
        <FundingCyclePreview
          fundingCycle={fundingCycle}
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
