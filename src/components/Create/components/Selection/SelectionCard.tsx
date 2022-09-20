import { Col, Divider, Row } from 'antd'
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

  const borderColor = isSelected
    ? colors.stroke.action.primary
    : colors.stroke.tertiary

  // TODO: These colors are not final and we need more work related to defocusing
  const backgroundColor = useMemo(() => {
    if (isDefocused) return colors.background.disabled
    return colors.background.l2
  }, [colors.background.disabled, colors.background.l2, isDefocused])

  return (
    <div
      style={{
        border: 'solid 1px',
        borderRadius: 1,
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
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  name,
  title,
  icon,
  description,
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

  return (
    <Container isSelected={isSelected} isDefocused={defocused}>
      <div
        className={!isSelected ? 'clickable-border' : undefined}
        role="button"
        style={{
          padding: '1.75rem 0',
          userSelect: 'none',
          cursor: 'pointer',
        }}
        onClick={onClick}
      >
        <div style={{ padding: '0 1rem' }}>
          <Row>
            <Col span={3}>{icon && <RadialBackgroundIcon icon={icon} />}</Col>
            <Col span={19}>{<h2>{title}</h2>}</Col>
            <Col offset={1} span={1}>
              <CheckedCircle checked={isSelected} />
            </Col>
          </Row>
          {description && (
            <Row>
              <Col offset={3} span={18}>
                {description}
              </Col>
            </Row>
          )}
        </div>
      </div>
      {isSelected && children && (
        <div style={{ paddingBottom: '1.75rem' }}>
          <Divider style={{ marginTop: 0, marginBottom: '2rem' }} />
          <div style={{ padding: '0 1rem' }}>
            <Row>
              <Col offset={3} span={18}>
                {children}
              </Col>
            </Row>
          </div>
        </div>
      )}
    </Container>
  )
}
