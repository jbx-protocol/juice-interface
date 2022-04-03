import { Space } from 'antd'

import ProjectBalance from './ProjectBalance'
import DistributedRatio from './DistributedRatio'
import OwnerBalance from './OwnerBalance'

export default function TreasuryStats() {
  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <ProjectBalance />
      <DistributedRatio />
      <OwnerBalance />
    </Space>
  )
}
