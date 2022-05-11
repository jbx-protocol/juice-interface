import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function ProjectLogo({
  uri,
  name,
  size,
}: {
  uri: string | undefined
  name: string | undefined
  size?: number
}) {
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
        height: _size,
        width: _size,
        borderRadius: radii.xl,
        background: uri ? undefined : colors.background.l1,
      }}
    >
      {uri ? (
        <div
          style={{
            height: '100%',
            width: '100%',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundImage: `url(${uri})`,
            backgroundColor: '#fbf9f6',
          }}
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
