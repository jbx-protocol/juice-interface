import { t, Trans } from '@lingui/macro'
import { Callout } from 'components/Callout'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import { useHasNftRewards } from 'hooks/JB721Delegate/HasNftRewards'
import FundingCycleDrawer from '../FundingCycleDrawer'
import { useFundingCycleDrawer } from '../hooks/FundingCycleDrawer'
import { DangerZoneSection } from './DangerZoneSection'
import { EditCollectionDetailsSection } from './EditCollectionDetailsSection/EditCollectionDetailsSection'
import { EditNftsSection } from './EditNftsSection/EditNftsSection'

export function NftDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const hasExistingNfts = useHasNftRewards()

  const {
    handleDrawerCloseClick,
    emitDrawerClose,
    unsavedChangesModalVisible,
    closeModal,
  } = useFundingCycleDrawer(onClose)

  return (
    <>
      <FundingCycleDrawer
        title={t`NFTs`}
        open={open}
        onClose={handleDrawerCloseClick}
      >
        <div className="mb-2 rounded-sm bg-smoke-75 stroke-none p-8 text-black shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:text-slate-100 dark:shadow-[10px_10px_0px_0px_#2D293A]">
          <EditNftsSection onClose={onClose} />
        </div>

        {hasExistingNfts && (
          <div className="mb-2 rounded-sm bg-smoke-75 stroke-none p-8 text-black shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:text-slate-100 dark:shadow-[10px_10px_0px_0px_#2D293A]">
            <h2>
              <Trans>Edit collection details</Trans>
            </h2>

            <EditCollectionDetailsSection />
          </div>
        )}

        {hasExistingNfts && (
          <div className="mb-2 rounded-sm bg-smoke-75 stroke-none p-8 text-black shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:text-slate-100 dark:shadow-[10px_10px_0px_0px_#2D293A]">
            <h2>
              <Trans>Danger Zone</Trans>
            </h2>
            <Callout.Warning className="mb-5">
              <Trans>
                Detaching NFTs from your project has the following effects:
                <ul>
                  <li>
                    Contributors won't receive NFTs when they fund your project.
                  </li>
                  <li>
                    Existing NFT holders won't be able to redeem their NFTs.
                  </li>
                </ul>
                <p>This will take effect in your next funding cycle.</p>
              </Trans>
            </Callout.Warning>
            <DangerZoneSection close={onClose} />
          </div>
        )}

        <UnsavedChangesModal
          open={unsavedChangesModalVisible}
          onOk={() => {
            closeModal()
            emitDrawerClose()
          }}
          onCancel={closeModal}
        />
      </FundingCycleDrawer>
    </>
  )
}
