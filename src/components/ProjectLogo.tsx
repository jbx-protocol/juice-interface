import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'

// Override select project logos.
const IMAGE_URI_OVERRIDES: { [k: number]: string } = {
  1: '/assets/juiceboxdao_logo.webp',
}

export default function ProjectLogo({
  uri,
  name,
  size,
  projectId,
}: {
  uri: string | undefined
  name: string | undefined
  size?: number
  projectId?: number | undefined
}) {
  const [srcLoadError, setSrcLoadError] = useState(false)
  const validImg = uri && !srcLoadError
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)
  const _size = size ?? 80

  const _uri = projectId ? IMAGE_URI_OVERRIDES[projectId] ?? uri : uri

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        height: _size,
        width: _size,
        borderRadius: radii.xl,
        background: validImg ? undefined : colors.background.l1,
      }}
    >
      {validImg ? (
        <img
          style={{
            maxHeight: '100%',
            minWidth: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          src={_uri}
          alt={name + ' logo'}
          onError={() => setSrcLoadError(true)}
          loading="lazy"
        />
      ) : (
        <div
          style={{
            fontSize: '2.5rem',
          }}
        >
          🧃
        </div>
      )}
    </div>
  )
}
