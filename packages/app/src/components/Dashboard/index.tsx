import { BigNumber } from '@ethersproject/bignumber'
import { Space, Tabs } from 'antd'
import { ContractName } from 'constants/contract-name'
import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { Budget } from 'models/budget'
import { ProjectIdentifier } from 'models/projectIdentifier'
import {
  CSSProperties,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { budgetsDiff } from 'utils/budgetsDiff'
import { deepEqProjectIdentifiers } from 'utils/deepEqProjectIdentifiers'

import Loading from '../shared/Loading'
import BudgetsHistory from './BudgetsHistory'
import Project from './Project'
import UpcomingBudget from './UpcomingBudget'

export default function Dashboard() {
  const [projectExists, setProjectExists] = useState<boolean>()

  const { userAddress } = useContext(UserContext)

  const { handle }: { handle?: string } = useParams()

  const projectId = useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'handleResolver',
    args: useMemo(() => {
      if (!handle) return null

      let bytes = utils.formatBytes32String(handle.toLowerCase())

      while (bytes.length > 0 && bytes.charAt(bytes.length - 1) === '0') {
        bytes = bytes.substring(0, bytes.length - 2)
      }

      return [bytes]
    }, [handle]),
    callback: useCallback(
      (id?: BigNumber) => setProjectExists(id?.gt(0) ?? false),
      [projectExists, setProjectExists],
    ),
  })

  const owner = useContractReader<string>({
    contract: ContractName.Projects,
    functionName: 'ownerOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const project = useContractReader<ProjectIdentifier>({
    contract: ContractName.Projects,
    functionName: 'getIdentifier',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: useCallback(
      (oldVal, newVal) => !deepEqProjectIdentifiers(oldVal, newVal),
      [],
    ),
  })

  const budget = useContractReader<Budget>({
    contract: ContractName.BudgetStore,
    functionName: 'getCurrentBudget',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: budgetsDiff,
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

  const isOwner = userAddress === owner

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
        <h2>{handle} not found</h2>
      </div>
    )
  }

  const tabPaneStyle: CSSProperties = {
    paddingTop: padding.app,
    paddingBottom: 60,
  }

  if (!projectId) return null

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
                  isOwner={isOwner}
                  projectId={projectId}
                  currentBudget={budget}
                />
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="History" key="history" style={tabPaneStyle}>
            <div style={{ ...layouts.maxWidth }}>
              <div style={{ maxWidth: 600 }}>
                <BudgetsHistory startId={budget?.previous} />
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Space>
    </div>
  )
}
