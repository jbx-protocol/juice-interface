import { ThemeContext } from 'contexts/themeContext'
import { ProjectMetadata } from 'models/project-metadata'
import { useContext } from 'react'

import Loading from './Loading'
import ProjectLogo from './ProjectLogo'

export default function ProjectCard({
  handle,
  metadata,
}: {
  handle: string
  metadata: ProjectMetadata
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  return (
    <div
      style={{
        padding: 20,
        borderRadius: radii.lg,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      className="clickable-border"
      key={handle}
      onClick={() => (window.location.hash = '/p/' + handle)}
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
              @{handle}
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
          {handle} <Loading />
        </div>
      )}
    </div>
  )
}
