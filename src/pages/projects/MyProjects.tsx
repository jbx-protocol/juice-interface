import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import Grid from 'components/shared/Grid'
import Loading from 'components/shared/Loading'
import ProjectCard from 'components/shared/ProjectCard'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useMyProjectsQuery } from 'hooks/Projects'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

export default function MyProjects() {
  const { userAddress } = useContext(NetworkContext)

  const { data: projects, isLoading } = useMyProjectsQuery(userAddress)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (isLoading) {
    return (
      <div style={{ marginTop: 40 }}>
        <Loading />
      </div>
    )
  }

  if (!userAddress) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 20,
        }}
      >
        <Trans>Connect your wallet to see your projects.</Trans>
      </div>
    )
  }

  return (
    <>
      {projects && projects.length > 0 && (
        <Grid>
          {projects.map(p => (
            <ProjectCard key={`${p.id}_${p.cv}`} project={p} />
          ))}
        </Grid>
      )}

      {projects &&
        (projects.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 20,
            }}
          >
            <p>
              <Trans>You haven't created any projects yet.</Trans>
            </p>

            <Link to="/create">
              <Button type="primary">
                <Trans>Create project</Trans>
              </Button>
            </Link>
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              color: colors.text.disabled,
              padding: 20,
            }}
          >
            {projects.length} {projects.length === 1 ? t`project` : t`projects`}{' '}
          </div>
        ))}

      {projects?.length !== 0 && (
        <p style={{ marginBottom: 40, marginTop: 40, maxWidth: 800 }}>
          <InfoCircleOutlined /> <Trans>Projects that you have created.</Trans>
        </p>
      )}
    </>
  )
}
