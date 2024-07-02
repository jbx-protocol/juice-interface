import { useRouter } from 'next/router'
import { ProjectSettingsContent } from 'packages/v2v3/components/V2V3Project/V2V3ProjectSettings/ProjectSettingsContent'
import { V2V3SettingsPageKey } from 'packages/v2v3/components/V2V3Project/V2V3ProjectSettings/ProjectSettingsDashboard'
import { V2V3SettingsProvider } from 'packages/v2v3/components/V2V3Project/V2V3ProjectSettings/V2V3SettingsProvider'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function V2V3CycleSettingsPage() {
  const router = useRouter()

  const { settingsPage } = router.query
  if (!settingsPage) return null

  return (
    <V2V3SettingsProvider>
      <ProjectSettingsContent
        settingsPageKey={settingsPage as V2V3SettingsPageKey}
      />
    </V2V3SettingsProvider>
  )
}

export const getServerSideProps = globalGetServerSideProps
