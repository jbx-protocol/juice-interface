import { Divider, Space } from 'antd'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { VeNftContext } from 'contexts/VeNft/VeNftContext'
import { VeNftProvider } from 'contexts/VeNft/VeNftProvider'
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
      <Space direction="vertical" size="large" className="w-full">
        <SnapshotSettingsSection />

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
