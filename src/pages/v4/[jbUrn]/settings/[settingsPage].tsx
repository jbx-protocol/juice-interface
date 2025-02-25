import { useRouter } from 'next/router'
import { V4SettingsProvider } from 'packages/v4/contexts/V4SettingsProvider'
import { ProjectSettingsContent } from 'packages/v4/views/V4ProjectSettings/ProjectSettingsContent'
import { SettingsPageKey } from 'packages/v4/views/V4ProjectSettings/ProjectSettingsDashboard'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function V4CycleSettingsPage() {
  const router = useRouter()

  const { settingsPage } = router.query
  if (!settingsPage) return null

  return (
    <V4SettingsProvider>
      <ProjectSettingsContent
        settingsPageKey={settingsPage as SettingsPageKey}
      />
    </V4SettingsProvider>
  )
}

export const getServerSideProps = globalGetServerSideProps
