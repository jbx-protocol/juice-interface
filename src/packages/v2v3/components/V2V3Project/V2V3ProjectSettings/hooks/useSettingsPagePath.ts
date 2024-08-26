import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { settingsPagePath } from 'packages/v2v3/utils/routes'
import { useContext } from 'react'
import { V2V3SettingsPageKey } from '../ProjectSettingsDashboard'

export function useSettingsPagePath(key?: V2V3SettingsPageKey) {
  const { handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return settingsPagePath(key, { projectId, handle })
}
