import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useWallet } from 'hooks/Wallet'
import { RedeemNftsModal } from 'packages/v2v3/components/V2V3Project/ManageNftsSection/RedeemNftsModal/RedeemNftsModal'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useNftAccountBalance } from 'packages/v2v3/hooks/JB721Delegate/useNftAccountBalance'
import { useNftCredits } from 'packages/v2v3/hooks/JB721Delegate/useNftCredits'
import { useContext, useState } from 'react'
import { NftCreditsSection } from './NftCreditsSection'
import { RedeemNftTiles } from './RedeemNftTiles'

export function RedeemNftsSection() {
  const [redeemNftsModalVisible, setRedeemNftsModalVisible] = useState(false)

  const { userAddress } = useWallet()
  const { fundingCycleMetadata, primaryTerminalCurrentOverflow } =
    useContext(V2V3ProjectContext)
  const { data, loading } = useNftAccountBalance({
    accountAddress: userAddress,
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })
  const { data: credits, loading: loadingCredits } = useNftCredits(userAddress)

  const hasOverflow =
    primaryTerminalCurrentOverflow && primaryTerminalCurrentOverflow > 0n
  const hasRedemptionRate =
    fundingCycleMetadata && fundingCycleMetadata.redemptionRate > 0n
  const canRedeem =
    hasOverflow &&
    hasRedemptionRate &&
    fundingCycleMetadata?.useDataSourceForRedeem

  const hasRedeemableNfts = (data?.nfts?.length ?? 0) > 0

  const showRedeemSection = !loading && hasRedeemableNfts && userAddress
  const showCreditSection = !loadingCredits && credits && credits > 0n

  if (!showRedeemSection && !showCreditSection) return null

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-smoke-50 p-5 dark:bg-slate-700">
      {showCreditSection ? (
        <div>
          <NftCreditsSection credits={credits} />
        </div>
      ) : null}

      {showRedeemSection ? (
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
      ) : null}
    </div>
  )
}
