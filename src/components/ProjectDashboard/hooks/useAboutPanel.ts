import { useProjectMetadata } from './useProjectMetadata'

export const useAboutPanel = () => {
  const { projectMetadata } = useProjectMetadata()
  const description = projectMetadata?.description
  return {
    description,
  }
}
