import { Drawer, DrawerProps } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { classNames } from 'utils/classNames'

/**
 * A wrapper around the Ant Design Drawer component that adds the correct dark
 * mode class for tailwind.
 *
 */
export const JuiceDrawer = (props: DrawerProps) => {
  const { isDarkMode } = useContext(ThemeContext)
  return (
    <Drawer
      {...props}
      className={classNames(props.className, isDarkMode ? 'dark' : undefined)}
    />
  )
}
