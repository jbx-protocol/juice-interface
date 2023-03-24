import { Space } from 'antd'
import { SnapshotSettingsSection } from './SnapshotSettingsSection'

export function GovernanceSettingsPage() {
  return (
    <div>
      <Space direction="vertical" size="large" className="w-full">
        <SnapshotSettingsSection />
      </Space>
    </div>
  )
}
