import { Divider, Layout } from 'antd'
import {
  V2SettingsKey,
  V2SettingsKeyTitleMap,
} from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettings'
import { ThemeContext } from 'contexts/themeContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { V1V2TokenMigrationSettingsPage } from './pages/V1V2TokenMigrationSettingsPage'
import { V2ArchiveProjectSettingsPage } from './pages/V2ArchiveProjectSettingsPage'
import { V2PaymentAddressSettingsPage } from './pages/V2PaymentAddressSettingsPage'
import { V2PayoutsSettingsPage } from './pages/V2PayoutsSettingsPage'
import { V2ProjectDetailsSettingsPage } from './pages/V2ProjectDetailsSettingsPage'
import { V2ProjectHandleSettingsPage } from './pages/V2ProjectHandleSettingsPage'
import { V2ReconfigureFundingCycleSettingsPage } from './pages/V2ReconfigureFundingCycleSettingsPage'
import { V2ReservedTokensSettingsPage } from './pages/V2ReservedTokensSettingsPage'
import { V2TransferOwnershipSettingsPage } from './pages/V2TransferOwnershipSettingsPage'
import { V2VeNftSettingsPage } from './pages/V2VeNftSettingsPage'

const defaultPage: V2SettingsKey = 'general'

const V2ProjectSettingsContent = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
        return <V2ProjectDetailsSettingsPage />
      case 'projecthandle':
        return <V2ProjectHandleSettingsPage />
      case 'reconfigurefc':
        return <V2ReconfigureFundingCycleSettingsPage />
      case 'payouts':
        return <V2PayoutsSettingsPage />
      case 'reservedtokens':
        return <V2ReservedTokensSettingsPage />
      case 'paymentaddresses':
        return <V2PaymentAddressSettingsPage />
      case 'v1tokenmigration':
        return <V1V2TokenMigrationSettingsPage />
      case 'venft':
        return <V2VeNftSettingsPage />
      case 'transferownership':
        return <V2TransferOwnershipSettingsPage />
      case 'archiveproject':
        return <V2ArchiveProjectSettingsPage />

      default:
        return null
    }
  }

  return (
    <Layout style={{ background: 'transparent' }}>
      <h2 style={{ color: colors.text.primary, marginBottom: 0 }}>
        {V2SettingsKeyTitleMap[selectedSettingsPage]}
      </h2>

      <Divider />

      <Layout.Content style={{ margin: '0 16px' }}>
        {getActiveTab(selectedSettingsPage)}
      </Layout.Content>
    </Layout>
  )
}

export default V2ProjectSettingsContent
