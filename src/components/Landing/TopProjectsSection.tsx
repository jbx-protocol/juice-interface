import { Trans } from '@lingui/macro'
import { Button, Skeleton, Space } from 'antd'
import ETHAmount from 'components/shared/currency/ETHAmount'
import Loading from 'components/shared/Loading'
import { ProjectCardProject } from 'components/shared/ProjectCard'
import ProjectLogo from 'components/shared/ProjectLogo'
import { ThemeContext } from 'contexts/themeContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useProjectsQuery } from 'hooks/Projects'
import { RightCircleOutlined } from '@ant-design/icons'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

const SmallProjectCard = ({ project }: { project: ProjectCardProject }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { data: metadata } = useProjectMetadata(project?.metadataUri)

  return (
    <Link
      style={{
        cursor: 'pointer',
        overflow: 'hidden',
        width: '200px',
        padding: '1rem',
        textAlign: 'center',
      }}
      key={`${project.id}_${project.cv}`}
      to={
        project.cv === '2'
          ? `/v2/p/${project.projectId}`
          : `/p/${project?.handle}`
      }
      className="clickable-border"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <ProjectLogo uri={metadata?.logoUri} name={metadata?.name} size={70} />
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          fontWeight: 400,
        }}
      >
        {metadata ? (
          <span
            style={{
              color: colors.text.primary,
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {metadata.name}
          </span>
        ) : (
          <Skeleton paragraph={false} title={{ width: 120 }} active />
        )}

        <div>
          <span
            style={{
              color: colors.text.primary,
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            <ETHAmount amount={project?.totalPaid} precision={0} /> raised
          </span>
        </div>
      </div>
    </Link>
  )
}

export function TopProjectsSection() {
  const {
    theme: { colors },
    isDarkMode,
  } = useContext(ThemeContext)
  const { data: previewProjects } = useProjectsQuery({
    pageSize: 4,
  })

  return (
    <section
      style={{
        backgroundColor: isDarkMode ? colors.background.l1 : '#faf7f5',
        padding: '2rem',
      }}
    >
      <div style={{ padding: '0 40px', margin: '40px auto', maxWidth: 1080 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <h2
              style={{
                fontSize: '2.5rem',
                textAlign: 'center',
                fontWeight: 600,
                marginBottom: '0.8rem',
              }}
            >
              Fund and operate your thing, your way.
            </h2>

            <p
              style={{
                textAlign: 'center',
                fontSize: '1rem',
                marginBottom: '0.3rem',
                color: colors.text.primary,
              }}
            >
              <Trans>
                Juicebox puts the fun back in funding so you can focus on
                building.
              </Trans>
            </p>
            <p
              style={{
                textAlign: 'center',
                fontSize: '1rem',
                marginBottom: '0.8rem',
              }}
            >
              <Trans>
                Join{' '}
                <Link
                  to="/projects"
                  className="text-primary hover-text-decoration-underline"
                >
                  hundreds of projects
                </Link>{' '}
                sippin' the Juice.
              </Trans>
            </p>
          </div>

          <div style={{ marginBottom: '0.8rem' }}>
            {previewProjects ? (
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  width: '80%',
                  justifyContent: 'space-between',
                  margin: '0 auto',
                }}
              >
                {previewProjects.map(p => (
                  <SmallProjectCard key={p.metadataUri} project={p} />
                ))}
              </div>
            ) : (
              <Loading />
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical">
              <Button size="large" type="primary" href="/#/create">
                <Trans>Launch your project</Trans>
              </Button>

              <Button
                size="large"
                type="link"
                style={{ fontSize: '0.9rem', color: colors.text.secondary }}
                onClick={() => {
                  document
                    .getElementById('how-it-works')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Space size="small">
                  <Trans>How does it work?</Trans>
                  <RightCircleOutlined />
                </Space>
              </Button>
            </Space>
          </div>
        </Space>
      </div>
    </section>
  )
}
