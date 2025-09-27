import { useV4UserNftCredits } from 'packages/v4v5/contexts/V4V5UserNftCreditsProvider'
import { NftCreditsSection } from './NftCreditsSection'

export function RedeemNftsSection() {
  // const [redeemNftsModalVisible, setRedeemNftsModalVisible] = useState(false)

  const nftCredits = useV4UserNftCredits()

  // TODO: This needs to be implemented
  // const { fundingCycleMetadata, primaryTerminalCurrentOverflow } =
  //   useContext(V2V3ProjectContext)
  // const { data, loading } = useNftAccountBalance({
  //   accountAddress: userAddress,
  //   dataSourceAddress: fundingCycleMetadata?.dataSource,
  // })
  // const { data: credits, loading: loadingCredits } = useNftCredits(userAddress)

  // const hasOverflow = primaryTerminalCurrentOverflow?.gt(0)
  // const hasRedemptionRate = fundingCycleMetadata?.cashOutTaxRate.gt(0)
  // const canRedeem =
  //   hasOverflow &&
  //   hasRedemptionRate &&
  //   fundingCycleMetadata?.useDataSourceForRedeem

  // const hasRedeemableNfts = (data?.nfts?.length ?? 0) > 0

  // const showRedeemSection = !loading && hasRedeemableNfts && !!userAddress
  const showCreditSection =
    !nftCredits.isLoading && nftCredits.data && nftCredits.data > 0n

  // if (!showRedeemSection && !showCreditSection) return null
  if (!showCreditSection) return null

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-smoke-50 p-5 dark:bg-slate-700">
      {showCreditSection ? (
        <div>
          <NftCreditsSection credits={nftCredits.data ?? 0n} />
        </div>
      ) : null}

      {/* TODO: Redeem nft section */}
      {/* {showRedeemSection ? (
        <div>
          <div className="text-sm font-medium text-grey-600 dark:text-slate-50">
            <Trans>Your NFTs</Trans>
          </div>

          <div className="mt-3 flex items-end justify-between">
            <RedeemNftTiles nftAccountBalance={data} />

            <Button
              type="primary"
              onClick={() => setRedeemNftsModalVisible(true)}
            >
              {canRedeem ? (
                <Trans>Redeem NFTs</Trans>
              ) : (
                <Trans>Burn NFTs</Trans>
              )}
            </Button>
          </div>

          {redeemNftsModalVisible && (
            <RedeemNftsModal
              open={redeemNftsModalVisible}
              onCancel={() => setRedeemNftsModalVisible(false)}
              onConfirmed={() => setRedeemNftsModalVisible(false)}
            />
          )}
        </div>
      ) : null} */}
    </div>
  )
}
