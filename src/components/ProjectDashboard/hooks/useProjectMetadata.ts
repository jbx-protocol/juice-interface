import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useContext } from 'react'

export const useProjectMetadata = () => useContext(ProjectMetadataContext)
