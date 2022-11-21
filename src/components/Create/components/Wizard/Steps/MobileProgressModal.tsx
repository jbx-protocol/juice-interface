import { Trans } from '@lingui/macro'
import { JuiceModal } from 'components/JuiceModal'
import { MobileStep } from './MobileStep'

export const MobileProgressModal: React.FC<{
  steps: { id: string; title: string; disabled: boolean }[]
  furthestStepIndex: number
  currentStepIndex: number
  open?: boolean
  onStepClicked?: (index: number) => void
  onCancel?: VoidFunction
}> = ({
  steps,
  furthestStepIndex,
  currentStepIndex,
  open,
  onStepClicked,
  onCancel,
}) => {
  return (
    <JuiceModal
      className="create-steps-modal" // ant override
      width="280px"
      title={
        <>
          <h2 className="font-medium text-xl text-black dark:text-grey-200">
            <Trans>Create a project</Trans>
          </h2>
        </>
      }
      footer={null}
      open={open}
      onCancel={onCancel}
    >
      {steps?.map((step, index) => {
        return (
          <MobileStep
            selected={currentStepIndex === index}
            isCompleted={
              index <= furthestStepIndex && index !== currentStepIndex
            }
            key={step.id}
            step={step}
            index={index}
            onClick={onStepClicked}
          />
        )
      })}
    </JuiceModal>
  )
}
