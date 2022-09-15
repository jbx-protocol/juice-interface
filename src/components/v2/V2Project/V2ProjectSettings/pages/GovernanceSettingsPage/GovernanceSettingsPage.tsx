import { Divider, Space } from 'antd'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { readNetwork } from 'constants/networks'
import { VeNftContext } from 'contexts/veNftContext'
import { useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { SnapshotSettingsSection } from './SnapshotSettingsSection'
import VeNftEnableSection from './VeNftEnableSection'
import VeNftSetUnclaimedTokensPermissionSection from './VeNftSetUnclaimedTokensPermissionSection'

export function GovernanceSettingsPage() {
  const { contractAddress: veNftContractAddress } = useContext(VeNftContext)

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
