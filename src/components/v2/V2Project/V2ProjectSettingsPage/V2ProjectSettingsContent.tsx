import { Divider, Layout } from 'antd'

import {
  V2SettingsContentKey,
  V2SettingsKeyTitleMap,
} from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettings'

import V2ProjectSettingsVenftContent from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettingsVenftContent'

import ProjectPayersSection from 'components/Project/ProjectToolsDrawer/ProjectPayersSection'

import { TransferOwnershipForm } from 'components/Project/ProjectToolsDrawer/TransferOwnershipForm'

import V2ReconfigureProjectHandle from 'components/v2/V2Project/V2ProjectSettingsPage/V2ReconfigureProjectHandle'

import V2ProjectDetails from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectDetails'

import { EditTokenAllocationContent } from 'components/v2/V2Project/EditTokenAllocationContent'
import V2ProjectSettingsPayoutsContent from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettingsEditPayouts'
import ArchiveV2Project from 'components/v2/V2Project/ArchiveV2Project'
import { V1TokenMigrationSetupSection } from 'components/v2/V2Project/V2ProjectToolsDrawer/V1TokenMigrationSetupSection'

interface V2ProjectSettingsContentProps {
  activeKey: V2SettingsContentKey
}

const V2ProjectSettingsContent = ({
  activeKey,
}: V2ProjectSettingsContentProps) => {
  const getActiveTab = (activeKey: V2SettingsContentKey) => {
    switch (activeKey) {
      case 'general':
        return <V2ProjectDetails />
      case 'project-handle':
        return <V2ReconfigureProjectHandle />
      case 'payouts':
        return <V2ProjectSettingsPayoutsContent />
      case 'reserved-tokens':
        return <EditTokenAllocationContent />
      case 'payment-addresses':
        return <ProjectPayersSection />
      case 'v1-token-migration':
        return <V1TokenMigrationSetupSection />
      case 'venft':
        return <V2ProjectSettingsVenftContent />
      case 'transfer-ownership':
        return <TransferOwnershipForm />
      case 'archive-project':
        return <ArchiveV2Project />
      default:
        return null
    }
  }

  return (
    <Layout style={{ background: 'transparent' }}>
      <h2>{V2SettingsKeyTitleMap[activeKey]}</h2>
      <Divider />
      <Layout.Content style={{ margin: '0 16px' }}>
        {getActiveTab(activeKey)}
      </Layout.Content>
    </Layout>
  )
}

export default V2ProjectSettingsContent
