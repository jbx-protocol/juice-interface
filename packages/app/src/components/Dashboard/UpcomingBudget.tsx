import { BigNumber } from '@ethersproject/bignumber'
import { Button, Space } from 'antd'
import { ContractName } from 'constants/contract-name'
import useContractReader from 'hooks/ContractReader'
import { Budget } from 'models/budget'
import { useState } from 'react'

import ReconfigureBudgetModal from '../modals/ReconfigureBudgetModal'
import { CardSection } from '../shared/CardSection'
import BudgetDetail from './BudgetDetail'

export default function UpcomingBudget({
  projectId,
  isOwner,
}: {
  projectId: BigNumber
  isOwner: boolean
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
            eventName: 'Configure',
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
            budget={undefined} // TODO
          />
        </div>
      ) : null}
      <CardSection>
        {queuedBudget ? (
          <BudgetDetail
            showDetail={true}
            isOwner={isOwner}
            budget={queuedBudget}
          />
        ) : (
          <div style={{ padding: 25 }}>No upcoming budget</div>
        )}
      </CardSection>
    </Space>
  )
}
