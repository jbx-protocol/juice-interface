import { CaretDownOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function InputAccessoryButton({
  content,
  onClick,
  withArrow,
  placement,
  disabled,
}: {
  content: string | JSX.Element | undefined
  withArrow?: boolean
  onClick?: VoidFunction
  placement?: 'prefix' | 'suffix'
  disabled?: boolean
}) {
  const { colors, radii } = useContext(ThemeContext).theme

  return content ? (
    <div
      role="button"
      style={{
        cursor: onClick && !disabled ? 'pointer' : 'default',
        color:
          onClick && !disabled
            ? colors.text.action.primary
            : colors.text.primary,
        background:
          onClick && !disabled
            ? colors.background.action.secondary
            : colors.background.l1,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        padding: '1px 6px',
        marginLeft: placement === 'suffix' ? 8 : 0,
        marginRight: placement === 'prefix' ? 8 : 0,
        borderRadius: radii.sm,
      }}
      onClick={onClick}
    >
      {content}
      {withArrow && (
        <CaretDownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
      )}
    </div>
  ) : null
}
