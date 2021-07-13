import { BigNumber } from '@ethersproject/bignumber'
import { Button, Space } from 'antd'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { useState } from 'react'
import { hasFundingTarget } from 'utils/fundingCycle'

import ReconfigureBudgetModal from '../modals/ReconfigureBudgetModal'
import FundingCycleDetails from './FundingCycleDetails'

export default function QueuedFundingCycle({
  projectId,
  isOwner,
  currentCycle,
}: {
  projectId: BigNumber
  isOwner?: boolean
  currentCycle: FundingCycle | undefined
}) {
  const [reconfigureModalVisible, setReconfigureModalVisible] = useState<
    boolean
  >(false)

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

  const spacing = 30

  return (
    <div>
      <Space size={spacing} direction="vertical" style={{ width: '100%' }}>
        {isOwner && (
          <Button onClick={() => setReconfigureModalVisible(true)} size="small">
            {queuedCycle?.id.gt(0) ? 'Reconfigure' : 'Configure funding cycles'}
          </Button>
        )}
        {queuedCycle?.id.gt(0) ? (
          hasFundingTarget(queuedCycle) ? (
            <FundingCycleDetails fundingCycle={queuedCycle} />
          ) : null
        ) : (
          <div>No upcoming funding cycle</div>
        )}
      </Space>

      <ReconfigureBudgetModal
        visible={reconfigureModalVisible}
        onDone={() => setReconfigureModalVisible(false)}
        fundingCycle={queuedCycle?.id.gt(0) ? queuedCycle : currentCycle}
        projectId={projectId}
      />
    </div>
  )
}
