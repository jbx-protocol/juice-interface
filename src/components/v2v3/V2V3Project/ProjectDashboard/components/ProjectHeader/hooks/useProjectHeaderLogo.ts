import { useProjectMetadata } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks'

export const useProjectHeaderLogo = () => {
  const { projectMetadata, projectId } = useProjectMetadata()

  const encodedUri = projectMetadata?.logoUri
    ? encodeURIComponent(projectMetadata?.logoUri)
    : ''
  const projectLogoUri = `/api/logo/${encodedUri}`

  return {
    projectId,
    projectLogoUri,
    projectLogoName: projectMetadata?.name,
  }
}
