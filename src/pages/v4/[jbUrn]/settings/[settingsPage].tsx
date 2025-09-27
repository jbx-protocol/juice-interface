import { useRouter } from 'next/router'
import { V4SettingsProvider } from 'packages/v4v5/contexts/V4SettingsProvider'
import { ProjectSettingsContent } from 'packages/v4v5/views/V4V5ProjectSettings/ProjectSettingsContent'
import { SettingsPageKey } from 'packages/v4v5/views/V4V5ProjectSettings/ProjectSettingsDashboard'
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
