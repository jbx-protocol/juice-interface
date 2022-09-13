import { CaretRightFilled } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { ComponentPropsWithoutRef, CSSProperties, useContext } from 'react'

export default function RichButton({
  heading,
  prefix,
  description,
  disabled,
  icon,
  primaryColor,
  ...props
}: {
  heading: JSX.Element | string
  description: JSX.Element | string
  disabled?: boolean
  prefix?: JSX.Element | string
  icon?: JSX.Element
  primaryColor?: string
} & ComponentPropsWithoutRef<'div'>) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const headingColor = disabled
    ? colors.text.disabled
    : primaryColor ?? colors.text.action.primary

  const subheadingColor = disabled
    ? colors.text.disabled
    : primaryColor ?? colors.text.primary

  const cardStyles: CSSProperties = {
    ...props?.style,
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: radii.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: colors.background.l0,
    padding: '1rem 0 1rem 1rem',
  }

  return (
    <div
      className="clickable-border"
      {...props}
      style={{
        ...cardStyles,
      }}
      role="button"
      onClick={e => {
        if (disabled) return

        props?.onClick?.(e)
      }}
    >
      <div style={{ display: 'flex' }}>
        {prefix ? (
          <h4
            style={{
              color: headingColor,
              marginRight: '1rem',
            }}
          >
            {prefix}
          </h4>
        ) : null}

        <div>
          <h4
            style={{
              color: headingColor,
            }}
          >
            {heading}
          </h4>
          <p
            style={{
              color: subheadingColor,
              margin: 0,
              fontSize: 12,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
          marginRight: '0.5rem',
        }}
      >
        {icon ?? (
          <CaretRightFilled
            style={{
              color: headingColor,
            }}
          />
        )}
      </div>
    </div>
  )
}
