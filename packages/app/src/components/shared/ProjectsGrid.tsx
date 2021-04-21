import { Col, ColProps, Row } from 'antd'
import { colors } from 'constants/styles/colors'
import { ProjectIdentifier } from 'models/project-identifier'

import ProjectLogo from './ProjectLogo'

export default function ProjectsGrid({
  projects,
}: {
  projects: ProjectIdentifier[] | undefined
}) {
  const projectCard = (project: ProjectIdentifier) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 20,
        borderRadius: 12,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      className="clickable-border"
      key={project.handle}
      onClick={() => (window.location.hash = '/p/' + project.handle)}
    >
      <div style={{ marginRight: 20 }}>
        <ProjectLogo uri={project.logoUri} name={project.name} size={80} />
      </div>

      <div style={{ whiteSpace: 'break-spaces', minWidth: 0 }}>
        <h2 style={{ color: colors.bodyPrimary }}>{project.name}</h2>
        <span
          style={{
            fontWeight: 500,
            color: colors.bodySecondary,
            marginRight: 10,
            display: 'inline-block',
          }}
        >
          @{project.handle}
        </span>
        {project?.link ? (
          <span style={{ color: colors.cta }}>{project.link}</span>
        ) : null}
      </div>
    </div>
  )

  const gutter = 20

  const colProps: ColProps = {
    xs: 24,
    md: 12,
    style: { marginBottom: gutter },
  }

  return (
    <div>
      {projects?.map((project, i) =>
        i % 2 === 0 ? (
          <Row gutter={gutter} key={project.handle}>
            <Col {...colProps}>{projectCard(project)}</Col>
            {i + 1 < projects.length ? (
              <Col {...colProps}>{projectCard(projects[i + 1])}</Col>
            ) : null}
          </Row>
        ) : null,
      )}
    </div>
  )
}
