import { BigNumber } from '@ethersproject/bignumber'
import { Button, Space } from 'antd'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { useState } from 'react'

import ReconfigureBudgetModal from '../modals/ReconfigureBudgetModal'
import { CardSection } from '../shared/CardSection'
import FundingCycleDetails from './FundingCycleDetails'

export default function QueuedFundingCycle({
  projectId,
  isOwner,
  currentCycle,
}: {
  projectId: BigNumber
  isOwner: boolean
  currentCycle: FundingCycle | undefined
}) {
  const [
    reconfigureModalVisible,
    setReconfigureModalVisible,
  ] = useState<boolean>(false)

  const queuedCycle = useContractReader<FundingCycle>({
    contract: ContractName.FundingCycles,
    functionName: 'getQueued',
    args: projectId ? [projectId.toHexString()] : null,
    updateOn: projectId
      ? [
          {
            contract: ContractName.FundingCycles,
            eventName: 'Reconfigure',
            topics: [[], projectId.toHexString()],
          },
        ]
      : undefined,
  })

  const spacing = 30

  return (
    <Space size={spacing} direction="vertical" style={{ width: '100%' }}>
      {isOwner ? (
        <div>
          <Button onClick={() => setReconfigureModalVisible(true)}>
            Reconfigure funding
          </Button>
          <ReconfigureBudgetModal
            visible={reconfigureModalVisible}
            onDone={() => setReconfigureModalVisible(false)}
            fundingCycle={queuedCycle ?? currentCycle}
            projectId={projectId}
          />
        </div>
      ) : null}
      <CardSection>
        {queuedCycle ? (
          <FundingCycleDetails fundingCycle={queuedCycle} />
        ) : (
          <div style={{ padding: 25 }}>No upcoming funding cycle</div>
        )}
      </CardSection>
    </Space>
  )
}
