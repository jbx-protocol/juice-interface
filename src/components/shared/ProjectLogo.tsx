import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'

export default function ProjectLogo({
  uri,
  name,
  size,
}: {
  uri: string | undefined
  name: string | undefined
  size?: number
}) {
  const [srcLoadError, setSrcLoadError] = useState(false)
  const validImg = uri && !srcLoadError
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)
  const _size = size ?? 80

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: radii.xl,
        background: validImg ? undefined : colors.background.l1,
      }}
    >
      {validImg ? (
        <img
          style={{
            height: _size,
            width: _size,
          }}
          src={uri}
          alt={name + ' logo'}
          onError={() => setSrcLoadError(true)}
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
