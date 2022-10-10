import { ThemeContext } from 'contexts/themeContext'
import { ReactNode, useContext } from 'react'

export const RadialBackgroundIcon = ({ icon }: { icon: ReactNode }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        width: '2.625rem',
        height: '2.625rem',
        minWidth: '2.625rem',
        fontSize: '1.3rem',
        backgroundColor: colors.background.l1,
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
