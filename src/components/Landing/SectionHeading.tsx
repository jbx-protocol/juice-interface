import useMobile from 'hooks/Mobile'
import { CSSProperties } from 'react'

export const SectionHeading: React.FC<{ style?: CSSProperties }> = ({
  children,
  style,
}) => {
  const isMobile = useMobile()

  return (
    <h2
      style={{
        fontSize: isMobile ? '1.8rem' : '2.5rem',
        textAlign: 'center',
        fontWeight: 600,
        marginBottom: '0.8rem',
        ...style,
      }}
    >
      {children}
    </h2>
  )
}
