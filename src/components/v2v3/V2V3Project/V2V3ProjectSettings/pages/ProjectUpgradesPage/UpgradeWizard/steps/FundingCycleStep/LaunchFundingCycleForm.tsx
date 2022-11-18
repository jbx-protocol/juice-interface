import { t, Trans } from '@lingui/macro'
import { Button, Form, Input, Space } from 'antd'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import RichButton from 'components/RichButton'
import FundingDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/FundingDrawer'
import NftDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer'
import RulesDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/RulesDrawer'
import TokenDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/TokenDrawer'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { useEditingFundingCycleConfig } from '../../../../ReconfigureFundingCycleSettingsPage/hooks/editingFundingCycleConfig'
import ReconfigurePreview from '../../../../ReconfigureFundingCycleSettingsPage/ReconfigurePreview'
import { useLaunchFundingCycles } from './hooks/LaunchFundingCycles'

export function LaunchFundingCycleForm() {
  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>(false)
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>(false)
  const [nftDrawerVisible, setNftDrawerVisible] = useState<boolean>(false)
  const [unsavedChangesModalVisibile, setUnsavedChangesModalVisible] =
    useState<boolean>(false)

  const dispatch = useDispatch()
  const editingFundingCycleConfig = useEditingFundingCycleConfig()
  const { launchFundingCycleLoading, launchFundingCycle } =
    useLaunchFundingCycles({ editingFundingCycleConfig })

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
          heading={t`NFTs`}
          description={t`Configure your project's NFTs.`}
          onClick={() => setNftDrawerVisible(true)}
        />
        <RichButton
          heading={t`Rules`}
          description={t`Configure restrictions for your funding cycles.`}
          onClick={() => setRulesDrawerVisible(true)}
        />
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

        <h3 className="text-primary" style={{ fontSize: '1.2rem' }}>
          <Trans>Review and deploy</Trans>
        </h3>

        <ReconfigurePreview
          payoutSplits={
            editingFundingCycleConfig.editingPayoutGroupedSplits.splits
          }
          reserveSplits={
            editingFundingCycleConfig.editingReservedTokensGroupedSplits.splits
          }
          fundingCycleMetadata={
            editingFundingCycleConfig.editingFundingCycleMetadata
          }
          fundingCycleData={editingFundingCycleConfig.editingFundingCycleData}
          fundAccessConstraints={
            editingFundingCycleConfig.editingFundAccessConstraints
          }
          nftRewards={editingFundingCycleConfig.editingNftRewards?.rewardTiers}
        />

        <Button
          loading={launchFundingCycleLoading}
          onClick={launchFundingCycle}
          type="primary"
        >
          <span>
            <Trans>Launch V3 funding cycle</Trans>
          </span>
        </Button>
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
