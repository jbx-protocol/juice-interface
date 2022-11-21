import { t, Trans } from '@lingui/macro'
import { Button, Divider, Form, Input, Space } from 'antd'
import { useIsNftProject } from 'components/Create/hooks/DeployProject/hooks'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import RichButton from 'components/RichButton'
import { FundingDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/FundingDrawer'
import NftDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer'
import { RulesDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/RulesDrawer'
import { TokenDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/TokenDrawer'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useNftDeployerCanReconfigure } from 'hooks/JB721Delegate/contractReader/NftDeployerCanReconfigure'
import { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { useEditingFundingCycleConfig } from '../../../../ReconfigureFundingCycleSettingsPage/hooks/editingFundingCycleConfig'
import ReconfigurePreview from '../../../../ReconfigureFundingCycleSettingsPage/ReconfigurePreview'
import { SetNftOperatorPermissionsButton } from '../../../../ReconfigureFundingCycleSettingsPage/SetNftOperatorPermissionsButton'
import { useLaunchFundingCycles } from './hooks/LaunchFundingCycles'

export function LaunchFundingCycleForm() {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>(false)
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>(false)
  const [nftDrawerVisible, setNftDrawerVisible] = useState<boolean>(false)
  const [unsavedChangesModalVisibile, setUnsavedChangesModalVisible] =
    useState<boolean>(false)
  const [nftOperatorConfirmed, setNftOperatorConfirmed] = useState<boolean>()

  const dispatch = useDispatch()
  const editingFundingCycleConfig = useEditingFundingCycleConfig()
  const { launchFundingCycleLoading, launchFundingCycle } =
    useLaunchFundingCycles({ editingFundingCycleConfig })

  const isNftFundingCycle = useIsNftProject()
  const nftDeployerCanReconfigure = useNftDeployerCanReconfigure({
    projectId,
    projectOwnerAddress,
  })

  const closeReconfigureDrawer = () => {
    setFundingDrawerVisible(false)
    setTokenDrawerVisible(false)
    setNftDrawerVisible(false)
    setRulesDrawerVisible(false)
  }
  const closeUnsavedChangesModal = () => setUnsavedChangesModalVisible(false)
  const closeUnsavedChangesModalAndExit = () => {
    closeUnsavedChangesModal()
  }

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Form layout="vertical">
          <Form.Item
            label={<Trans>Start time (seconds, Unix time)</Trans>}
            extra={<Trans>Leave blank to start immediately.</Trans>}
          >
            <Input
              type="number"
              min={0}
              onChange={e => {
                const time = e.target.value
                dispatch(editingV2ProjectActions.setMustStartAtOrAfter(time))
              }}
            />
          </Form.Item>
        </Form>
        <RichButton
          heading={t`Funding`}
          description={t`Configure how your project will collect and spend funds.`}
          onClick={() => setFundingDrawerVisible(true)}
        />
        <RichButton
          heading={t`Token`}
          description={t`Configure your project's token.`}
          onClick={() => setTokenDrawerVisible(true)}
        />
        <RichButton
          heading={t`NFTs (optional)`}
          description={t`Configure your project's NFTs.`}
          onClick={() => setNftDrawerVisible(true)}
        />
        <RichButton
          heading={t`Rules`}
          description={t`Configure restrictions for your funding cycles.`}
          onClick={() => setRulesDrawerVisible(true)}
        />

        <Divider />

        <h3 className="text-primary" style={{ fontSize: '1.2rem' }}>
          <Trans>Review and deploy</Trans>
        </h3>
        <div style={{ marginBottom: '1rem' }}>
          <ReconfigurePreview
            payoutSplits={
              editingFundingCycleConfig.editingPayoutGroupedSplits.splits
            }
            reserveSplits={
              editingFundingCycleConfig.editingReservedTokensGroupedSplits
                .splits
            }
            fundingCycleMetadata={
              editingFundingCycleConfig.editingFundingCycleMetadata
            }
            fundingCycleData={editingFundingCycleConfig.editingFundingCycleData}
            fundAccessConstraints={
              editingFundingCycleConfig.editingFundAccessConstraints
            }
            nftRewards={
              editingFundingCycleConfig.editingNftRewards?.rewardTiers
            }
          />
        </div>

        {isNftFundingCycle && !nftDeployerCanReconfigure ? (
          <Space size="large" direction="vertical">
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>
                1.
              </span>
              <SetNftOperatorPermissionsButton
                onConfirmed={() => setNftOperatorConfirmed(true)}
                size="large"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>
                2.
              </span>
              <Button
                loading={launchFundingCycleLoading}
                onClick={launchFundingCycle}
                type="primary"
                disabled={!nftOperatorConfirmed}
                size="large"
              >
                <span>
                  <Trans>Launch V3 funding cycle</Trans>
                </span>
              </Button>
            </div>
          </Space>
        ) : (
          <Button
            loading={launchFundingCycleLoading}
            onClick={launchFundingCycle}
            type="primary"
            size="large"
          >
            <span>
              <Trans>Launch V3 funding cycle</Trans>
            </span>
          </Button>
        )}
      </Space>

      <FundingDrawer
        open={fundingDrawerVisible}
        onClose={closeReconfigureDrawer}
      />
      <TokenDrawer open={tokenDrawerVisible} onClose={closeReconfigureDrawer} />
      <NftDrawer open={nftDrawerVisible} onClose={closeReconfigureDrawer} />
      <RulesDrawer open={rulesDrawerVisible} onClose={closeReconfigureDrawer} />
      <UnsavedChangesModal
        open={unsavedChangesModalVisibile}
        onOk={closeUnsavedChangesModalAndExit}
        onCancel={closeUnsavedChangesModal}
      />
    </>
  )
}
