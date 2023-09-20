import ProjectLogo from 'components/ProjectLogo'
import { twMerge } from 'tailwind-merge'
import { useProjectHeaderLogo } from '../hooks/useProjectHeaderLogo'

export const ProjectHeaderLogo = ({ className }: { className?: string }) => {
  const { projectId, projectLogoUri, projectLogoName } = useProjectHeaderLogo()
  return (
    <ProjectLogo
      className={twMerge('h-[172px] w-[172px]', className)}
      name={projectLogoName}
      uri={projectLogoUri}
      projectId={projectId}
    />
  )
}
