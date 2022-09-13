import { t } from '@lingui/macro'
import { Space } from 'antd'
import VeNftHeaderSection from 'components/veNft/VeNftHeaderSection'
import VeNftStakingForm from 'components/veNft/VeNftStakingForm'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

const MintVeNftContent = () => {
  const { tokenSymbol, tokenName, projectMetadata } =
    useContext(V2ProjectContext)

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
    </Space>
  )
}

export default MintVeNftContent
