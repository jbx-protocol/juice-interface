import { BigNumber } from '@ethersproject/bignumber'
import { CardSection } from 'components/shared/CardSection'
import { ThemeContext } from 'contexts/themeContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { useContext } from 'react'
import { hasFundingTarget } from 'utils/fundingCycle'

import FundingCycleDetails from './FundingCycleDetails'
import PayoutModsList from './PayoutModsList'
import ReservedTokens from './ReservedTokens'

export default function QueuedFundingCycle({
  projectId,
  isOwner,
  queuedCycle,
  tokenSymbol,
}: {
  projectId: BigNumber
  isOwner?: boolean
  queuedCycle: FundingCycle | undefined
  tokenSymbol: string | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const payoutMods = useContractReader<PayoutMod[]>({
    contract: ContractName.ModStore,
    functionName: 'payoutModsOf',
    args:
      projectId && queuedCycle
        ? [projectId.toHexString(), queuedCycle.configured.toHexString()]
        : null,
    updateOn:
      projectId && queuedCycle
        ? [
            {
              contract: ContractName.ModStore,
              eventName: 'SetPayoutMod',
              topics: [
                projectId.toHexString(),
                queuedCycle.configured.toHexString(),
              ],
            },
          ]
        : [],
  })

  const ticketMods = useContractReader<TicketMod[]>({
    contract: ContractName.ModStore,
    functionName: 'ticketModsOf',
    args:
      projectId && queuedCycle
        ? [projectId.toHexString(), queuedCycle.configured.toHexString()]
        : null,
    updateOn:
      projectId && queuedCycle
        ? [
            {
              contract: ContractName.ModStore,
              eventName: 'SetTicketMod',
              topics: [
                projectId.toHexString(),
                queuedCycle.configured.toHexString(),
              ],
            },
          ]
        : [],
  })

  const spacing = 30

  return (
    <div>
      {queuedCycle?.number.gt(0) ? (
        hasFundingTarget(queuedCycle) ? (
          <div style={{ position: 'relative' }}>
            <CardSection padded style={{ marginBottom: 10 }}>
              <FundingCycleDetails fundingCycle={queuedCycle} />
            </CardSection>
            <CardSection padded style={{ marginBottom: 10 }}>
              <PayoutModsList
                mods={payoutMods}
                fundingCycle={queuedCycle}
                projectId={projectId}
                isOwner={isOwner}
              />
            </CardSection>
            <CardSection padded>
              <ReservedTokens
                fundingCycle={queuedCycle}
                ticketMods={ticketMods}
                tokenSymbol={tokenSymbol}
                projectId={projectId}
                isOwner={isOwner}
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
