import { Space } from 'antd'

import { ThemeContext } from 'contexts/themeContext'
import { VeNftToken } from 'models/subgraph-entities/veNft/venft-token'
import { useContext } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import OwnedNFTCard from 'components/v2/V2Project/VeNftStakingForm/OwnedNFTCard'

import { shadowCard } from 'constants/styles/shadowCard'

type OwnedNFTsSectionProps = {
  userTokens: VeNftToken[]
  tokenSymbol: string
}

export default function OwnedNFTSection({
  userTokens,
  tokenSymbol,
}: OwnedNFTsSectionProps) {
  const { theme } = useContext(ThemeContext)
  return (
    <div style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}>
      <h3>$ve{tokenSymbolText({ tokenSymbol })} NFTs:</h3>
      <Space direction="vertical">
        {userTokens.map((token, i) => (
          <OwnedNFTCard key={i} token={token} tokenSymbol={tokenSymbol} />
        ))}
      </Space>
    </div>
  )
}
