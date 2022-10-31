import { CheckCircleFilled } from '@ant-design/icons'
import * as styleColors from 'constants/styles/colors'
import { ThemeContext } from 'contexts/themeContext'
import { useCallback, useContext, useMemo } from 'react'

export const MobileStep = ({
  step,
  index,
  selected,
  isCompleted,
  className,
  onClick,
}: {
  step: { id: string; title: string; disabled: boolean }
  index: number
  selected: boolean
  isCompleted: boolean
  className?: string
  onClick?: (index: number) => void
}) => {
  const {
    theme: { colors },
    isDarkMode,
  } = useContext(ThemeContext)

  const color = useMemo(() => {
    if (step.disabled) {
      return isDarkMode
        ? colors.background.l2
        : styleColors.lightColors.warmGray400
    }
  }, [colors.background.l2, isDarkMode, step.disabled])

  const cursor = useMemo(() => {
    if (selected) return undefined
    if (step.disabled) return 'not-allowed'
    return 'pointer'
  }, [selected, step.disabled])

  const handleOnClick = useCallback(() => {
    if (step.disabled) return
    onClick?.(index)
  }, [index, onClick, step.disabled])

  return (
    <div
      className={className}
      style={{
        lineHeight: '20px',
        backgroundColor: selected
          ? styleColors.lightColors.warmGray200
          : undefined,
        color,
        fontSize: '1rem',
        fontWeight: selected ? 500 : 400,
        userSelect: 'none',
        cursor,
      }}
      onClick={handleOnClick}
    >
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          alignItems: 'center',
          padding: '1.125rem 1.5rem',
        }}
      >
        <span>
          {index + 1}. {step.title}
        </span>
        {isCompleted && (
          <CheckCircleFilled
            style={{ color: colors.background.action.primary }}
          />
        )}
      </div>
    </div>
  )
}
