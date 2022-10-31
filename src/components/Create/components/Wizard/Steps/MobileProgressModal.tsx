import { Trans } from '@lingui/macro'
import { Modal } from 'antd'
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
    <Modal
      className="create-steps-modal"
      width="280px"
      title={
        <>
          <h2>
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
    </Modal>
  )
}
