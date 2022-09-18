import { Col, Divider, Row } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { ReactNode, useCallback, useContext } from 'react'
import { CheckedCircle, RadialBackgroundIcon } from './components'
import { SelectionContext } from './Selection'

const Border: React.FC<{ isSelected: boolean }> = ({
  isSelected,
  children,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const borderColor = isSelected
    ? colors.stroke.action.primary
    : colors.stroke.tertiary

  return (
    <div
      style={{
        border: 'solid 1px',
        borderColor,
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
  description?: string
  isSelected?: boolean
  onSelected?: () => void
  onChange?: (selected: boolean) => void
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  name,
  title,
  icon,
  description,
  children,
  onSelected,
  onChange,
}) => {
  const { selection, setSelection } = useContext(SelectionContext)
  const isSelected = selection === name

  const onClick = useCallback(() => {
    if (isSelected) {
      setSelection?.(undefined)
      onChange?.(false)
      return
    }
    setSelection?.(name)
    onChange?.(true)
    onSelected?.()
  }, [isSelected, name, onChange, onSelected, setSelection])

  return (
    <Border isSelected={isSelected}>
      <div
        style={{ padding: '1.75rem 0', userSelect: 'none' }}
        onClick={onClick}
      >
        <div style={{ padding: '0 1rem' }}>
          <Row>
            <Col span={2}>{icon && <RadialBackgroundIcon icon={icon} />}</Col>
            <Col span={20}>{<h2>{title}</h2>}</Col>
            <Col offset={1} span={1}>
              <CheckedCircle checked={isSelected} />
            </Col>
          </Row>
          {description && (
            <Row>
              <Col offset={2} span={19}>
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
              <Col offset={2} span={19}>
                {children}
              </Col>
            </Row>
          </div>
        </div>
      )}
    </Border>
  )
}
