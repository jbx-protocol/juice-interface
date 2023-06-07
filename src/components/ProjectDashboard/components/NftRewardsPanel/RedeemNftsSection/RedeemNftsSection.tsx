import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { RedeemNftsModal } from 'components/v2v3/V2V3Project/ManageNftsSection/RedeemNftsModal'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftAccountBalance } from 'hooks/JB721Delegate/useNftAccountBalance'
import { useWallet } from 'hooks/Wallet'
import { useContext, useState } from 'react'
import { RedeemNftTiles } from './RedeemNftTiles'

export function RedeemNftsSection() {
  const [redeemNftsModalVisible, setRedeemNftsModalVisible] = useState(false)
  const { userAddress } = useWallet()
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const { data, loading } = useNftAccountBalance({
    accountAddress: userAddress,
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })
  const hasRedeemableNfts = (data?.jb721DelegateTokens?.length ?? 0) > 0

  if (loading || !hasRedeemableNfts) return null

  return (
    <div className="h-32 w-full rounded-lg bg-smoke-50 p-4">
      <div className="text-sm font-medium text-grey-600">
        <Trans>Your NFTs</Trans>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <RedeemNftTiles nftAccountBalance={data} />

        <Button type="primary" onClick={() => setRedeemNftsModalVisible(true)}>
          <Trans>Redeem NFTs</Trans>
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
  )
}
