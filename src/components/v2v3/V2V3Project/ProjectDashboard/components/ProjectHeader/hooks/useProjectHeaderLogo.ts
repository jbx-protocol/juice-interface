import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'

export const useProjectHeaderLogo = () => {
  const { projectMetadata, projectId } = useProjectMetadataContext()
  return {
    projectId,
    projectLogoUri: projectMetadata?.logoUri,
    projectLogoName: projectMetadata?.name,
  }
}
