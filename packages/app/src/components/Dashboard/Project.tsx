import { SettingOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Col, Row, Space } from 'antd'
import EditProjectModal from 'components/modals/EditProjectModal'
import { CardSection } from 'components/shared/CardSection'
import ProjectLogo from 'components/shared/ProjectLogo'
import { ThemeContext } from 'contexts/themeContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectIdentifier } from 'models/project-identifier'
import { CSSProperties, useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import Funding from './FundingCyclePreview'
import Paid from './Paid'
import Pay from './Pay'
import Rewards from './Rewards'
import Tappable from './Tappable'

export default function Project({
  project,
  projectId,
  fundingCycle,
  showCurrentDetail,
  style,
  isOwner,
}: {
  project: ProjectIdentifier | undefined
  projectId: BigNumber
  isOwner: boolean
  fundingCycle: FundingCycle | undefined
  showCurrentDetail?: boolean
  style?: CSSProperties
}) {
  const [
    editProjectModalVisible,
    setEditProjectModalVisible,
  ] = useState<boolean>(false)

  const { colors } = useContext(ThemeContext).theme

  const converter = useCurrencyConverter()

  const balance = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'balanceOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
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
      [projectId],
    ),
  })

  const balanceInCurrency = useMemo(
    () =>
      balance && converter.wadToCurrency(balance, fundingCycle?.currency, 0),
    [fundingCycle?.currency, balance, converter],
  )

  const totalOverflow = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
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
      [projectId],
    ),
  })

  if (!projectId || !project) return null

  const gutter = 40
  const headerHeight = 80

  return (
    <div style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: gutter,
        }}
      >
        <div style={{ marginRight: 20 }}>
          <ProjectLogo
            uri={project?.logoUri}
            name={project?.name}
            size={headerHeight}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '2.4rem',
              margin: 0,
              color: project.name ? colors.text.primary : colors.text.secondary,
            }}
          >
            {project.name ? project.name : 'Untitled project'}
          </h1>

          <h3>
            <Space size="middle">
              {project?.handle && (
                <span style={{ color: colors.text.secondary }}>
                  @{project.handle}
                </span>
              )}
              {project?.link && (
                <a
                  style={{ fontWeight: 400 }}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.link}
                </a>
              )}
            </Space>
          </h3>
        </div>

        <div
          style={{
            height: headerHeight,
            marginLeft: 20,
          }}
        >
          {isOwner && (
            <Button
              onClick={() => setEditProjectModalVisible(true)}
              icon={<SettingOutlined />}
              type="text"
            ></Button>
          )}
        </div>
      </div>

      <Row gutter={gutter} style={{ marginTop: gutter }}>
        <Col xs={24} md={12}>
          <CardSection padded>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Paid
                projectId={projectId}
                fundingCycle={fundingCycle}
                balanceInCurrency={balanceInCurrency}
              />
              <Tappable
                projectId={projectId}
                fundingCycle={fundingCycle}
                balanceInCurrency={balanceInCurrency}
              />
              <Funding
                fundingCycle={fundingCycle}
                showDetail={showCurrentDetail}
              />
            </Space>
          </CardSection>
        </Col>

        <Col xs={24} md={12}>
          <Pay
            fundingCycle={fundingCycle}
            projectId={projectId}
            project={project}
          />

          <div style={{ marginTop: gutter }}>
            <Rewards
              projectId={projectId}
              currentCycle={fundingCycle}
              totalOverflow={totalOverflow}
              isOwner={isOwner}
            />
          </div>
        </Col>
      </Row>

      <EditProjectModal
        visible={editProjectModalVisible}
        projectId={projectId}
        project={project}
        onSuccess={() => setEditProjectModalVisible(false)}
        onCancel={() => setEditProjectModalVisible(false)}
      />
    </div>
  )
}
