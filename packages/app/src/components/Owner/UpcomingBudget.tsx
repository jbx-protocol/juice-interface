import { Button, Space } from 'antd'
import { ContractName } from 'constants/contract-name'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { Budget } from 'models/budget'
import { useContext, useState } from 'react'

import ReconfigureBudgetModal from '../modals/ReconfigureBudgetModal'
import { CardSection } from '../shared/CardSection'
import BudgetDetail from './BudgetDetail'

export default function UpcomingBudget({
  owner,
}: {
  owner: string | undefined
}) {
  const { userAddress } = useContext(UserContext)

  const [reconfigureModalVisible, setReconfigureModalVisible] = useState<
    boolean
  >(false)

  const queuedBudget = useContractReader<Budget>({
    contract: ContractName.BudgetStore,
    functionName: 'getQueuedBudget',
    args: owner ? [owner] : null,
    updateOn: owner
      ? [
          {
            contract: ContractName.BudgetStore,
            eventName: 'Configure',
            topics: [[], owner],
          },
        ]
      : undefined,
  })

  const isOwner = owner === userAddress

  const spacing = 30

  return (
    <Space size={spacing} direction="vertical">
      {isOwner ? (
        <div>
          <Button onClick={() => setReconfigureModalVisible(true)}>
            Budget configuration
          </Button>
          <ReconfigureBudgetModal
            visible={reconfigureModalVisible}
            onDone={() => setReconfigureModalVisible(false)}
          />
        </div>
      ) : null}
      <CardSection header="Upcoming budget">
        {queuedBudget ? (
          <BudgetDetail budget={queuedBudget} />
        ) : (
          <div style={{ padding: 25 }}>No upcoming budgets</div>
        )}
      </CardSection>
    </Space>
  )
}
