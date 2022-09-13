import { Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { Trans } from '@lingui/macro'

import OwnedVeNftCard from 'components/veNft/VeNftOwnedTokenCard'

import { V2ProjectContext } from 'contexts/v2/projectContext'

import { shadowCard } from 'constants/styles/shadowCard'
import { VeNftContext } from 'contexts/v2/veNftContext'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import VeNftSummaryStatsSection from './VeNftSummaryStatsSection'

export default function MyVeNftsContent() {
  const { theme } = useContext(ThemeContext)
  const { userTokens } = useContext(VeNftContext)
  const { primaryTerminalCurrentOverflow, tokenSymbol } =
    useContext(V2ProjectContext)
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
