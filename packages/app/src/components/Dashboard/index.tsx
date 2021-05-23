import { BigNumber } from '@ethersproject/bignumber'
import { Col, Row, Tabs } from 'antd'
import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import { utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectIdentifier } from 'models/project-identifier'
import {
  CSSProperties,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { deepEqFundingCycles } from 'utils/deepEqFundingCycles'
import { deepEqProjectIdentifiers } from 'utils/deepEqProjectIdentifiers'
import { normalizeHandle } from 'utils/formatHandle'

import Loading from '../shared/Loading'
import FundingHistory from './FundingHistory'
import PayEvents from './PayEvents'
import Project from './Project'
import QueuedFundingCycle from './QueuedFundingCycle'

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

      // Trim trailing zeros
      while (bytes.length && bytes.charAt(bytes.length - 1) === '0') {
        bytes = bytes.substring(0, bytes.length - 1)
      }
      // Bytes must have even length
      if (bytes.length % 2 === 1) bytes += '0'

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
    functionName: 'getInfo',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: useCallback(
      (oldVal, newVal) => !deepEqProjectIdentifiers(oldVal, newVal),
      [],
    ),
  })

  const fundingCycle = useContractReader<FundingCycle>({
    contract: ContractName.FundingCycles,
    functionName: 'getCurrent',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: (a, b) => !deepEqFundingCycles(a, b),
    updateOn: projectId
      ? [
          {
            contract: ContractName.Juicer,
            eventName: 'Reconfigure',
            topics: [[], projectId.toHexString()],
          },
          {
            contract: ContractName.Juicer,
            eventName: 'Pay',
            topics: [[], projectId.toHexString()],
          },
          {
            contract: ContractName.Juicer,
            eventName: 'Tap',
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
        fundingCycle={fundingCycle}
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
                <QueuedFundingCycle
                  isOwner={isOwner}
                  projectId={projectId}
                  currentCycle={fundingCycle}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="History" key="history" style={tabPaneStyle}>
                <FundingHistory startId={fundingCycle?.previous} />
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
