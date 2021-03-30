import { shadowCard } from 'constants/styles/shadow-card'
import { ProjectIdentifier } from 'models/projectIdentifier'
import React from 'react'

export default function ProjectsGrid({
  projects,
}: {
  projects: ProjectIdentifier[] | undefined
}) {
  return (
    <div>
      {projects?.map(project => (
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
          key={project.handle}
          onClick={() => (window.location.hash = '/p/' + project.handle)}
        >
          <h2>{project.name}</h2>@{project.handle}
        </div>
      ))}
    </div>
  )
}
