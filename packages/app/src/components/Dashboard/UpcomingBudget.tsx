import { BigNumber } from '@ethersproject/bignumber'
import { Button, Space } from 'antd'
import { ContractName } from 'constants/contract-name'
import useContractReader from 'hooks/ContractReader'
import { Budget } from 'models/budget'
import { useState } from 'react'

import ReconfigureBudgetModal from '../modals/ReconfigureBudgetModal'
import { CardSection } from '../shared/CardSection'
import FundingTerm from './FundingTerm'

export default function UpcomingBudget({
  projectId,
  isOwner,
  currentBudget,
}: {
  projectId: BigNumber
  isOwner: boolean
  currentBudget: Budget | null | undefined
}) {
  const [reconfigureModalVisible, setReconfigureModalVisible] = useState<
    boolean
  >(false)

  const queuedBudget = useContractReader<Budget>({
    contract: ContractName.BudgetStore,
    functionName: 'getQueuedBudget',
    args: projectId ? [projectId.toHexString()] : null,
    updateOn: projectId
      ? [
          {
            contract: ContractName.BudgetStore,
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
            Reconfigure budget
          </Button>
          <ReconfigureBudgetModal
            visible={reconfigureModalVisible}
            onDone={() => setReconfigureModalVisible(false)}
            budget={queuedBudget ?? currentBudget}
            projectId={projectId}
          />
        </div>
      ) : null}
      <CardSection>
        {queuedBudget ? (
          <FundingTerm showDetail={true} budget={queuedBudget} />
        ) : (
          <div style={{ padding: 25 }}>No upcoming budget</div>
        )}
      </CardSection>
    </Space>
  )
}
