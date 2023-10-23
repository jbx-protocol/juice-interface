import { useProjectMetadata } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks'

export const useProjectHeaderLogo = () => {
  const { projectMetadata, projectId } = useProjectMetadata()
  return {
    projectId,
    projectLogoUri: projectMetadata?.logoUri,
    projectLogoName: projectMetadata?.name,
  }
}
