import { useProjectMetadata } from 'components/ProjectDashboard/hooks'

export const useProjectHeaderLogo = () => {
  const { projectMetadata, projectId } = useProjectMetadata()
  return {
    projectId,
    projectLogoUri: projectMetadata?.logoUri,
    projectLogoName: projectMetadata?.name,
  }
}
