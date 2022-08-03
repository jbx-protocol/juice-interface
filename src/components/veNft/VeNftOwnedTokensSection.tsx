import { Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { Trans } from '@lingui/macro'

import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'

import OwnedVeNftCard from 'components/veNft/VeNftOwnedTokenCard'

import { V2ProjectContext } from 'contexts/v2/projectContext'

import { shadowCard } from 'constants/styles/shadowCard'
import VeNftSummaryStatsSection from './VeNftSummaryStatsSection'

type OwnedNFTsSectionProps = {
  userTokens: VeNftToken[] | undefined
  tokenSymbolDisplayText: string
}

export default function OwnedNFTSection({
  userTokens,
  tokenSymbolDisplayText,
}: OwnedNFTsSectionProps) {
  const { theme } = useContext(ThemeContext)
  const { primaryTerminalCurrentOverflow } = useContext(V2ProjectContext)
  const hasOverflow = Boolean(primaryTerminalCurrentOverflow?.gt(0))

  return (
    <>
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
            userTokens={userTokens}
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
    </>
  )
}
