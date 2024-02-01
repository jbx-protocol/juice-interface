import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useContext } from 'react'

export const useProjectMetadataContext = () =>
  useContext(ProjectMetadataContext)
