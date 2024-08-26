import { V4SettingsProvider } from 'packages/v4/contexts/V4SettingsProvider'
import { ProjectSettingsDashboard } from 'packages/v4/views/V4ProjectSettings/ProjectSettingsDashboard'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function V4ProjectSettingsPage() {
  return (
    <V4SettingsProvider>
      <ProjectSettingsDashboard />
    </V4SettingsProvider>
  )
}

export const getServerSideProps = globalGetServerSideProps
