import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import { CardSection } from 'components/CardSection'
import SectionHeader from 'components/SectionHeader'

export default function NoFundingCycle() {
  return (
    <Space direction="vertical" className="w-full">
      <SectionHeader
        className="mb-2"
        text={<Trans>Funding cycle</Trans>}
        tip={
          <Trans>
            A project's lifetime is defined in funding cycles. If a funding
            target is set, the project can withdraw no more than the target for
            the duration of the cycle.
          </Trans>
        }
      />
      <CardSection>
        <Trans>No active funding cycle.</Trans>
      </CardSection>
    </Space>
  )
}
