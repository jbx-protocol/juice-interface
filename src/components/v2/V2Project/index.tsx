import { RightCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Col, Row, Space } from 'antd'
import PayInputGroup from 'components/inputs/Pay/PayInputGroup'
import ProjectHeader from 'components/Project/ProjectHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { lazy, useContext, useState } from 'react'

import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import {
  useHasPermission,
  V2OperatorPermission,
} from 'hooks/v2/contractReader/HasPermission'
import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'
import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'
import { useHistory, useLocation } from 'react-router-dom'
import { weightedAmount } from 'utils/v2/math'

import { useIsUserAddress } from 'hooks/IsUserAddress'

import { v2ProjectRoute } from 'utils/routes'
import V2BugNotice from 'components/v2/shared/V2BugNotice'

import { textSecondary } from 'constants/styles/text'
import { V2_PROJECT_IDS } from 'constants/v2/projectIds'
import { RelaunchFundingCycleBanner } from './banners/RelaunchFundingCycleBanner'
import NewDeployModal from './NewDeployModal'
import ProjectActivity from './ProjectActivity'
import TreasuryStats from './TreasuryStats'
import { V2BalancesModal } from './V2BalancesModal/V2BalancesModal'
import V2FundingCycleSection from './V2FundingCycleSection'
import V2ManageTokensSection from './V2ManageTokensSection'
import V2PayButton from './V2PayButton'
import V2ProjectHeaderActions from './V2ProjectHeaderActions'

const GUTTER_PX = 40

const VolumeChart = lazy(() => import('components/VolumeChart'))
import { V2ReconfigureProjectHandleDrawer } from './V2ReconfigureProjectHandleDrawer'

const AllAssetsButton = ({ onClick }: { onClick: VoidFunction }) => {
  const { theme } = useContext(ThemeContext)
  const secondaryTextStyle = textSecondary(theme)
  return (
    <span
      style={{ ...secondaryTextStyle, cursor: 'pointer' }}
      onClick={onClick}
    >
      <Trans>All assets</Trans> <RightCircleOutlined />
    </span>
  )
}

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
    isArchived,
    projectOwnerAddress,
    handle,
  } = useContext(V2ProjectContext)
  const canReconfigureFundingCycles = useHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  const [handleModalVisible, setHandleModalVisible] = useState<boolean>()

  const { data: queuedFundingCycleResponse } = useProjectQueuedFundingCycle({
    projectId,
  })

  const [queuedFundingCycle] = queuedFundingCycleResponse || []

  const editV2ProjectDetailsTx = useEditV2ProjectDetailsTx()

  // Checks URL to see if user was just directed from project deploy
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const isNewDeploy = Boolean(params.get('newDeploy'))
  const history = useHistory()
  const isMobile = useMobile()

  const hasEditPermission = useHasPermission(V2OperatorPermission.RECONFIGURE)

  const isOwner = useIsUserAddress(projectOwnerAddress)

  const [newDeployModalVisible, setNewDeployModalVisible] =
    useState<boolean>(isNewDeploy)
  const [balancesModalVisible, setBalancesModalVisible] =
    useState<boolean>(false)

  const colSizeMd = singleColumnLayout ? 24 : 12
  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)
  const hasQueuedFundingCycle = queuedFundingCycle?.number.gt(0)
  const showAddHandle = isOwner && !isPreviewMode && !handle

  if (projectId === undefined) return null

  const closeNewDeployModal = () => {
    // Change URL without refreshing page
    history.replace(v2ProjectRoute({ projectId }))
    setNewDeployModalVisible(false)
  }

  // Temporarily disable pay for V2 projects until V2 contracts have been redeployed
  const payIsDisabledPreV2Redeploy = () => {
    // Do not disable pay for projects with these ids
    const exceptionProjectIds = [V2_PROJECT_IDS.MOON_MARS]

    if (exceptionProjectIds.includes(projectId)) return false

    // disable if there's no current funding cycle
    return !hasCurrentFundingCycle
  }

  return (
    <Space direction="vertical" size={GUTTER_PX} style={{ width: '100%' }}>
      {!hasCurrentFundingCycle &&
      !hasQueuedFundingCycle &&
      canReconfigureFundingCycles ? (
        <RelaunchFundingCycleBanner />
      ) : null}

      <ProjectHeader
        metadata={projectMetadata}
        actions={!isPreviewMode ? <V2ProjectHeaderActions /> : undefined}
        isArchived={isArchived}
        handle={handle}
        onClickSetHandle={
          showAddHandle ? () => setHandleModalVisible(true) : undefined
        }
      />
      {!isPreviewMode &&
        hasCurrentFundingCycle === false &&
        hasQueuedFundingCycle === false && <V2BugNotice />}
      <Row gutter={GUTTER_PX} align="bottom">
        <Col md={colSizeMd} xs={24}>
          <TreasuryStats />
          <div style={{ textAlign: 'right' }}>
            <AllAssetsButton onClick={() => setBalancesModalVisible(true)} />
          </div>
        </Col>
        <Col md={colSizeMd} xs={24} style={{ marginTop: GUTTER_PX }}>
          <PayInputGroup
            PayButton={V2PayButton}
            reservedRate={fundingCycleMetadata?.reservedRate.toNumber()}
            weight={fundingCycle?.weight}
            weightingFn={weightedAmount}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            disabled={isPreviewMode || payIsDisabledPreV2Redeploy()}
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
      <V2BalancesModal
        owner={projectOwnerAddress}
        projectMetadata={projectMetadata}
        projectName={projectMetadata?.name}
        hasEditPermissions={hasEditPermission}
        visible={balancesModalVisible}
        onCancel={() => setBalancesModalVisible(false)}
        storeCidTx={editV2ProjectDetailsTx}
      />
      {showAddHandle && (
        <V2ReconfigureProjectHandleDrawer
          visible={handleModalVisible}
          onFinish={() => setHandleModalVisible(false)}
        />
      )}
    </Space>
  )
}
