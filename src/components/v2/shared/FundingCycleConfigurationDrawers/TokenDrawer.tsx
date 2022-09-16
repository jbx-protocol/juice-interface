import { t, Trans } from '@lingui/macro'
import Callout from 'components/Callout'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import TokenForm from 'pages/create/forms/TokenForm'
import FundingCycleDrawer from './FundingCycleDrawer'
import { useFundingCycleDrawer } from './useFundingCycleDrawer'

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
          <Trans>Design how your tokens should work.</Trans>
        </p>
        <Callout style={{ marginBottom: '2rem' }}>
          <Trans>
            Project tokens <strong>aren't ERC-20 tokens</strong> by default.
            Once you deploy your project, you can issue an ERC-20 for your
            holders to claim. This is <strong>optional</strong>.
          </Trans>
        </Callout>

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
