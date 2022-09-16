import { Divider, Space } from 'antd'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { readNetwork } from 'constants/networks'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { VeNftContext } from 'contexts/veNftContext'
import { VeNftProvider } from 'providers/v2/VeNftProvider'
import { useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { SnapshotSettingsSection } from './SnapshotSettingsSection'
import VeNftEnableSection from './VeNftEnableSection'
import VeNftSetUnclaimedTokensPermissionSection from './VeNftSetUnclaimedTokensPermissionSection'

const VeNftSections = () => {
  const { contractAddress: veNftContractAddress } = useContext(VeNftContext)
  return (
    <>
      <VeNftEnableSection />
      {veNftContractAddress && <VeNftSetUnclaimedTokensPermissionSection />}
    </>
  )
}

export function GovernanceSettingsPage() {
  const { projectId } = useContext(ProjectMetadataContext)

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {readNetwork.name === 'mainnet' && <SnapshotSettingsSection />}

        {featureFlagEnabled(FEATURE_FLAGS.VENFT) && (
          <>
            <VeNftProvider projectId={projectId}>
              <Divider />
              <VeNftSections />
            </VeNftProvider>
          </>
        )}
      </Space>
    </div>
  )
}
