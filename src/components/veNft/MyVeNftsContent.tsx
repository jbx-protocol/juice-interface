import { Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { Trans } from '@lingui/macro'

import OwnedVeNftCard from 'components/veNft/VeNftOwnedTokenCard'

import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'

import { shadowCard } from 'constants/styles/shadowCard'
import { useVeNftUserTokens } from 'hooks/veNft/VeNftUserTokens'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import VeNftSummaryStatsSection from './VeNftSummaryStatsSection'

export default function MyVeNftsContent() {
  const { theme } = useContext(ThemeContext)
  const { data: userTokens } = useVeNftUserTokens()
  const { primaryTerminalCurrentOverflow, tokenSymbol } =
    useContext(V2V3ProjectContext)
  const hasOverflow = Boolean(primaryTerminalCurrentOverflow?.gt(0))
  const tokenSymbolDisplayText = tokenSymbolText({ tokenSymbol })

  return (
    <div>
      {userTokens && userTokens.length > 0 ? (
        <>
          <div style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}>
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
        <div style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}>
          <h3>
            <Trans>You don't own any veNFTs!</Trans>
          </h3>
        </div>
      )}
    </div>
  )
}
