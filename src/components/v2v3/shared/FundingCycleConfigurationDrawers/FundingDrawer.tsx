import { t } from '@lingui/macro'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import FundingCycleDrawer from './FundingCycleDrawer'
import { FundingForm } from './FundingForm'
import { useFundingCycleDrawer } from './useFundingCycleDrawer'

export default function FundingDrawer({
  open,
  onClose,
  isCreate,
}: {
  open: boolean
  onClose: VoidFunction
  isCreate?: boolean
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
        title={t`Funding`}
        open={open}
        onClose={handleDrawerCloseClick}
      >
        <FundingForm
          onFinish={emitDrawerClose}
          onFormUpdated={setFormUpdated}
          isCreate={isCreate}
        />
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
