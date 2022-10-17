import { Steps as AntSteps } from 'antd'
import { useSteps } from './hooks/Steps'

export const Steps = () => {
  const { steps, current, onStepClicked } = useSteps()

  return (
    <div style={{ padding: '2.5rem 5rem' }}>
      <AntSteps
        current={current.index}
        progressDot
        size="small"
        onChange={onStepClicked}
      >
        {steps?.map(({ id, title }) => (
          <AntSteps.Step key={id} title={title} />
        )) ?? null}
      </AntSteps>
    </div>
  )
}
