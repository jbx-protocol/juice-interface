import { Divider, Space } from 'antd'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { readNetwork } from 'constants/networks'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { SnapshotSettingsSection } from './SnapshotSettingsSection'
import VeNftEnableSection from './VeNftEnableSection'
import VeNftSetUnclaimedTokensPermissionSection from './VeNftSetUnclaimedTokensPermissionSection'

export function GovernanceSettingsPage() {
  const {
    veNft: { contractAddress: veNftContractAddress },
  } = useContext(V2ProjectContext)

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {readNetwork.name === 'mainnet' && <SnapshotSettingsSection />}

        {featureFlagEnabled(FEATURE_FLAGS.VENFT) && (
          <>
            <Divider />
            <VeNftEnableSection />
            {veNftContractAddress && (
              <VeNftSetUnclaimedTokensPermissionSection />
            )}
          </>
        )}
      </Space>
    </div>
  )
}
