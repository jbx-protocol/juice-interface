import { t } from '@lingui/macro'
import { ReactNode } from 'react'
import { useConfigurationPanel } from '../hooks/useConfigurationPanel'
import { ConfigurationTable } from './ConfigurationTable'

export type ConfigurationPanelDatum = {
  name: ReactNode
  old?: ReactNode
  new: ReactNode
}

export type ConfigurationPanelTableData = {
  [key: string]: ConfigurationPanelDatum
}

export const ConfigurationPanel = ({
  type,
}: {
  type: 'current' | 'upcoming'
}) => {
  const { cycle, token, otherRules } = useConfigurationPanel(type)
  return (
    <div className="flex flex-col gap-8">
      <ConfigurationTable title={t`Cycle`} data={cycle} />
      <ConfigurationTable title={t`Token`} data={token} />
      <ConfigurationTable title={t`Other rules`} data={otherRules} />
    </div>
  )
}
