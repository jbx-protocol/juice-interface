import { ThemeContext } from 'contexts/themeContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { ProjectInfo } from 'models/project-info'
import { useContext } from 'react'

import Loading from './Loading'
import ProjectLogo from './ProjectLogo'

export default function ProjectCard({ project }: { project: ProjectInfo }) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const metadata = useProjectMetadata(project.uri)

  return (
    <div
      style={{
        padding: 20,
        borderRadius: radii.lg,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      className="clickable-border"
      key={project?.handle}
      onClick={() => (window.location.hash = '/p/' + project.handle)}
    >
      {metadata ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre',
            overflow: 'hidden',
          }}
        >
          <div style={{ marginRight: 20 }}>
            <ProjectLogo
              uri={metadata.logoUri}
              name={metadata.name}
              size={80}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                color: colors.text.primary,
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {metadata.name}
            </h2>
            <div
              style={{
                fontWeight: 500,
                color: colors.text.secondary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              @{project.handle}
            </div>

            {metadata.infoUri && (
              <div
                style={{
                  color: colors.text.action.primary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {metadata.infoUri}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {project.handle} <Loading />
        </div>
      )}
    </div>
  )
}
