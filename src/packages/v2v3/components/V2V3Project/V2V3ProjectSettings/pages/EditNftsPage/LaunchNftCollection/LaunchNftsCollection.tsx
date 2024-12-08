import { AddNftCollectionForm } from 'components/NftRewards/AddNftCollectionForm/AddNftCollectionForm'
import { Button } from 'antd'
import { Trans } from '@lingui/macro'
import TransactionModal from 'components/modals/TransactionModal'
import { TransactionSuccessModal } from '../../../TransactionSuccessModal'
import { V2V3_CURRENCY_USD } from 'packages/v2v3/utils/currency'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useLaunchNftsForm } from './hooks/useLaunchNftsForm'

export function LaunchNftsPage() {
  const {
    form,
    launchCollection,
    launchButtonLoading,
    launchTxPending,
    successModalOpen,
    setSuccessModalOpen,
  } = useLaunchNftsForm()

  const postPayModalData = useAppSelector(
    state => state.creatingV2Project.nftRewards.postPayModal,
  )
  const nftRewardsData = useAppSelector(
    state => state.creatingV2Project.nftRewards,
  )

  const nftCurrency = nftRewardsData?.pricing.currency

  return (
    <>
      <AddNftCollectionForm
        form={form}
        priceCurrencySymbol={nftCurrency === V2V3_CURRENCY_USD ? 'USD' : 'ETH'}
        postPayModalData={postPayModalData}
        nftRewardsData={nftRewardsData}
        okButton={
          <Button
            type="primary"
            onClick={launchCollection}
            loading={launchButtonLoading}
            className="mt-10"
          >
            <Trans>Deploy NFT collection</Trans>
          </Button>
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
