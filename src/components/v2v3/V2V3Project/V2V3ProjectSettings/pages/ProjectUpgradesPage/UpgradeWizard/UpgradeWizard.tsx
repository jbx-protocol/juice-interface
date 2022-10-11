import { Col, Row, Steps } from 'antd'
import { useMemo, useState } from 'react'
import { FundingCycleStep } from './steps/FundingCycleStep'
const { Step } = Steps

const STEPS = [FundingCycleStep]

export function UpgradeWizard() {
  const [currentStep] = useState<number>(0)

  const CurrentStepContent = useMemo(() => STEPS[currentStep], [currentStep])

  return (
    <Row gutter={40}>
      <Col span={8}>
        <Steps direction="vertical" size="small" current={currentStep}>
          <Step title="Launch funding cycle" />
          <Step title="Deploy new token" />
          <Step title="Set up token migration" />
        </Steps>
      </Col>

      <Col span={16}>
        <CurrentStepContent />
      </Col>
    </Row>
  )
}
