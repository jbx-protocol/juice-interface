import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function V2ProjectRiskNotice() {
  const { colors } = useContext(ThemeContext).theme
  return (
    <div style={{ backgroundColor: colors.background.l1, padding: '1rem' }}>
      <ExclamationCircleOutlined /> Potential risks: TODO
    </div>
  )
}
