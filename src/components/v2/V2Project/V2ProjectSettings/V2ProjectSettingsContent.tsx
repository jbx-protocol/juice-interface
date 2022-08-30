import { Divider, Layout } from 'antd'
import { PayableAddressSection } from 'components/Project/ProjectToolsDrawer/PayableAddressSection'
import { TransferOwnershipForm } from 'components/Project/ProjectToolsDrawer/TransferOwnershipForm'
import ArchiveV2Project from 'components/v2/V2Project/ArchiveV2Project'
import { EditTokenAllocationContent } from 'components/v2/V2Project/EditTokenAllocationContent'
import V2ProjectDetails from 'components/v2/V2Project/V2ProjectSettings/V2ProjectDetails'
import V2ProjectReconfigure from 'components/v2/V2Project/V2ProjectSettings/V2ProjectReconfigure'
import {
  V2SettingsKey,
  V2SettingsKeyTitleMap,
} from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettings'
import V2ProjectSettingsPayoutsContent from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettingsEditPayouts'
import V2ProjectSettingsVenftContent from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettingsVenftContent'
import V2ReconfigureProjectHandle from 'components/v2/V2Project/V2ProjectSettings/V2ReconfigureProjectHandle'
import { V1TokenMigrationSetupSection } from 'components/v2/V2Project/V2ProjectToolsDrawer/V1TokenMigrationSetupSection'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { useTransferProjectOwnershipTx } from 'hooks/v2/transactor/TransferProjectOwnershipTx'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

const defaultPage: V2SettingsKey = 'general'

const V2ProjectSettingsContent = () => {
  const { projectOwnerAddress } = useContext(V2ProjectContext)
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
        return <V2ReconfigureProjectHandle />
      case 'reconfigurefc':
        return <V2ProjectReconfigure />
      case 'payouts':
        return <V2ProjectSettingsPayoutsContent />
      case 'reservedtokens':
        return <EditTokenAllocationContent />
      case 'paymentaddresses':
        return (
          <PayableAddressSection
            useDeployProjectPayerTx={useDeployProjectPayerTx}
          />
        )
      case 'v1tokenmigration':
        return <V1TokenMigrationSetupSection />
      case 'venft':
        return <V2ProjectSettingsVenftContent />
      case 'transferownership':
        return (
          <TransferOwnershipForm
            ownerAddress={projectOwnerAddress}
            useTransferProjectOwnershipTx={useTransferProjectOwnershipTx}
          />
        )
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
