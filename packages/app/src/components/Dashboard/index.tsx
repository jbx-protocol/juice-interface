import { BigNumber } from '@ethersproject/bignumber'
import { Space, Tabs } from 'antd'
import { ContractName } from 'constants/contract-name'
import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { Budget } from 'models/budget'
import { ProjectIdentifier } from 'models/projectIdentifier'
import { CSSProperties, useCallback, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { budgetsDiff } from 'utils/budgetsDiff'

import Loading from '../shared/Loading'
import BudgetsHistory from './BudgetsHistory'
import Project from './Project'
import UpcomingBudget from './UpcomingBudget'
import { deepEqProjectIdentifiers } from '../../utils/deepEqProjectIdentifiers'

export default function Dashboard() {
  const [projectExists, setProjectExists] = useState<boolean>()

  const { userAddress } = useContext(UserContext)

  let { projectId }: { projectId?: string | BigNumber } = useParams()

  projectId = BigNumber.from(projectId)

  const owner = useContractReader<string>({
    contract: ContractName.Projects,
    functionName: 'ownerOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const isOwner = userAddress === owner

  const project = useContractReader<ProjectIdentifier>({
    contract: ContractName.Projects,
    functionName: 'getIdentifier',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: useCallback(
      (oldVal, newVal) => !deepEqProjectIdentifiers(oldVal, newVal),
      [],
    ),
    callback: useCallback(
      (_project?: ProjectIdentifier) => {
        if (projectExists !== undefined) return
        setProjectExists(!!_project)
      },
      [projectExists],
    ),
  })

  const budget = useContractReader<Budget>({
    contract: ContractName.BudgetStore,
    functionName: 'getCurrentBudget',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: budgetsDiff,
  })

  if (projectExists === undefined) return <Loading />

  if (!projectExists) {
    return (
      <div
        style={{
          padding: padding.app,
          height: '100%',
          ...layouts.centered,
        }}
      >
        <h2>No project found with ID</h2>
        <p>{projectId.toString()}</p>
      </div>
    )
  }

  const tabPaneStyle: CSSProperties = {
    paddingTop: padding.app,
    paddingBottom: 60,
  }

  return (
    <div>
      <Space direction="vertical" size="large">
        <Project
          isOwner={isOwner}
          projectId={projectId}
          project={project}
          budget={budget}
          style={layouts.maxWidth}
        />

        <Tabs
          defaultActiveKey="1"
          size="large"
          style={{
            overflow: 'visible',
            width: '100vw',
          }}
          tabBarStyle={{
            ...layouts.maxWidth,
            width: '100vw',
            fontWeight: 600,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <Tabs.TabPane tab="Upcoming" key="future" style={tabPaneStyle}>
            <div style={{ ...layouts.maxWidth }}>
              <div style={{ maxWidth: 600 }}>
                <UpcomingBudget
                  isOwner={owner === userAddress}
                  projectId={projectId}
                />
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="History" key="history" style={tabPaneStyle}>
            <div style={{ ...layouts.maxWidth }}>
              <div style={{ maxWidth: 600 }}>
                <BudgetsHistory isOwner={isOwner} startId={budget?.previous} />
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Space>
    </div>
  )
}
