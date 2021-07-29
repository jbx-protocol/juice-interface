import { BigNumber } from '@ethersproject/bignumber'
import { Button, Space } from 'antd'
import { CardSection } from 'components/shared/CardSection'
import { ThemeContext } from 'contexts/themeContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod, TicketMod } from 'models/mods'
import { useContext, useState } from 'react'
import { hasFundingTarget } from 'utils/fundingCycle'

import ReconfigureBudgetModal from '../modals/ReconfigureBudgetModal'
import FundingCycleDetails from './FundingCycleDetails'
import PayoutModsList from './PayoutModsList'
import ReservedTokens from './ReservedTokens'

export default function QueuedFundingCycle({
  projectId,
  isOwner,
  currentCycle,
  tokenSymbol,
}: {
  projectId: BigNumber
  isOwner?: boolean
  currentCycle: FundingCycle | undefined
  tokenSymbol: string | undefined
}) {
  const [reconfigureModalVisible, setReconfigureModalVisible] = useState<
    boolean
  >(false)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const queuedCycle = useContractReader<FundingCycle>({
    contract: ContractName.FundingCycles,
    functionName: 'queuedOf',
    args: projectId ? [projectId.toHexString()] : null,
    updateOn: projectId
      ? [
          {
            contract: ContractName.FundingCycles,
            eventName: 'Configure',
            topics: [[], projectId.toHexString()],
          },
        ]
      : undefined,
  })

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
      <Space size={spacing} direction="vertical" style={{ width: '100%' }}>
        {isOwner && (
          <Button onClick={() => setReconfigureModalVisible(true)} size="small">
            {queuedCycle?.id.gt(0) ? 'Reconfigure' : 'Configure funding cycles'}
          </Button>
        )}
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
      </Space>

      <ReconfigureBudgetModal
        visible={reconfigureModalVisible}
        onDone={() => setReconfigureModalVisible(false)}
        fundingCycle={queuedCycle?.number.gt(0) ? queuedCycle : currentCycle}
        projectId={projectId}
      />
    </div>
  )
}
