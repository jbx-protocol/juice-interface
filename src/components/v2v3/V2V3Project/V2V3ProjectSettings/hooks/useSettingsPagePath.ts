import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'
import { V2V3SettingsPageKey } from '../ProjectSettingsDashboard'

export function useSettingsPagePath(key?: V2V3SettingsPageKey) {
  const { handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return settingsPagePath(key, { projectId, handle })
}
