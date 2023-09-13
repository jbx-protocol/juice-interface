import { Trans } from '@lingui/macro'
import { AddNftCollectionForm } from 'components/NftRewards/AddNftCollectionForm'
import TransactionModal from 'components/modals/TransactionModal'
import { TransactionSuccessModal } from '../../../TransactionSuccessModal'
import { UploadAndLaunchNftsButton } from './UploadAndLaunchNftsButton'
import { useSettingsLaunchNftsForm } from './hooks/useSettingsLaunchNftsForm'

export function LaunchNftsPage() {
  const {
    form,
    launchCollection,
    launchButtonLoading,
    launchTxPending,
    successModalOpen,
    setSuccessModalOpen,
  } = useSettingsLaunchNftsForm()
  return (
    <>
      <AddNftCollectionForm
        form={form}
        okButton={
          <UploadAndLaunchNftsButton
            className="mt-10"
            onClick={() => launchCollection}
            loading={launchButtonLoading}
          />
        }
      />
      <TransactionModal transactionPending open={launchTxPending} />
      <TransactionSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        content={
          <>
            <div className="w-80 pt-1 text-2xl font-medium">
              <Trans>Your new NFTs have been deployed</Trans>
            </div>
            <div className="text-secondary pb-6">
              <Trans>
                New NFTs will be available in your next cycle as long as it
                starts after your edit deadline.
              </Trans>
            </div>
          </>
        }
      />
    </>
  )
}
