import { t, Trans } from '@lingui/macro'
import Grid from 'components/shared/Grid'
import Loading from 'components/shared/Loading'
import ProjectCard from 'components/shared/ProjectCard'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useMyProjectsQuery } from 'hooks/v1/Projects'
import React, { useContext } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function MyProjects() {
  const { userAddress } = useContext(NetworkContext)

  const { data: projects, isLoading } = useMyProjectsQuery(userAddress)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <React.Fragment>
      {projects && projects.length > 0 && (
        <React.Fragment>
          <Grid>
            {projects.map(p => (
              <ProjectCard project={p} />
            ))}
          </Grid>
        </React.Fragment>
      )}

      {!isLoading &&
        projects &&
        (projects.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: colors.text.disabled,
              padding: 20,
            }}
            hidden={isLoading}
          >
            <Trans>You haven't created any projects yet.</Trans>
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

      {isLoading && (
        <div style={{ marginTop: 40 }}>
          <Loading />
        </div>
      )}

      <p style={{ marginBottom: 40, marginTop: 40, maxWidth: 800 }}>
        <InfoCircleOutlined /> <Trans>Projects that you have created.</Trans>
      </p>
    </React.Fragment>
  )
}
