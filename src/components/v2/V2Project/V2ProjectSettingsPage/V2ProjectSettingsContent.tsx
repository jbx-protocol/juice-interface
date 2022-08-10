import { Trans } from '@lingui/macro'
import { Layout, Divider } from 'antd'

import V2ProjectSettingsGeneralTab from './V2ProjectSettingsGeneralTab'

interface V2ProjectSettingsContentProps {
  activeKey: string | undefined
}

const V2ProjectSettingsContent = ({
  activeKey,
}: V2ProjectSettingsContentProps) => {
  return (
    <Layout style={{ background: 'transparent' }}>
      <Layout.Content style={{ margin: '0 16px' }}>
        <h2>
          <Trans>{activeKey}</Trans>
        </h2>
        <Divider />
        <V2ProjectSettingsGeneralTab />
      </Layout.Content>
    </Layout>
  )
}

export default V2ProjectSettingsContent
