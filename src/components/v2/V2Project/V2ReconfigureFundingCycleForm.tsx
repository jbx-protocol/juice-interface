import { CaretRightFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import { MemoFormInput } from 'components/inputs/Pay/MemoFormInput'
import FundingDrawer from 'components/v2/shared/FundingCycleConfigurationDrawers/FundingDrawer'
import RulesDrawer from 'components/v2/shared/FundingCycleConfigurationDrawers/RulesDrawer'
import TokenDrawer from 'components/v2/shared/FundingCycleConfigurationDrawers/TokenDrawer'
import UnsavedChangesModal from 'components/v2/shared/UnsavedChangesModal'
import { useEditingProjectData } from 'components/v2/V2Project/V2ProjectSettings/pages/V2ProjectReconfigureFundingCycleSettingsPage/hooks/editingProjectData'
import { useFundingHasSavedChanges } from 'components/v2/V2Project/V2ProjectSettings/pages/V2ProjectReconfigureFundingCycleSettingsPage/hooks/fundingHasSavedChanges'
import { useInitialEditingData } from 'components/v2/V2Project/V2ProjectSettings/pages/V2ProjectReconfigureFundingCycleSettingsPage/hooks/initialEditingData'
import { useReconfigureFundingCycle } from 'components/v2/V2Project/V2ProjectSettings/pages/V2ProjectReconfigureFundingCycleSettingsPage/hooks/reconfigureFundingCycle'
import ReconfigurePreview from 'components/v2/V2Project/V2ProjectSettings/pages/V2ProjectReconfigureFundingCycleSettingsPage/ReconfigurePreview'
import V2ReconfigureUpcomingMessage from 'components/v2/V2Project/V2ProjectSettings/pages/V2ProjectReconfigureFundingCycleSettingsPage/V2ReconfigureUpcomingMessage'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext, useState } from 'react'

function ReconfigureButton({
  title,
  reconfigureHasChanges,
  onClick,
}: {
  title: string
  reconfigureHasChanges: boolean
  onClick: () => void
}) {
  const { colors, radii } = useContext(ThemeContext).theme

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        cursor: 'pointer',
        padding: 10,
        fontWeight: 500,
        borderRadius: radii.sm,
        border:
          '1px solid ' +
          (reconfigureHasChanges
            ? colors.stroke.action.primary
            : colors.stroke.action.secondary),
      }}
      onClick={onClick}
    >
      <div>{title}</div>
      <div>
        <CaretRightFilled />
      </div>
    </div>
  )
}

export function V2ReconfigureFundingCycleForm() {
  const { initialEditingData } = useInitialEditingData(true)
  const editingProjectData = useEditingProjectData()
  const [memo, setMemo] = useState('')
  const {
    fundingHasSavedChanges,
    fundingDrawerHasSavedChanges,
    tokenDrawerHasSavedChanges,
    rulesDrawerHasSavedChanges,
  } = useFundingHasSavedChanges({
    editingProjectData,
    initialEditingData,
  })
  const {
    fundingCycleMetadata,
    nftRewards: { CIDs: nftRewardsCids },
  } = useContext(V2ProjectContext)

  const { reconfigureLoading, reconfigureFundingCycle } =
    useReconfigureFundingCycle({ editingProjectData, memo })

  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>(false)
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>(false)

  const closeReconfigureDrawer = () => {
    setFundingDrawerVisible(false)
    setTokenDrawerVisible(false)
    setRulesDrawerVisible(false)
  }

  const [unsavedChangesModalVisibile, setUnsavedChangesModalVisible] =
    useState<boolean>(false)

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
        <p>
          <V2ReconfigureUpcomingMessage />
        </p>
        <ReconfigureButton
          title={t`Distribution limit, duration and payouts`}
          reconfigureHasChanges={fundingDrawerHasSavedChanges}
          onClick={() => setFundingDrawerVisible(true)}
        />
        <ReconfigureButton
          title={t`Token`}
          reconfigureHasChanges={tokenDrawerHasSavedChanges}
          onClick={() => setTokenDrawerVisible(true)}
        />
        <ReconfigureButton
          title={t`Rules`}
          reconfigureHasChanges={rulesDrawerHasSavedChanges}
          onClick={() => setRulesDrawerVisible(true)}
        />
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
        visible={fundingDrawerVisible}
        onClose={closeReconfigureDrawer}
      />
      <TokenDrawer
        visible={tokenDrawerVisible}
        onClose={closeReconfigureDrawer}
      />
      <RulesDrawer
        visible={rulesDrawerVisible}
        onClose={closeReconfigureDrawer}
      />
      <UnsavedChangesModal
        visible={unsavedChangesModalVisibile}
        onOk={closeUnsavedChangesModalAndExit}
        onCancel={closeUnsavedChangesModal}
      />
    </>
  )
}
