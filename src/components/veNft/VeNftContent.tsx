import { useContext } from 'react'
import { Space } from 'antd'

import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { t } from '@lingui/macro'

import VeNftHeaderSection from 'components/veNft/VeNftHeaderSection'
import VeNftStakingForm from 'components/veNft/VeNftStakingForm'
import VeNftOwnedTokensSection from 'components/veNft/VeNftOwnedTokensSection'
import { VeNftContext } from 'contexts/v2/veNftContext'

const VeNftContent = () => {
  const { tokenSymbol, tokenName, projectMetadata } =
    useContext(V2ProjectContext)

  const { userTokens } = useContext(VeNftContext)

  const tokenSymbolDisplayText = tokenSymbolText({ tokenSymbol })
  const projectName = projectMetadata?.name ?? t`Unknown Project`

  return (
    <Space direction="vertical">
      <VeNftHeaderSection
        tokenName={tokenName}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
        projectName={projectName}
      />
      <VeNftStakingForm tokenSymbolDisplayText={tokenSymbolDisplayText} />
      <VeNftOwnedTokensSection
        userTokens={userTokens}
        tokenSymbolDisplayText={tokenSymbolDisplayText}
      />
    </Space>
  )
}

export default VeNftContent
