import { Divider } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { ReactNode, useCallback, useContext, useMemo } from 'react'
import { CheckedCircle, RadialBackgroundIcon } from './components'
import { SelectionContext } from './Selection'

// TODO: These colors are not final and we need more work related to defocusing

const Container: React.FC<{ isSelected: boolean; isDefocused: boolean }> = ({
  isDefocused,
  isSelected,
  children,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const borderColor = isSelected ? colors.stroke.action.primary : undefined
  // TODO: These colors are not final and we need more work related to defocusing
  const backgroundColor = useMemo(() => {
    if (isDefocused) return colors.background.disabled
    return colors.background.l2
  }, [colors.background.disabled, colors.background.l2, isDefocused])

  const className = !isSelected ? 'clickable-border' : 'border'

  return (
    <div
      className={className}
      style={{
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
            <div>{icon && <RadialBackgroundIcon icon={icon} />}</div>
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <h2 style={{ margin: 0 }}>{title}</h2>
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
