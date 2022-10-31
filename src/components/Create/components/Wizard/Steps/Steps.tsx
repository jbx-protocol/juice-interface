import { Progress, Steps as AntSteps } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { useModal } from 'hooks/Modal'
import { useCallback, useContext } from 'react'
import { useSteps } from '../hooks/Steps'
import { MobileProgressModal } from './MobileProgressModal'

export const Steps = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
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
      <>
        <div
          style={{ userSelect: 'none', cursor: 'pointer' }}
          onClick={progressModal.open}
        >
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
