import { colors } from 'constants/styles/colors'

export default function ProjectLogo({
  uri,
  name,
  size,
}: {
  uri: string | undefined
  name: string | undefined
  size?: number
}) {
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
        borderRadius: 20,
        background: uri ? undefined : '#ffffff10',
      }}
    >
      {uri ? (
        <img
          style={{
            maxHeight: '100%',
            objectFit: 'fill',
            objectPosition: 'center',
          }}
          src={uri}
          alt={name + ' logo'}
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
