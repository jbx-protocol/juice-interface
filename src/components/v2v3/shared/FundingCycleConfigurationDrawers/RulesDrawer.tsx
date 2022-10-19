import { t } from '@lingui/macro'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import RulesForm from 'pages/create/forms/RulesForm'
import FundingCycleDrawer from './FundingCycleDrawer'
import { useFundingCycleDrawer } from './useFundingCycleDrawer'

export default function RulesDrawer({
  open,
  onClose,
}: {
  open: boolean
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
        open={open}
        onClose={handleDrawerCloseClick}
      >
        <RulesForm onFinish={emitDrawerClose} onFormUpdated={setFormUpdated} />
      </FundingCycleDrawer>
      <UnsavedChangesModal
        open={unsavedChangesModalVisible}
        onOk={() => {
          closeModal()
          emitDrawerClose()
        }}
        onCancel={closeModal}
      />
    </>
  )
}
