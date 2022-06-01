import { t, Trans } from '@lingui/macro'
import FundingCycleDrawer from 'components/v2/shared/FundingCycleConfigurationDrawers/FundingCycleDrawer'
import { useFundingCycleDrawer } from 'components/v2/shared/FundingCycleConfigurationDrawers/useFundingCycleDrawer'
import UnsavedChangesModal from 'components/v2/shared/UnsavedChangesModal'

import TokenForm from '../../V2Create/forms/TokenForm'

export default function TokenDrawer({
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
        title={t`Project token`}
        visible={visible}
        onClose={handleDrawerCloseClick}
      >
        <p>
          <Trans>Configure your project's tokenomics.</Trans>
        </p>
        <TokenForm
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
