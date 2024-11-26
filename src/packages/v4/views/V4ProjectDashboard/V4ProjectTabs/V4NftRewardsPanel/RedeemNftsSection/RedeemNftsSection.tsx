import { useWallet } from 'hooks/Wallet'
import { useState } from 'react'

export function RedeemNftsSection() {
  const [redeemNftsModalVisible, setRedeemNftsModalVisible] = useState(false)

  const { userAddress } = useWallet()

  // TODO: This needs to be implemented
  return null
  // const { fundingCycleMetadata, primaryTerminalCurrentOverflow } =
  //   useContext(V2V3ProjectContext)
  // const { data, loading } = useNftAccountBalance({
  //   accountAddress: userAddress,
  //   dataSourceAddress: fundingCycleMetadata?.dataSource,
  // })
  // const { data: credits, loading: loadingCredits } = useNftCredits(userAddress)

  // const hasOverflow = primaryTerminalCurrentOverflow?.gt(0)
  // const hasRedemptionRate = fundingCycleMetadata?.redemptionRate.gt(0)
  // const canRedeem =
  //   hasOverflow &&
  //   hasRedemptionRate &&
  //   fundingCycleMetadata?.useDataSourceForRedeem

  // const hasRedeemableNfts = (data?.nfts?.length ?? 0) > 0

  // const showRedeemSection = !loading && hasRedeemableNfts && !!userAddress
  // const showCreditSection = !loadingCredits && credits && credits.gt(0)

  // if (!showRedeemSection && !showCreditSection) return null

  // return (
  //   <div className="flex w-full flex-col gap-4 rounded-lg bg-smoke-50 p-5 dark:bg-slate-700">
  //     {showCreditSection ? (
  //       <div>
  //         <NftCreditsSection credits={credits} />
  //       </div>
  //     ) : null}

  //     {showRedeemSection ? (
  //       <div>
  //         <div className="text-sm font-medium text-grey-600 dark:text-slate-50">
  //           <Trans>Your NFTs</Trans>
  //         </div>

  //         <div className="mt-3 flex items-end justify-between">
  //           <RedeemNftTiles nftAccountBalance={data} />

  //           <Button
  //             type="primary"
  //             onClick={() => setRedeemNftsModalVisible(true)}
  //           >
  //             {canRedeem ? (
  //               <Trans>Redeem NFTs</Trans>
  //             ) : (
  //               <Trans>Burn NFTs</Trans>
  //             )}
  //           </Button>
  //         </div>

  //         {redeemNftsModalVisible && (
  //           <RedeemNftsModal
  //             open={redeemNftsModalVisible}
  //             onCancel={() => setRedeemNftsModalVisible(false)}
  //             onConfirmed={() => setRedeemNftsModalVisible(false)}
  //           />
  //         )}
  //       </div>
  //     ) : null}
  //   </div>
  // )
}
