import { ProjectSettingsDashboard } from 'packages/v2v3/components/V2V3Project/V2V3ProjectSettings/ProjectSettingsDashboard'
import { V2V3SettingsProvider } from 'packages/v2v3/components/V2V3Project/V2V3ProjectSettings/V2V3SettingsProvider'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function V2V3ProjectSettingsPage() {
  return (
    <V2V3SettingsProvider>
      <ProjectSettingsDashboard />
    </V2V3SettingsProvider>
  )
}

export const getServerSideProps = globalGetServerSideProps
