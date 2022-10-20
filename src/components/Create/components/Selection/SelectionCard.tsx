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

  const borderColor = isSelected
    ? colors.stroke.action.primary
    : colors.background.l2
  const backgroundColor = useMemo(() => {
    if (isDarkMode) {
      if (isSelected) {
        return colors.background.l1
      }
      if (isDefocused) {
        return colors.background.l0
      }
    }

    if (isDefocused) {
      return styleColors.lightColors.juiceLightest
    }
  }, [
    colors.background.l0,
    colors.background.l1,
    isDarkMode,
    isDefocused,
    isSelected,
  ])

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
              //TODO: This is probably not the best way to handle pushing content, could do with some help here
              alignItems: isSelected ? 'baseline' : 'center',
              gap: '1rem',
            }}
          >
            {checkPosition === 'left' && <CheckedCircle checked={isSelected} />}
            <div>
              {icon && (
                <RadialBackgroundIcon isDefocused={defocused} icon={icon} />
              )}
            </div>
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <div
                className="select-card-header"
                style={{ color: titleColor, margin: 0 }}
              >
                {title}
              </div>
              {isSelected && description && <div>{description}</div>}
            </div>
            {checkPosition === 'right' && (
              <CheckedCircle checked={isSelected} />
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
