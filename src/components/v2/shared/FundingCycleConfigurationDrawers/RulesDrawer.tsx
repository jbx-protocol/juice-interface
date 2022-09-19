import { t } from '@lingui/macro'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import RulesForm from 'pages/create/forms/RulesForm'
import FundingCycleDrawer from './FundingCycleDrawer'
import { useFundingCycleDrawer } from './useFundingCycleDrawer'

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
