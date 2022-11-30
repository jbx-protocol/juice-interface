import { Space } from 'antd'
import { useContext } from 'react'
import { Trans } from '@lingui/macro'
import OwnedVeNftCard from 'components/veNft/VeNftOwnedTokenCard'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useVeNftUserTokens } from 'hooks/veNft/VeNftUserTokens'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import VeNftSummaryStatsSection from './VeNftSummaryStatsSection'

export default function MyVeNftsContent() {
  const { data: userTokens } = useVeNftUserTokens()
  const { primaryTerminalCurrentOverflow, tokenSymbol } =
    useContext(V2V3ProjectContext)
  const hasOverflow = Boolean(primaryTerminalCurrentOverflow?.gt(0))
  const tokenSymbolDisplayText = tokenSymbolText({ tokenSymbol })

  return (
    <div>
      {userTokens && userTokens.length > 0 ? (
        <>
          <div className="mb-2 rounded-sm bg-smoke-75 stroke-none p-6 shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:shadow-[10px_10px_0px_0px_#2D293A]">
            <h3>$ve{tokenSymbolDisplayText} NFTs:</h3>
            <Space direction="vertical">
              {userTokens.map((token, i) => (
                <OwnedVeNftCard
                  key={i}
                  token={token}
                  tokenSymbolDisplayText={tokenSymbolDisplayText}
                  hasOverflow={hasOverflow}
                />
              ))}
            </Space>
          </div>
          <VeNftSummaryStatsSection
            tokenSymbolDisplayText={tokenSymbolDisplayText}
          />
        </>
      ) : (
        <div className="mb-2 rounded-sm bg-smoke-75 stroke-none p-6 shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:shadow-[10px_10px_0px_0px_#2D293A]">
          <h3>
            <Trans>You don't own any veNFTs!</Trans>
          </h3>
        </div>
      )}
    </div>
  )
}
