import { t } from '@lingui/macro'
import FundingCycleDrawer from 'components/v2/shared/FundingCycleConfigurationDrawers/FundingCycleDrawer'
import { useFundingCycleDrawer } from 'components/v2/shared/FundingCycleConfigurationDrawers/useFundingCycleDrawer'
import UnsavedChangesModal from 'components/v2/shared/UnsavedChangesModal'

import FundingForm from '../../../../pages/create/forms/FundingForm'

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
