import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { useState } from 'react'

import { useIsUpgradeAvailable } from './hooks/useIsUpgradeAvailable'
import { UpgradeWizard } from './UpgradeWizard/UpgradeWizard'

// TODO should this page be removed?
export function ProjectUpgradesPage() {
  // const { cv } = useContext(ProjectMetadataContext)

  const [upgradeWizardOpen, setUpgradeWizardOpen] = useState(false)

  const isUpgradeAvailable = useIsUpgradeAvailable()

  if (upgradeWizardOpen) return <UpgradeWizard />

  return (
    <div>
      <Space direction="vertical" size="large">
        {/* <Statistic title="Current version" value={`V${cv}`} /> */}
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
