import { useRouter } from 'next/router'
import { V4V5SettingsProvider } from 'packages/v4v5/contexts/V4V5SettingsProvider'
import { ProjectSettingsContent } from 'packages/v4v5/views/V4V5ProjectSettings/ProjectSettingsContent'
import { SettingsPageKey } from 'packages/v4v5/views/V4V5ProjectSettings/ProjectSettingsDashboard'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function V4CycleSettingsPage() {
  const router = useRouter()

  const { settingsPage } = router.query
  if (!settingsPage) return null

  return (
    <V4V5SettingsProvider version={4}>
      <ProjectSettingsContent
        settingsPageKey={settingsPage as SettingsPageKey}
      />
    </V4V5SettingsProvider>
  )
}

export const getServerSideProps = globalGetServerSideProps
