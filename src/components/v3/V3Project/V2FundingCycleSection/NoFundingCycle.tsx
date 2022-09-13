import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import { CardSection } from 'components/CardSection'
import SectionHeader from 'components/SectionHeader'

export default function NoFundingCycle() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <SectionHeader
        text={<Trans>Funding cycle</Trans>}
        tip={
          <Trans>
            A project's lifetime is defined in funding cycles. If a funding
            target is set, the project can withdraw no more than the target for
            the duration of the cycle.
          </Trans>
        }
        style={{
          marginBottom: 10,
        }}
      />
      <CardSection>
        <Trans>No active funding cycle.</Trans>
      </CardSection>
    </Space>
  )
}
