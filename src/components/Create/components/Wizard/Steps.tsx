import { Steps as AntSteps } from 'antd'
import { useCallback } from 'react'
import { useSteps } from './hooks/Steps'

export const Steps = () => {
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

  return (
    <div style={{ padding: '2.5rem 0', width: '840px' }}>
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
