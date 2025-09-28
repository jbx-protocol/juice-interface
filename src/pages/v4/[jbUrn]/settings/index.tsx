import { V4V5SettingsProvider } from 'packages/v4v5/contexts/V4V5SettingsProvider'
import { ProjectSettingsDashboard } from 'packages/v4v5/views/V4V5ProjectSettings/ProjectSettingsDashboard'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function V4ProjectSettingsPage() {
  return (
    <V4V5SettingsProvider version={4}>
      <ProjectSettingsDashboard />
    </V4V5SettingsProvider>
  )
}

export const getServerSideProps = globalGetServerSideProps
