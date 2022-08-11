import { Space } from 'antd'
import VeNftEnableSection from 'components/veNft/VeNftEnableSection'
import VeNftSetUnclaimedTokensPermissionSection from 'components/veNft/VeNftSetUnclaimedTokensPermissionSection'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import React, { useContext } from 'react'

const V2ProjectSettingsVenftContent = () => {
  const {
    veNft: { contractAddress: veNftContractAddress },
  } = useContext(V2ProjectContext)
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <VeNftEnableSection />
      {veNftContractAddress && <VeNftSetUnclaimedTokensPermissionSection />}
    </Space>
  )
}

export default V2ProjectSettingsVenftContent
