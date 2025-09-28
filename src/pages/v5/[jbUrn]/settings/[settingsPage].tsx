import { jbUrn } from 'juice-sdk-core'
import { useRouter } from 'next/router'
import { V4V5SettingsProvider } from 'packages/v4v5/contexts/V4V5SettingsProvider'
import { V4V5VersionProvider } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { ProjectSettingsContent } from 'packages/v4v5/views/V4V5ProjectSettings/ProjectSettingsContent'
import { SettingsPageKey } from 'packages/v4v5/views/V4V5ProjectSettings/ProjectSettingsDashboard'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function V5CycleSettingsPage() {
  const router = useRouter()
  const { settingsPage } = router.query
  const { projectId, chainId } = jbUrn(router.query.jbUrn as string) ?? {}

  if (!settingsPage || !projectId || !chainId) return null

  return (
    <V4V5VersionProvider chainId={chainId} projectId={Number(projectId)}>
      <V4V5SettingsProvider>
        <ProjectSettingsContent
          settingsPageKey={settingsPage as SettingsPageKey}
        />
      </V4V5SettingsProvider>
    </V4V5VersionProvider>
  )
}

export const getServerSideProps = globalGetServerSideProps