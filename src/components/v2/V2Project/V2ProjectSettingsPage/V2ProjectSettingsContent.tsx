import { Trans } from '@lingui/macro'
import { Layout, Divider } from 'antd'

import V2ProjectSettingsGeneralTab from './V2ProjectSettingsGeneralTab'
import V2ProjectSettingsProjectHandleTab from './V2ProjectSettingsProjectHandleTab'

interface V2ProjectSettingsContentProps {
  activeKey: string | undefined
}

const V2ProjectSettingsContent = ({
  activeKey,
}: V2ProjectSettingsContentProps) => {
  const getActiveTab = (activeKey: string | undefined) => {
    switch (activeKey) {
      case 'project1':
        return <V2ProjectSettingsGeneralTab />
      case 'project2':
        return <V2ProjectSettingsProjectHandleTab />
      default:
        return <p>{activeKey}</p>
    }
  }

  return (
    <Layout style={{ background: 'transparent' }}>
      <Layout.Content style={{ margin: '0 16px' }}>
        <h2>
          <Trans>{activeKey}</Trans>
        </h2>
        <Divider />
        {getActiveTab(activeKey)}
      </Layout.Content>
    </Layout>
  )
}

export default V2ProjectSettingsContent
