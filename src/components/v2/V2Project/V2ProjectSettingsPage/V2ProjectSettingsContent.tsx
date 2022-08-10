import { Divider, Layout } from 'antd'

import { V2SettingsContentKey } from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettings'
import V2ProjectSettingsFundingCycleContent from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettingsFundingCycleContent'

import V2ProjectSettingsProjectHandleContent from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettingsProjectHandleContent'
import V2ProjectSettingsGeneralContent from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettingsGeneralContent'
import V2ProjectSettingsPaymentAddressesContent from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettingsPaymentAddressesContent'
import V2ProjectSettingsPayoutsContent from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettingsPayoutsContent'
import V2ProjectSettingsReservedTokensContent from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettingsReservedTokensContent'
import V2ProjectSettingsV1TokenMigrationContent from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettingsV1TokenMigrationContent'
import V2ProjectSettingsVenftContent from 'components/v2/V2Project/V2ProjectSettingsPage/V2ProjectSettingsVenftContent'

interface V2ProjectSettingsContentProps {
  activeKey: V2SettingsContentKey
}

const V2ProjectSettingsContent = ({
  activeKey,
}: V2ProjectSettingsContentProps) => {
  const getActiveTab = (activeKey: V2SettingsContentKey) => {
    switch (activeKey) {
      case 'general':
        return <V2ProjectSettingsGeneralContent />
      case 'project-handle':
        return <V2ProjectSettingsProjectHandleContent />
      case 'funding-cycle':
        return <V2ProjectSettingsFundingCycleContent />
      case 'payouts':
        return <V2ProjectSettingsPayoutsContent />
      case 'reserved-tokens':
        return <V2ProjectSettingsReservedTokensContent />
      case 'payment-addresses':
        return <V2ProjectSettingsPaymentAddressesContent />
      case 'v1-token-migration':
        return <V2ProjectSettingsV1TokenMigrationContent />
      case 'venft':
        return <V2ProjectSettingsVenftContent />
      default:
        return null
    }
  }

  return (
    <Layout style={{ background: 'transparent' }}>
      <h2>{activeKey}</h2>
      <Divider />
      <Layout.Content style={{ margin: '0 16px' }}>
        {getActiveTab(activeKey)}
      </Layout.Content>
    </Layout>
  )
}

export default V2ProjectSettingsContent
