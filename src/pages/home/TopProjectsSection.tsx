import { Trans } from '@lingui/macro'
import { Button, Skeleton, Space } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import Loading from 'components/Loading'
import { ProjectCardProject } from 'components/ProjectCard'
import ProjectLogo from 'components/ProjectLogo'
import { ThemeContext } from 'contexts/themeContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useProjectsQuery } from 'hooks/Projects'
import { RightCircleOutlined } from '@ant-design/icons'
import { useContext } from 'react'
import Link from 'next/link'
import useMobile from 'hooks/Mobile'

import { SectionHeading } from './SectionHeading'

const SmallProjectCardMobile = ({
  project,
}: {
  project: ProjectCardProject
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { data: metadata } = useProjectMetadata(project?.metadataUri)

  return (
    <Link
      key={`${project.id}_${project.cv}`}
      href={
        project.cv === '2'
          ? `/v2/p/${project.projectId}`
          : `/p/${project?.handle}`
      }
    >
      <div
        className="clickable-border"
        style={{
          cursor: 'pointer',
          overflow: 'hidden',
          width: '100%',
          padding: '0.5rem 1rem',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ProjectLogo
            uri={metadata?.logoUri}
            name={metadata?.name}
            size={60}
          />
        </div>

        <div
          style={{
            fontWeight: 400,
            width: '100%',
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

          <div
            style={{
              color: colors.text.primary,
              fontWeight: 500,
            }}
          >
            <ETHAmount amount={project?.totalPaid} precision={0} /> raised
          </div>
        </div>
      </div>
    </Link>
  )
}

const SmallProjectCard = ({ project }: { project: ProjectCardProject }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { data: metadata } = useProjectMetadata(project?.metadataUri)

  return (
    <Link
      key={`${project.id}_${project.cv}`}
      href={
        project.cv === '2'
          ? `/v2/p/${project.projectId}`
          : `/p/${project?.handle}`
      }
    >
      <div
        style={{
          cursor: 'pointer',
          overflow: 'hidden',
          width: 180,
          padding: '1rem',
          textAlign: 'center',
        }}
        className="clickable-border"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '0.5rem',
          }}
        >
          <ProjectLogo
            uri={metadata?.logoUri}
            name={metadata?.name}
            size={90}
          />
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
      </div>
    </Link>
  )
}

export function TopProjectsSection() {
  const {
    theme: { colors },
    isDarkMode,
  } = useContext(ThemeContext)
  const isMobile = useMobile()

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
      <div style={{ margin: '40px auto', maxWidth: 1080 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <SectionHeading>
              <Trans>Fund and operate your thing, your way.</Trans>
            </SectionHeading>

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
                <a
                  href="/projects"
                  className="text-primary hover-text-decoration-underline"
                >
                  hundreds of projects
                </a>{' '}
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
                  flexWrap: 'wrap',
                }}
              >
                {previewProjects.map(p =>
                  isMobile ? (
                    <SmallProjectCardMobile key={p.metadataUri} project={p} />
                  ) : (
                    <SmallProjectCard key={p.metadataUri} project={p} />
                  ),
                )}
              </div>
            ) : (
              <Loading />
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Button
                size="large"
                type="primary"
                href="/create"
                block={isMobile}
              >
                <Trans>Start raising funds</Trans>
              </Button>

              <div
                role="button"
                style={{
                  fontSize: '0.9rem',
                  color: colors.text.secondary,
                  cursor: 'pointer',
                }}
                className="hover-text-decoration-underline"
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
              </div>
            </Space>
          </div>
        </Space>
      </div>
    </section>
  )
}
