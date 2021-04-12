import { Col, Row, Space } from 'antd'
import { colors } from 'constants/styles/colors'
import { ProjectIdentifier } from 'models/projectIdentifier'
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
        border: '1px solid ' + colors.grapeHint,
        cursor: 'pointer',
      }}
      key={project.handle}
      onClick={() => (window.location.hash = '/p/' + project.handle)}
    >
      <div style={{ marginRight: 20 }}>
        <ProjectLogo uri={project.logoUri} name={project.name} size={80} />
      </div>

      <div>
        <h2 style={{ color: colors.bodyPrimary }}>{project.name}</h2>
        <h3>
          <Space size="middle">
            <span style={{ color: colors.bodySecondary }}>
              @{project.handle}
            </span>
            {project?.link ? (
              <span style={{ fontWeight: 400, color: colors.cta }}>
                {project.link}
              </span>
            ) : null}
          </Space>
        </h3>
      </div>
    </div>
  )

  const gutter = 20

  return (
    <div>
      {projects?.map((project, i) =>
        i % 2 === 0 ? (
          <Row gutter={gutter} style={{ marginBottom: gutter }}>
            <Col xs={24} sm={12}>
              {projectCard(project)}
            </Col>
            {i + 1 < projects.length ? (
              <Col xs={24} sm={12}>
                {projectCard(projects[i + 1])}
              </Col>
            ) : null}
          </Row>
        ) : null,
      )}
    </div>
  )
}
