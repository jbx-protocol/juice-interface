import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function TabDescription(props: PropsWithChildren<{}>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        color: colors.text.primary,
        padding: '1rem',
        backgroundColor: colors.background.l1,
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '1rem',
      }}
    >
      <InfoCircleOutlined style={{ marginRight: '1rem' }} />
      <div>{props.children}</div>
    </div>
  )
}
