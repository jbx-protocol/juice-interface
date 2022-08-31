import { Divider, Layout } from 'antd'
import {
  V2SettingsKey,
  V2SettingsKeyTitleMap,
} from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettings'
import { ThemeContext } from 'contexts/themeContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import V2ProjectDetails from './pages/V2ProjectDetails'

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
        return <V2ProjectDetails />
      case 'projecthandle':
        // return <V2ReconfigureProjectHandle />
        return <div>Reconfigure Project Handle</div>
      case 'reconfigurefc':
        // return <V2ProjectReconfigure />
        return <div>Reconfigure Funding Cycle</div>
      case 'payouts':
        // return <V2ProjectSettingsPayoutsContent />
        return <div>Payouts</div>
      case 'reservedtokens':
        // return <EditTokenAllocationContent />
        return <div>Reserved Tokens</div>
      case 'paymentaddresses':
        // return (
        //   <PayableAddressSection
        //     useDeployProjectPayerTx={useDeployProjectPayerTx}
        //   />
        // )
        return <div>Payment Addresses</div>
      case 'v1tokenmigration':
        // return <V1TokenMigrationSetupSection />
        return <div>V1 Token Migration</div>
      case 'venft':
        // return <V2ProjectSettingsVenftContent />
        return <div>VENFT</div>
      case 'transferownership':
        // return (
        //   <TransferOwnershipForm
        //     ownerAddress={projectOwnerAddress}
        //     useTransferProjectOwnershipTx={useTransferProjectOwnershipTx}
        //   />
        // )
        return <div>Transfer Ownership</div>
      case 'archiveproject':
        // return <ArchiveV2Project />
        return <div>Archive Project</div>
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
