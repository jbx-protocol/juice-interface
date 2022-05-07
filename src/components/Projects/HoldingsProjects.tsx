import { t } from '@lingui/macro'
import Grid from 'components/shared/Grid'
import Loading from 'components/shared/Loading'
import ProjectCard from 'components/shared/ProjectCard'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useHoldingsProjectsQuery } from 'hooks/v1/Projects'
import React, { useContext } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function HoldingsProjects() {
  const { userAddress } = useContext(NetworkContext)

  const { data: projects, isLoading } = useHoldingsProjectsQuery(userAddress)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <React.Fragment>
      {projects && projects.length > 0 && (
        <React.Fragment>
          <Grid>
            {projects.map((p, i) => (
              <ProjectCard key={i} project={p} />
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
            You don't hold tokens for any Juicebox project.
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
        <InfoCircleOutlined /> Projects that you hold tokens for.
      </p>
    </React.Fragment>
  )
}
