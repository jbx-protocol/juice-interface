import { Tooltip, TooltipProps } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export const JuiceTooltip = (props: TooltipProps) => {
  const { isDarkMode } = useContext(ThemeContext)
  return (
    <span className={isDarkMode ? 'dark' : ''}>
      <Tooltip {...props} />
    </span>
  )
}
