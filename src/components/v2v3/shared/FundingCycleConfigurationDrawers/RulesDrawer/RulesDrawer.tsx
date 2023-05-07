import { t } from '@lingui/macro'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import FundingCycleDrawer from '../FundingCycleDrawer'
import { useFundingCycleDrawer } from '../hooks/useFundingCycleDrawer'
import RulesForm from './RulesForm/RulesForm'

export function RulesDrawer({
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
