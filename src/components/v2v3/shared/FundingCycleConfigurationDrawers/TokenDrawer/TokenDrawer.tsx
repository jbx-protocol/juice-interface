import { t, Trans } from '@lingui/macro'
import { Callout } from 'components/Callout'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import { TokenForm } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/TokenDrawer/TokenForm'
import FundingCycleDrawer from '../FundingCycleDrawer'
import { useFundingCycleDrawer } from '../hooks/FundingCycleDrawer'

export function TokenDrawer({
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
        title={t`Project token`}
        open={open}
        onClose={handleDrawerCloseClick}
      >
        <p>
          <Trans>Design how your tokens should work.</Trans>
        </p>
        <Callout.Info className="mb-8">
          <Trans>
            Project tokens <strong>aren't ERC-20 tokens</strong> by default.
            Once you deploy your project, you can issue an ERC-20 for your
            holders to claim. This is <strong>optional</strong>.
          </Trans>
        </Callout.Info>

        <TokenForm
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
