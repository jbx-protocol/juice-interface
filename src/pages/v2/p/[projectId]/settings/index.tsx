import { ProjectSettingsDashboard } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/ProjectSettingsDashboard'
import { V2V3SettingsProvider } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/V2V3SettingsProvider'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function V2V3ProjectSettingsPage() {
  return (
    <V2V3SettingsProvider>
      <ProjectSettingsDashboard />
    </V2V3SettingsProvider>
  )
}

export const getServerSideProps = globalGetServerSideProps
