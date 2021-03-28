import { Space } from 'antd'
import { colors } from 'constants/styles/colors'
import { layouts } from 'constants/styles/layouts'
import { UserContext } from 'contexts/userContext'
import { useProjects } from 'hooks/Projects'
import { ProjectIdentifier } from 'models/projectIdentifier'
import React, { useContext } from 'react'
import { useParams } from 'react-router'

export default function Projects() {
  const { signingProvider } = useContext(UserContext)

  const { owner }: { owner?: string } = useParams()

  const projects = useProjects(owner, signingProvider)

  return (
    <div style={{ ...layouts.maxWidth }}>
      {projects ? (
        <Space direction="vertical">
          {Object.entries(projects).map(
            ([key, project]: [string, ProjectIdentifier]) => (
              <div
                style={{
                  background: colors.backgroundTertiary,
                  borderRadius: 8,
                  stroke: 'none',
                  padding: 20,
                  cursor: 'pointer',
                }}
                key={key}
                onClick={() => (window.location.hash = '/p/' + key)}
              >
                {project.name} - {project.handle}
              </div>
            ),
          )}
        </Space>
      ) : (
        'No projects'
      )}
    </div>
  )
}
