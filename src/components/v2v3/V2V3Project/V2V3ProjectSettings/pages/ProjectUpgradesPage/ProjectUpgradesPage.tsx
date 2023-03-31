import { Trans } from '@lingui/macro'
import { Button, Space, Statistic } from 'antd'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useContext, useState } from 'react'
import { JBUpgrade, UPGRADES } from './versions/upgrades'
import { useAvailableUpgrades } from './versions/useAvailableUpgrades'

export function ProjectUpgradesPage() {
  const { cv } = useContext(V2V3ContractsContext)

  const [upgradeWizardOpen, setUpgradeWizardOpen] = useState<false | JBUpgrade>(
    false,
  )

  const availableUpgrades = useAvailableUpgrades()
  const isUpgradeAvailable = Boolean((availableUpgrades ?? []).length > 0)

  // lightweight 'routing' to the upgrade wizard for each upgrade
  if (upgradeWizardOpen) {
    const Component = UPGRADES[upgradeWizardOpen].component
    return <Component />
  }

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
          <div>
            <h3>
              <Trans>Available upgrades</Trans>
            </h3>
            {availableUpgrades?.map(v => {
              const upgrade = UPGRADES[v]
              return (
                <div key={v}>
                  <h4>{upgrade.name}</h4>
                  {upgrade.description && <p>{upgrade.description()}</p>}
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => setUpgradeWizardOpen(v)}
                  >
                    <Trans>Upgrade to {upgrade.name}</Trans>
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </Space>
    </div>
  )
}
