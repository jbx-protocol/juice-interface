import { Modal, ModalProps } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { classNames } from 'utils/classNames'

/**
 * A wrapper around the Ant Design Modal component that adds the correct dark
 * mode class for tailwind.
 *
 */
export const JuiceModal = (props: ModalProps) => {
  const { isDarkMode } = useContext(ThemeContext)
  return (
    <Modal
      {...props}
      className={classNames(props.className, isDarkMode ? 'dark' : undefined)}
    />
  )
}
