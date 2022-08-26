import { Divider, Layout } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import V2ArchiveProjectContent from 'components/v2/V2Project/V2ProjectSettings/V2ArchiveProjectContent'
import V2EditPayoutsContent from 'components/v2/V2Project/V2ProjectSettings/V2EditPayoutsContent'
import V2PaymentAddressesContent from 'components/v2/V2Project/V2ProjectSettings/V2PaymentAddressesContent'
import V2ProjectDetails from 'components/v2/V2Project/V2ProjectSettings/V2ProjectDetailsContent'
import V2ProjectHandleContent from 'components/v2/V2Project/V2ProjectSettings/V2ProjectHandleContent'
import {
  V2SettingsKey,
  V2SettingsKeyTitleMap,
} from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettings'
import V2ReconfigureFCContent from 'components/v2/V2Project/V2ProjectSettings/V2ReconfigureFCContent'
import V2ReservedTokensContent from 'components/v2/V2Project/V2ProjectSettings/V2ReservedTokensContent'
import V2TokenMigrationContent from 'components/v2/V2Project/V2ProjectSettings/V2TokenMigrationContent'
import V2TransferOwnershipContent from 'components/v2/V2Project/V2ProjectSettings/V2TransferOwnershipContent'
import V2VeNftContent from 'components/v2/V2Project/V2ProjectSettings/V2VeNftContent'

const defaultPage: V2SettingsKey = 'general'

const V2ProjectSettingsContent = () => {
  const [selectedSettingsPage, setSelectedSettingsPage] =
    useState<V2SettingsKey>(defaultPage)
  const router = useRouter()

  useEffect(() => {
    setSelectedSettingsPage(() => {
      switch (router.query.page) {
        case 'general':
          return 'general'
        case 'projecthandle':
          return 'projecthandle'
        case 'reconfigurefc':
          return 'reconfigurefc'
        case 'payouts':
          return 'payouts'
        case 'reservedtokens':
          return 'reservedtokens'
        case 'paymentaddresses':
          return 'paymentaddresses'
        case 'v1tokenmigration':
          return 'v1tokenmigration'
        case 'venft':
          return 'venft'
        case 'transferownership':
          return 'transferownership'
        case 'archiveproject':
          return 'archiveproject'
        default:
          return defaultPage
      }
    })
  }, [router.query.page])

  const getActiveTab = (selectedSettingsPage: V2SettingsKey) => {
    switch (selectedSettingsPage) {
      case 'general':
        return <V2ProjectDetails />
      case 'projecthandle':
        return <V2ProjectHandleContent />
      case 'reconfigurefc':
        return <V2ReconfigureFCContent />
      case 'payouts':
        return <V2EditPayoutsContent />
      case 'reservedtokens':
        return <V2ReservedTokensContent />
      case 'paymentaddresses':
        return <V2PaymentAddressesContent />
      case 'v1tokenmigration':
        return <V2TokenMigrationContent />
      case 'venft':
        return <V2VeNftContent />
      case 'transferownership':
        return <V2TransferOwnershipContent />
      case 'archiveproject':
        return <V2ArchiveProjectContent />
      default:
        return null
    }
  }

  return (
    <Layout style={{ background: 'transparent' }}>
      <h2>{V2SettingsKeyTitleMap[selectedSettingsPage]}</h2>
      <Divider />
      <Layout.Content style={{ margin: '0 16px' }}>
        {getActiveTab(selectedSettingsPage)}
      </Layout.Content>
    </Layout>
  )
}

export default V2ProjectSettingsContent
