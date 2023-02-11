import { Trans } from '@lingui/macro'
import { Button, Space, Statistic } from 'antd'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useContext, useState } from 'react'

import { useIsUpgradeAvailable } from './hooks/IsUpgradeAvailable'
import { UpgradeWizard } from './UpgradeWizard/UpgradeWizard'

export function ProjectUpgradesPage() {
  const { cv } = useContext(V2V3ContractsContext)

  const [upgradeWizardOpen, setUpgradeWizardOpen] = useState(false)

  const isUpgradeAvailable = useIsUpgradeAvailable()

  if (upgradeWizardOpen) return <UpgradeWizard />

  return (
    <div>
      <Space direction="vertical" size="large">
        {/* This isn't great because if the project owner has selected V2 on the version selector, it'll just say V2 here, which isn't what we want.
        Good enuf for now.
         */}
        <Statistic title="Current version" value={`V${cv}`} />
        {!isUpgradeAvailable && (
          <p>
            <Trans>Your project is up to date!</Trans>
          </p>
        )}

        {isUpgradeAvailable && (
          <Button type="primary" onClick={() => setUpgradeWizardOpen(true)}>
            <Trans>Start upgrade</Trans>
          </Button>
        )}
      </Space>
    </div>
  )
}
