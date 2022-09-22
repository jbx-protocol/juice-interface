import { t } from '@lingui/macro'
import { Space } from 'antd'
import VeNftHeaderSection from 'components/veNft/VeNftHeaderSection'
import VeNftStakingForm from 'components/veNft/VeNftStakingForm'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

const MintVeNftContent = () => {
  const { tokenSymbol, tokenName } = useContext(V2V3ProjectContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

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
