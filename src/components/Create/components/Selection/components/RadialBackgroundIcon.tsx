import { ThemeContext } from 'contexts/themeContext'
import { ReactNode, useContext } from 'react'

export const RadialBackgroundIcon = ({ icon }: { icon: ReactNode }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        width: '2rem',
        height: '2rem',
        fontSize: '1.3rem',
        backgroundColor: colors.stroke.tertiary,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {icon}
    </div>
  )
}
