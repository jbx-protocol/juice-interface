import { t } from '@lingui/macro'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import FundingForm from 'pages/create/forms/FundingForm'
import FundingCycleDrawer from './FundingCycleDrawer'
import { useFundingCycleDrawer } from './useFundingCycleDrawer'

export default function FundingDrawer({
  visible,
  onClose,
  isCreate,
}: {
  visible: boolean
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
        visible={visible}
        onClose={handleDrawerCloseClick}
      >
        <FundingForm
          onFinish={emitDrawerClose}
          onFormUpdated={setFormUpdated}
          isCreate={isCreate}
        />
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
