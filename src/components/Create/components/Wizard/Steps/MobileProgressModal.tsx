import { Trans } from '@lingui/macro'
import { Modal } from 'antd'
import { useRouter } from 'next/router'
import { MobileStep } from './MobileStep'

export const MobileProgressModal: React.FC<
  React.PropsWithChildren<{
    steps: { id: string; title: string; disabled: boolean }[]
    furthestStepIndex: number
    currentStepIndex: number
    open?: boolean
    onStepClicked?: (index: number) => void
    onCancel?: VoidFunction
  }>
> = ({
  steps,
  furthestStepIndex,
  currentStepIndex,
  open,
  onStepClicked,
  onCancel,
}) => {
  const isMigration = useRouter().query.migration === 'true'
  return (
    <Modal
      className="create-steps-modal" // ant override
      width="280px"
      title={
        <>
          <h2 className="text-xl font-medium text-black dark:text-grey-200">
            {!isMigration ? (
              <Trans>Create a project</Trans>
            ) : (
              <Trans>Re-launch a project</Trans>
            )}
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
