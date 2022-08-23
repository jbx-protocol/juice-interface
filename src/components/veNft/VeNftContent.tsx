import { Space } from 'antd'
import { useContext } from 'react'

import { t } from '@lingui/macro'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import VeNftHeaderSection from 'components/veNft/VeNftHeaderSection'
import VeNftOwnedTokensSection from 'components/veNft/VeNftOwnedTokensSection'
import VeNftStakingForm from 'components/veNft/VeNftStakingForm'
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
