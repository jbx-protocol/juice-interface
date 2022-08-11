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
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const defaultPage: V2SettingsContentKey = 'general'

const V2ProjectSettingsContent = () => {
  const [selectedSettingsPage, setSelectedSettingsPage] =
    useState<V2SettingsContentKey>(defaultPage)
  const router = useRouter()

  useEffect(() => {
    setSelectedSettingsPage(() => {
      switch (router.query.settingsPage) {
        case 'general':
          return 'general'
        case 'projecthandle':
          return 'projecthandle'
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
  }, [router.query.settingsPage])

  const getActiveTab = (selectedSettingsPage: V2SettingsContentKey) => {
    switch (selectedSettingsPage) {
      case 'general':
        return <V2ProjectDetails />
      case 'projecthandle':
        return <V2ReconfigureProjectHandle />
      case 'payouts':
        return <V2ProjectSettingsPayoutsContent />
      case 'reservedtokens':
        return <EditTokenAllocationContent />
      case 'paymentaddresses':
        return <ProjectPayersSection />
      case 'v1tokenmigration':
        return <V1TokenMigrationSetupSection />
      case 'venft':
        return <V2ProjectSettingsVenftContent />
      case 'transferownership':
        return <TransferOwnershipForm />
      case 'archiveproject':
        return <ArchiveV2Project />
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
