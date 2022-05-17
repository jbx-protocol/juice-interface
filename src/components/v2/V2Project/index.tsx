import { Col, Row, Space } from 'antd'
import PayInputGroup from 'components/shared/inputs/Pay/PayInputGroup'
import ProjectHeader from 'components/shared/ProjectHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { lazy, useContext, useState } from 'react'

import { weightedAmount } from 'utils/v2/math'
import { useHistory, useLocation } from 'react-router-dom'

import useMobile from 'hooks/Mobile'

import ProjectActivity from './ProjectActivity'
import TreasuryStats from './TreasuryStats'
import V2FundingCycleSection from './V2FundingCycleSection'
import V2ManageTokensSection from './V2ManageTokensSection'
import NewDeployModal from './NewDeployModal'
import V2PayButton from './V2PayButton'
import V2ProjectHeaderActions from './V2ProjectHeaderActions'

const GUTTER_PX = 40

const VolumeChart = lazy(() => import('../../shared/VolumeChart'))

export default function V2Project({
  singleColumnLayout,
  expandFundingCycleCard,
}: {
  singleColumnLayout?: boolean
  expandFundingCycleCard?: boolean
}) {
  const {
    createdAt,
    projectId,
    projectMetadata,
    fundingCycle,
    fundingCycleMetadata,
    isPreviewMode,
    tokenSymbol,
    tokenAddress,
    cv,
  } = useContext(V2ProjectContext)

  // Checks URL to see if user was just directed from project deploy
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const isNewDeploy = Boolean(params.get('newDeploy'))

  const history = useHistory()

  const isMobile = useMobile()

  const [newDeployModalVisible, setNewDeployModalVisible] =
    useState<boolean>(isNewDeploy)

  const colSizeMd = singleColumnLayout ? 24 : 12

  if (projectId === undefined) return null

  const closeNewDeployModal = () => {
    // Change URL without refreshing page
    history.replace(`/v2/p/${projectId}`)
    setNewDeployModalVisible(false)
  }

  return (
    <Space direction="vertical" size={GUTTER_PX} style={{ width: '100%' }}>
      <ProjectHeader
        metadata={projectMetadata}
        actions={!isPreviewMode ? <V2ProjectHeaderActions /> : undefined}
        isArchived={projectMetadata?.archived}
      />
      <Row gutter={GUTTER_PX} align="bottom">
        <Col md={colSizeMd} xs={24}>
          <TreasuryStats />
        </Col>
        <Col md={colSizeMd} xs={24} style={{ marginTop: GUTTER_PX }}>
          <PayInputGroup
            PayButton={V2PayButton}
            reservedRate={fundingCycleMetadata?.reservedRate.toNumber()}
            weight={fundingCycle?.weight}
            weightingFn={weightedAmount}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            disabled={isPreviewMode}
          />
        </Col>
      </Row>
      <Row gutter={GUTTER_PX}>
        <Col md={colSizeMd} xs={24}>
          <Space
            direction="vertical"
            size={GUTTER_PX}
            style={{ width: '100%' }}
          >
            {!isPreviewMode ? (
              <VolumeChart
                style={{ height: 240 }}
                createdAt={createdAt}
                projectId={projectId}
                cv={cv ?? '2'}
              />
            ) : null}
            <V2ManageTokensSection />
            <V2FundingCycleSection expandCard={expandFundingCycleCard} />
          </Space>
        </Col>

        {!isPreviewMode ? (
          <Col
            md={colSizeMd}
            xs={24}
            style={{ marginTop: isMobile ? GUTTER_PX : 0 }}
          >
            <ProjectActivity />
          </Col>
        ) : null}
      </Row>
      <NewDeployModal
        visible={newDeployModalVisible}
        onClose={closeNewDeployModal}
      />
    </Space>
  )
}
