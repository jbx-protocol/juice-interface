import { Progress, Steps as AntSteps } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { useCallback, useContext } from 'react'
import { useSteps } from './hooks/Steps'

export const Steps = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const isMobile = useMobile()
  const { steps, current, furthestStepReached, onStepClicked } = useSteps()

  const renderSteps = useCallback(
    (steps: { id: string; title: string; disabled: boolean }[]) => {
      const getStatus = (index: number) => {
        if (index <= furthestStepReached.index) {
          if (index < (current.index ?? -1)) {
            return 'finish'
          }
          return 'process'
        }
        return 'wait'
      }

      return steps.map((step, index) => {
        return (
          <AntSteps.Step
            className="create-steps-item"
            key={step.title}
            title={step.title}
            disabled={step.disabled}
            status={getStatus(index)}
          />
        )
      })
    },
    [current.index, furthestStepReached.index],
  )

  if (isMobile) {
    return (
      <Progress
        strokeColor={colors.background.action.primary}
        width={80}
        format={() => (
          <div style={{ color: colors.text.primary }}>
            {current.index !== undefined ? current.index + 1 : '??'}/
            {steps?.length ?? '??'}
          </div>
        )}
        percent={
          ((current.index !== undefined ? current.index + 1 : 0) /
            (steps?.length ?? 1)) *
          100
        }
        type="circle"
      />
    )
  }

  return (
    <div style={{ maxWidth: '840px' }}>
      <AntSteps
        current={current.index}
        progressDot
        size="small"
        onChange={onStepClicked}
      >
        {!!steps?.length && renderSteps(steps)}
      </AntSteps>
    </div>
  )
}
