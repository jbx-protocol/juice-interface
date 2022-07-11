import { useContext, useState } from 'react'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useProjectPayers } from 'hooks/v2/ProjectPayers'
import ProjectPayersModal from './ProjectPayersModal'

export default function ProjectPayers() {
  const { projectId } = useContext(V2ProjectContext)

  const [projectPayersModalIsVisible, setProjectPayersModalIsVisible] =
    useState<boolean>()

  const { data: projectPayers } = useProjectPayers(projectId)

  return (
    <div>
      {projectPayers && (
        <div
          style={{ cursor: 'pointer', fontWeight: 500 }}
          onClick={() => setProjectPayersModalIsVisible(true)}
        >
          {projectPayers?.length} ETH-ERC20 payment address
          {projectPayers?.length > 1 ? 'es' : ''}
        </div>
      )}

      <ProjectPayersModal
        visible={projectPayersModalIsVisible}
        onCancel={() => setProjectPayersModalIsVisible(false)}
        projectPayers={projectPayers}
      />
    </div>
  )
}
