import { layouts } from 'constants/styles/layouts'
import { shadowCard } from 'constants/styles/shadow-card'
import { UserContext } from 'contexts/userContext'
import { useProjects } from 'hooks/Projects'
import { ProjectIdentifier } from 'models/projectIdentifier'
import React, { useContext } from 'react'
import { useParams } from 'react-router'

export default function Projects() {
  const { signingProvider } = useContext(UserContext)

  const { owner }: { owner?: string } = useParams()

  const projects = useProjects(owner ?? null, signingProvider)

  return (
    <div style={{ ...layouts.maxWidth }}>
      <h1>Projects {owner ? ' for ' + owner : ' on Juice'}</h1>
      {projects
        ? Object.entries(projects).map(
            ([key, project]: [string, ProjectIdentifier]) => (
              <div
                style={{
                  ...shadowCard,
                  display: 'inline-block',
                  padding: 20,
                  marginRight: 20,
                  marginBottom: 20,
                  width: 'calc(33% - 20px)',
                  stroke: 'none',
                  cursor: 'pointer',
                }}
                key={key}
                onClick={() => (window.location.hash = '/p/' + project.handle)}
              >
                <h2>{project.name}</h2>@{project.handle}
              </div>
            ),
          )
        : 'No projects'}
    </div>
  )
}
