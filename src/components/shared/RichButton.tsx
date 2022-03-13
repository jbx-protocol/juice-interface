import { RightOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

export default function RichButton({
  title,
  description,
  onClick,
  disabled,
}: {
  title: JSX.Element | string
  description: JSX.Element | string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  disabled?: boolean
}) {
  const { colors, radii } = useContext(ThemeContext).theme

  const cardStyles: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: radii.md,
    cursor: 'pointer',
    border:
      '1px solid ' +
      (disabled ? colors.stroke.disabled : colors.stroke.action.primary),
    background: colors.background.l0,
  }

  return (
    <div
      className="clickable-border"
      style={cardStyles}
      role="button"
      onClick={e => {
        if (disabled) return
        onClick?.(e)
      }}
    >
      <div style={{ padding: '1rem 0 1rem 1rem' }}>
        <h4
          style={{
            color: disabled ? colors.text.disabled : colors.text.action.primary,
          }}
        >
          {title}
        </h4>
        <p
          style={{
            color: disabled ? colors.text.disabled : colors.text.primary,
            margin: 0,
            fontSize: 12,
          }}
        >
          {description}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
        }}
      >
        <RightOutlined
          style={{
            color: disabled
              ? colors.text.disabled
              : colors.stroke.action.primary,
          }}
        />
      </div>
    </div>
  )
}
