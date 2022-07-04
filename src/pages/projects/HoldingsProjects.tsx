import { t, Trans } from '@lingui/macro'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import ProjectCard from 'components/ProjectCard'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useHoldingsProjectsQuery } from 'hooks/Projects'
import React, { useContext } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function HoldingsProjects() {
  const { userAddress } = useContext(NetworkContext)

  const { data: projects, isLoading } = useHoldingsProjectsQuery(userAddress)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!userAddress) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 20,
        }}
        hidden={isLoading}
      >
        <Trans>Connect your wallet to see your holdings.</Trans>
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
            <Trans>You don't hold tokens for any Juicebox project.</Trans>
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

      {projects?.length !== 0 && (
        <p style={{ marginBottom: 40, marginTop: 40, maxWidth: 800 }}>
          <InfoCircleOutlined />{' '}
          <Trans>Projects that you hold tokens for.</Trans>
        </p>
      )}
    </>
  )
}
