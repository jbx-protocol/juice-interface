import { Col, ColProps, Row } from 'antd'
import { ProjectMetadata } from 'models/project-metadata'

import ProjectCard from './ProjectCard'

export default function ProjectsGrid({
  projects,
}: {
  projects: { metadata: ProjectMetadata; handle: string }[]
}) {
  const gutter = 20

  const colProps: ColProps = {
    xs: 24,
    md: 12,
    style: { marginBottom: gutter },
  }

  return (
    <div>
      {projects?.map(
        (project, i) =>
          i % 2 === 0 && (
            <Row gutter={gutter} key={project.handle}>
              <Col {...colProps}>
                <ProjectCard
                  metadata={project.metadata}
                  handle={project.handle}
                />
              </Col>
              {i + 1 < projects.length && (
                <Col {...colProps}>
                  <ProjectCard
                    metadata={projects[i + 1].metadata}
                    handle={projects[i + 1].handle}
                  />
                </Col>
              )}
            </Row>
          ),
      )}
    </div>
  )
}
