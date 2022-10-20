import { WarningOutlined } from '@ant-design/icons'
import Callout from 'components/Callout'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export const WarningCallout: React.FC = ({ children }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <Callout
      // TODO: These colors are not final and we need more work
      style={{
        backgroundColor: colors.background.warn,
        color: colors.text.warn,
        border: '1px solid',
        borderColor: colors.stroke.warn,
      }}
      iconComponent={
        <WarningOutlined
          style={{ fontSize: '1.5rem', color: colors.icon.warn }}
        />
      }
    >
      {children}
    </Callout>
  )
}
