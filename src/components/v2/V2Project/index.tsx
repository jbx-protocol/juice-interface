import { RightCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Col, Row, Space } from 'antd'
import PayInputGroup from 'components/inputs/Pay/PayInputGroup'
import ProjectHeader from 'components/Project/ProjectHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'
// TODO: Do we still need lazy loading?
import VolumeChart from 'components/VolumeChart'

import { useContext, useState } from 'react'

import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2/permissions'
import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'
import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'
import { useRouter } from 'next/router'
import { weightedAmount } from 'utils/v2/math'

import { useIsUserAddress } from 'hooks/IsUserAddress'

import { v2ProjectRoute } from 'utils/routes'
import V2BugNotice from 'components/v2/shared/V2BugNotice'
import { featureFlagEnabled } from 'utils/featureFlags'

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

import { V2ReconfigureProjectHandleDrawer } from './V2ReconfigureProjectHandleDrawer'
import { NftRewardsSection } from './NftRewardsSection'

const AllAssetsButton = ({ onClick }: { onClick: VoidFunction }) => {
  const { theme } = useContext(ThemeContext)
  const secondaryTextStyle = textSecondary(theme)
  return (
    <span
      style={{ ...secondaryTextStyle, cursor: 'pointer' }}
      onClick={onClick}
      role="button"
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
  const canReconfigureFundingCycles = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  const [handleModalVisible, setHandleModalVisible] = useState<boolean>()
  const [payAmount, setPayAmount] = useState<string>('0')

  const { data: queuedFundingCycleResponse } = useProjectQueuedFundingCycle({
    projectId,
  })

  const [queuedFundingCycle] = queuedFundingCycleResponse || []

  const editV2ProjectDetailsTx = useEditV2ProjectDetailsTx()

  // Checks URL to see if user was just directed from project deploy
  const router = useRouter()
  const isNewDeploy = Boolean(router.query.newDeploy)
  const isMobile = useMobile()

  const hasEditPermission = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

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
    router.replace(v2ProjectRoute({ projectId }))
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

  const nftRewardsEnabled = featureFlagEnabled('nftRewards')

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
        owner={projectOwnerAddress}
        onClickSetHandle={
          showAddHandle ? () => setHandleModalVisible(true) : undefined
        }
      />
      {!isPreviewMode &&
        hasCurrentFundingCycle === false &&
        hasQueuedFundingCycle === false && <V2BugNotice />}
      <Row gutter={GUTTER_PX} align={nftRewardsEnabled ? 'top' : 'bottom'}>
        <Col md={colSizeMd} xs={24}>
          <TreasuryStats />
          <div style={{ textAlign: 'right' }}>
            <AllAssetsButton onClick={() => setBalancesModalVisible(true)} />
          </div>
        </Col>
        <Col md={colSizeMd} xs={24}>
          <PayInputGroup
            payAmountETH={payAmount}
            onChange={setPayAmount}
            PayButton={V2PayButton}
            reservedRate={fundingCycleMetadata?.reservedRate.toNumber()}
            weight={fundingCycle?.weight}
            weightingFn={weightedAmount}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            disabled={isPreviewMode || payIsDisabledPreV2Redeploy()}
          />
          {nftRewardsEnabled ? (
            <NftRewardsSection
              payAmountETH={payAmount}
              onPayAmountChange={setPayAmount}
            />
          ) : null}
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
