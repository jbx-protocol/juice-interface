import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { useState } from 'react'

import { useIsUpgradeAvailable } from './hooks/useIsUpgradeAvailable'
import { UpgradeWizard } from './UpgradeWizard/UpgradeWizard'

// Uses of `cv` have been commented out: `cv` has changed and is no longer an indicator of a project's contracts version. We could use `project.pv` instead, but `pv` only relates to the JBProjects contract version and only goes up to "2". To get the version number we need, it may need to be a function of both `pv` AND wether or not the project has launched v3 funding cycles. Leaving commented sections here for now as a reference to the page's intial design.
// - peri

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
