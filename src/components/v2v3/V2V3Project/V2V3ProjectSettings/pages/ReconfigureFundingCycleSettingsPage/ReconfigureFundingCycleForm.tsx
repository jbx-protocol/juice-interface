import { t, Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import Callout from 'components/Callout'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import { MemoFormInput } from 'components/Project/PayProjectForm/MemoFormInput'
import RichButton, { RichButtonProps } from 'components/RichButton'
import FundingDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/FundingDrawer'
import RulesDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/RulesDrawer'
import TokenDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/TokenDrawer'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext, useState } from 'react'
import { useEditingProjectData } from './hooks/editingProjectData'
import { useFundingHasSavedChanges } from './hooks/fundingHasSavedChanges'
import { useInitialEditingData } from './hooks/initialEditingData'
import { useReconfigureFundingCycle } from './hooks/reconfigureFundingCycle'
import ReconfigurePreview from './ReconfigurePreview'
import V2V3ReconfigureUpcomingMessage from './ReconfigureUpcomingMessage'

function ReconfigureButton({
  reconfigureHasChanges,
  ...props
}: {
  reconfigureHasChanges: boolean
} & RichButtonProps) {
  const { colors } = useContext(ThemeContext).theme

  return (
    <RichButton
      {...props}
      buttonStyle={{
        border: reconfigureHasChanges
          ? '1px solid ' + colors.stroke.action.primary
          : undefined,
      }}
    />
  )
}

export function V2V3ReconfigureFundingCycleForm() {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const {
    nftRewards: { CIDs: nftRewardsCids },
  } = useContext(NftRewardsContext)

  const [memo, setMemo] = useState('')
  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>(false)
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>(false)
  const [unsavedChangesModalVisibile, setUnsavedChangesModalVisible] =
    useState<boolean>(false)

  const { initialEditingData } = useInitialEditingData({ visible: true })
  const editingProjectData = useEditingProjectData()
  const {
    fundingHasSavedChanges,
    fundingDrawerHasSavedChanges,
    tokenDrawerHasSavedChanges,
    rulesDrawerHasSavedChanges,
  } = useFundingHasSavedChanges({
    editingProjectData,
    initialEditingData,
  })

  const { reconfigureLoading, reconfigureFundingCycle } =
    useReconfigureFundingCycle({ editingProjectData, memo })

  const closeReconfigureDrawer = () => {
    setFundingDrawerVisible(false)
    setTokenDrawerVisible(false)
    setRulesDrawerVisible(false)
  }

  // const openUnsavedChangesModal = () => setUnsavedChangesModalVisible(true)
  const closeUnsavedChangesModal = () => setUnsavedChangesModalVisible(false)

  const closeUnsavedChangesModalAndExit = () => {
    closeUnsavedChangesModal()
  }

  // TODO: unsaved changes
  // const handleGlobalModalClose = useCallback(() => {
  //   openUnsavedChangesModal()
  // }, [])

  const nftsWithFalseDataSourceForPay = Boolean(
    nftRewardsCids?.length && !fundingCycleMetadata?.useDataSourceForPay,
  )

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Callout>
          <V2V3ReconfigureUpcomingMessage />
        </Callout>

        <ReconfigureButton
          heading={t`Funding`}
          description={t`Configure how your project will collect and spend funds.`}
          reconfigureHasChanges={fundingDrawerHasSavedChanges}
          onClick={() => setFundingDrawerVisible(true)}
        />
        <ReconfigureButton
          heading={t`Token`}
          description={t`Configure your project's token.`}
          reconfigureHasChanges={tokenDrawerHasSavedChanges}
          onClick={() => setTokenDrawerVisible(true)}
        />
        <ReconfigureButton
          heading={t`Rules`}
          description={t`Configure restrictions for your funding cycles.`}
          reconfigureHasChanges={rulesDrawerHasSavedChanges}
          onClick={() => setRulesDrawerVisible(true)}
        />

        <Form layout="vertical">
          <Form.Item
            name="memo"
            label={t`Memo (optional)`}
            className={'antd-no-number-handler'}
            extra={t`Add an on-chain memo to this reconfiguration.`}
          >
            <MemoFormInput value={memo} onChange={setMemo} />
          </Form.Item>
        </Form>

        <h3 className="text-primary" style={{ fontSize: '1.2rem' }}>
          <Trans>Review and deploy</Trans>
        </h3>
        <ReconfigurePreview
          payoutSplits={editingProjectData.editingPayoutGroupedSplits.splits}
          reserveSplits={
            editingProjectData.editingReservedTokensGroupedSplits.splits
          }
          fundingCycleMetadata={editingProjectData.editingFundingCycleMetadata}
          fundingCycleData={editingProjectData.editingFundingCycleData}
          fundAccessConstraints={
            editingProjectData.editingFundAccessConstraints
          }
        />

        <Button
          loading={reconfigureLoading}
          onClick={reconfigureFundingCycle}
          disabled={!fundingHasSavedChanges && !nftsWithFalseDataSourceForPay}
          type="primary"
        >
          <span>
            <Trans>Deploy funding cycle configuration</Trans>
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
