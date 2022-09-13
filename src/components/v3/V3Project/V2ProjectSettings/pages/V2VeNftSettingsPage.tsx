import { Space } from 'antd'
import VeNftEnableSection from 'components/veNft/VeNftEnableSection'
import VeNftSetUnclaimedTokensPermissionSection from 'components/veNft/VeNftSetUnclaimedTokensPermissionSection'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import React, { useContext } from 'react'

export function V2VeNftSettingsPage() {
  const {
    veNft: { contractAddress: veNftContractAddress },
  } = useContext(V3ProjectContext)
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <VeNftEnableSection />
      {veNftContractAddress && <VeNftSetUnclaimedTokensPermissionSection />}
    </Space>
  )
}
