import { t } from '@lingui/macro'
import Grid from 'components/shared/Grid'
import Loading from 'components/shared/Loading'
import ProjectCard from 'components/shared/ProjectCard'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useMyProjectsQuery } from 'hooks/v1/Projects'
import React, { useContext } from 'react'

export default function MyProjects() {
  const { userAddress } = useContext(NetworkContext)

  const { data: projects } = useMyProjectsQuery(userAddress)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <React.Fragment>
      {projects && projects.length ? (
        <React.Fragment>
          <Grid
            children={projects?.map(p => <ProjectCard project={p} />) ?? <></>}
          />
          <div
            style={{
              textAlign: 'center',
              color: colors.text.disabled,
              padding: 20,
            }}
          >
            {projects?.length}{' '}
            {projects?.length === 1 ? t`project` : t`projects`}{' '}
          </div>
        </React.Fragment>
      ) : (
        <div style={{ marginTop: 40 }}>
          <Loading />
        </div>
      )}
    </React.Fragment>
  )
}
