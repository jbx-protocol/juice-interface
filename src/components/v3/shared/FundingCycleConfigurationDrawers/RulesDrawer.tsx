import { t } from '@lingui/macro'
import FundingCycleDrawer from 'components/v3/shared/FundingCycleConfigurationDrawers/FundingCycleDrawer'
import { useFundingCycleDrawer } from 'components/v3/shared/FundingCycleConfigurationDrawers/useFundingCycleDrawer'
import UnsavedChangesModal from 'components/v3/shared/UnsavedChangesModal'
import RulesForm from 'pages/create/forms/RulesForm'

export default function RulesDrawer({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: VoidFunction
}) {
  const {
    handleDrawerCloseClick,
    emitDrawerClose,
    setFormUpdated,
    unsavedChangesModalVisible,
    closeModal,
  } = useFundingCycleDrawer(onClose)

  return (
    <>
      <FundingCycleDrawer
        title={t`Rules`}
        visible={visible}
        onClose={handleDrawerCloseClick}
      >
        <RulesForm onFinish={emitDrawerClose} onFormUpdated={setFormUpdated} />
      </FundingCycleDrawer>
      <UnsavedChangesModal
        visible={unsavedChangesModalVisible}
        onOk={() => {
          closeModal()
          emitDrawerClose()
        }}
        onCancel={closeModal}
      />
    </>
  )
}
