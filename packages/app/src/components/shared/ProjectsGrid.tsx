import { Col, ColProps, Row } from 'antd'
import { ProjectInfo } from 'models/project-info'

import ProjectCard from './ProjectCard'

export default function ProjectsGrid({
  projects,
}: {
  projects: ProjectInfo[]
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
                <ProjectCard project={project} />
              </Col>
              {i + 1 < projects.length && (
                <Col {...colProps}>
                  <ProjectCard project={projects[i + 1]} />
                </Col>
              )}
            </Row>
          ),
      )}
    </div>
  )
}
