import { Steps as AntSteps, Progress } from 'antd'
import useMobile from 'hooks/useMobile'
import { useModal } from 'hooks/useModal'
import { useCallback } from 'react'
import { useSteps } from '../hooks/useSteps'
import { MobileProgressModal } from './MobileProgressModal'

export const Steps = () => {
  const isMobile = useMobile()
  const { steps, current, furthestStepReached, onStepClicked } = useSteps()
  const progressModal = useModal()

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
            className="min-w-0"
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
      <>
        <div
          className="cursor-pointer select-none"
          onClick={progressModal.open}
        >
          <Progress
            strokeColor={'#5777EB'} // bluebs-500
            width={80}
            format={() => (
              <div className="text-black dark:text-grey-200">
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
        </div>
        <MobileProgressModal
          steps={steps ?? []}
          currentStepIndex={current.index ?? -1}
          furthestStepIndex={furthestStepReached.index}
          open={progressModal.visible}
          onStepClicked={onStepClicked}
          onCancel={progressModal.close}
        />
      </>
    )
  }

  return (
    <div className="max-w-4xl">
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
