import { Divider } from 'antd'
import * as styleColors from 'constants/styles/colors'
import { ThemeContext } from 'contexts/themeContext'
import { ReactNode, useCallback, useContext, useMemo } from 'react'
import { CheckedCircle, RadialBackgroundIcon } from './components'
import { SelectionContext } from './Selection'

const Container: React.FC<{ isSelected: boolean; isDefocused: boolean }> = ({
  isDefocused,
  isSelected,
  children,
}) => {
  const {
    isDarkMode,
    theme: { colors },
  } = useContext(ThemeContext)

  const borderColor = useMemo(() => {
    if (isSelected) return colors.stroke.action.primary
    if (isDefocused) {
      return isDarkMode
        ? styleColors.darkColors.darkGray500
        : styleColors.lightColors.warmGray200
    }
    return isDarkMode
      ? styleColors.darkColors.darkGray300
      : styleColors.lightColors.warmGray300
  }, [colors.stroke.action.primary, isDarkMode, isDefocused, isSelected])

  const backgroundColor = useMemo(() => {
    if (isDefocused) {
      return isDarkMode
        ? styleColors.darkColors.darkGray800
        : styleColors.lightColors.juiceLightest
    }
    return isDarkMode ? styleColors.darkColors.darkGray600 : undefined
  }, [isDarkMode, isDefocused])

  const className = !isSelected ? 'clickable-border' : 'border'

  return (
    <div
      className={className}
      style={{
        borderRadius: '1px',
        borderColor,
        backgroundColor,
      }}
    >
      {children}
    </div>
  )
}

export interface SelectionCardProps {
  name: string
  title: ReactNode
  icon?: ReactNode
  titleBadge?: ReactNode
  description?: ReactNode
  isSelected?: boolean
  checkPosition?: 'left' | 'right'
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  name,
  title,
  icon,
  description,
  checkPosition = 'right',
  children,
}) => {
  const {
    isDarkMode,
    theme: { colors },
  } = useContext(ThemeContext)
  const { selection, defocusOnSelect, setSelection } =
    useContext(SelectionContext)
  const isSelected = selection === name

  const onClick = useCallback(() => {
    if (isSelected) {
      setSelection?.(undefined)
      return
    }
    setSelection?.(name)
  }, [isSelected, name, setSelection])

  const defocused = !!defocusOnSelect && !!selection && !isSelected

  const childGap = 42 + 32

  /**
   * Undefined means default color.
   */
  const titleColor = useMemo(() => {
    if (isDarkMode && defocused) {
      return colors.background.l2
    }

    if (defocused) {
      return styleColors.lightColors.gray400
    }
  }, [colors.background.l2, defocused, isDarkMode])

  return (
    <Container isSelected={isSelected} isDefocused={defocused}>
      <div
        role="button"
        style={{
          padding: '1.5rem 0',
          userSelect: 'none',
          cursor: 'pointer',
        }}
        onClick={onClick}
      >
        <div style={{ padding: '0 1rem' }}>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            {checkPosition === 'left' && (
              <CheckedCircle checked={isSelected} defocused={defocused} />
            )}
            <div>
              {icon && (
                <RadialBackgroundIcon isDefocused={defocused} icon={icon} />
              )}
            </div>
            <div
              style={{
                flex: '1 2',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <div
                className="select-card-header"
                style={{ color: titleColor, margin: 0, marginTop: '0.25rem' }}
              >
                {title}
              </div>
              {isSelected && description && <div>{description}</div>}
            </div>
            {checkPosition === 'right' && (
              <CheckedCircle checked={isSelected} defocused={defocused} />
            )}
          </div>
        </div>
      </div>
      {isSelected && children && (
        <div style={{ paddingBottom: '1.75rem' }}>
          <Divider style={{ marginTop: 0, marginBottom: '2rem' }} />
          <div style={{ padding: `0 ${childGap}px` }}>{children}</div>
        </div>
      )}
    </Container>
  )
}
