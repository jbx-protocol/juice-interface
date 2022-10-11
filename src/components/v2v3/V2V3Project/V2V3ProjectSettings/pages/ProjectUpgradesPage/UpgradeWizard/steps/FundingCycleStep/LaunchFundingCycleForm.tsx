import { t, Trans } from '@lingui/macro'
import { Button, Form, Input, Space } from 'antd'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import RichButton from 'components/RichButton'
import FundingDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/FundingDrawer'
import RulesDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/RulesDrawer'
import TokenDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/TokenDrawer'
import { useState } from 'react'
import { useEditingFundingCycleConfig } from '../../../../ReconfigureFundingCycleSettingsPage/hooks/editingFundingCycleConfig'
import ReconfigurePreview from '../../../../ReconfigureFundingCycleSettingsPage/ReconfigurePreview'
import { useLaunchFundingCycle } from './hooks/useLaunchFundingCycle'

export function LaunchFundingCycleForm() {
  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>(false)
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>(false)
  const [unsavedChangesModalVisibile, setUnsavedChangesModalVisible] =
    useState<boolean>(false)

  const editingFundingCycleConfig = useEditingFundingCycleConfig()

  const { launchFundingCycleLoading, launchFundingCycle } =
    useLaunchFundingCycle({ editingFundingCycleConfig })

  const closeReconfigureDrawer = () => {
    setFundingDrawerVisible(false)
    setTokenDrawerVisible(false)
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
          heading={t`Rules`}
          description={t`Configure restrictions for your funding cycles.`}
          onClick={() => setRulesDrawerVisible(true)}
        />

        <Form.Item
          label={<Trans>Start time (seconds, Unix time)</Trans>}
          style={{ width: '100%' }}
          extra={<Trans>Leave blank to start immediately.</Trans>}
        >
          <Input
            type="number"
            min={0}
            // TODO(@dab)
            // onChange={e => {
            //   setNewStart(e.target.value || '1')
            // }}
          />
        </Form.Item>

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
        />

        <Button
          loading={launchFundingCycleLoading}
          onClick={launchFundingCycle}
          type="primary"
        >
          <span>
            <Trans>Launch funding cycle</Trans>
          </span>
        </Button>
      </Space>

      <FundingDrawer
        open={fundingDrawerVisible}
        onClose={closeReconfigureDrawer}
      />
      <TokenDrawer open={tokenDrawerVisible} onClose={closeReconfigureDrawer} />
      <RulesDrawer open={rulesDrawerVisible} onClose={closeReconfigureDrawer} />
      <UnsavedChangesModal
        open={unsavedChangesModalVisibile}
        onOk={closeUnsavedChangesModalAndExit}
        onCancel={closeUnsavedChangesModal}
      />
    </>
  )
}
