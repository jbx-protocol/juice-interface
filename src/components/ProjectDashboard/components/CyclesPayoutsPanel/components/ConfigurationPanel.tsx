import { t } from '@lingui/macro'
import React, { ReactNode } from 'react'
import { ConfigurationTable } from './ConfigurationTable'

export type ConfigurationPanelDatum = {
  name: ReactNode
  old?: ReactNode
  new: ReactNode
}

export type ConfigurationPanelTableData = {
  [key: string]: ConfigurationPanelDatum
}

type ConfigurationPanelProps = {
  cycle: ConfigurationPanelTableData
  token: ConfigurationPanelTableData
  otherRules: ConfigurationPanelTableData
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  cycle,
  token,
  otherRules,
}) => {
  return (
    <div className="flex flex-col gap-8">
      <ConfigurationTable title={t`Cycle`} data={cycle} />
      <ConfigurationTable title={t`Token`} data={token} />
      <ConfigurationTable title={t`Other rules`} data={otherRules} />
    </div>
  )
}
