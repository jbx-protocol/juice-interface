import { t, Trans } from '@lingui/macro'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useHasNftRewards } from 'hooks/JB721Delegate/HasNftRewards'
import Link from 'next/link'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'
import { DrawSection } from '../DrawerSection'
import FundingCycleDrawer from '../FundingCycleDrawer'
import { useFundingCycleDrawer } from '../hooks/FundingCycleDrawer'
import { AddNftsSection } from './AddNftsSection/AddNftsSection'
import { DangerZoneSection } from './DangerZoneSection'

export function NftDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const { projectId } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)
  const { value: hasExistingNfts } = useHasNftRewards()

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
        {!hasExistingNfts && (
          <DrawSection>
            <AddNftsSection onClose={onClose} />
          </DrawSection>
        )}

        {hasExistingNfts && (
          <>
            <DrawSection>
              <h2 className="text-black dark:text-slate-100">
                <Trans>Edit NFTs</Trans>
              </h2>
              <p>
                <Trans>
                  To edit you current NFT collection, go to the{' '}
                  <Link href={settingsPagePath('nfts', { projectId, handle })}>
                    Edit NFTs
                  </Link>{' '}
                  page.
                </Trans>
              </p>
            </DrawSection>
            <DrawSection>
              <h2 className="text-black dark:text-slate-100">
                <Trans>Danger Zone</Trans>
              </h2>
              <DangerZoneSection close={onClose} />
            </DrawSection>
          </>
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
