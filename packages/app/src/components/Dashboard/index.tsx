import { BigNumber } from '@ethersproject/bignumber'
import { Col, Row, Tabs } from 'antd'
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
import { normalizeHandle } from 'utils/formatHandle'

import Loading from '../shared/Loading'
import BudgetsHistory from './BudgetsHistory'
import PayEvents from './PayEvents'
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

      let bytes = utils.formatBytes32String(normalizeHandle(handle))

      while (bytes.length > 0 && bytes.charAt(bytes.length - 1) === '0') {
        bytes = bytes.substring(0, bytes.length - 2)
      }

      return [bytes]
    }, [handle]),
    callback: useCallback(
      (id?: BigNumber) => setProjectExists(id?.gt(0) ?? false),
      [setProjectExists],
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
    <div style={layouts.maxWidth}>
      <Project
        isOwner={isOwner}
        projectId={projectId}
        project={project}
        budget={budget}
      />

      <div style={{ marginTop: 80 }}>
        <Row gutter={40}>
          <Col xs={24} md={12}>
            <Tabs
              defaultActiveKey="upcoming"
              size="large"
              tabBarStyle={{
                fontWeight: 600,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
              style={{ overflow: 'visible' }}
            >
              <Tabs.TabPane tab="Upcoming" key="upcoming" style={tabPaneStyle}>
                <UpcomingBudget
                  isOwner={isOwner}
                  projectId={projectId}
                  currentBudget={budget}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="History" key="history" style={tabPaneStyle}>
                <BudgetsHistory startId={budget?.previous} />
              </Tabs.TabPane>
            </Tabs>
          </Col>

          <Col xs={24} md={12}>
            <PayEvents projectId={projectId} />
          </Col>
        </Row>
      </div>
    </div>
  )
}
