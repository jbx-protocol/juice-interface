import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import Callout from 'components/Callout'
import { Selection } from 'components/Create/components/Selection'
import { JuiceSwitch } from 'components/JuiceSwitch'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { CreateBadge } from '../../CreateBadge'
import { CreateCollapse } from '../../CreateCollapse'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { useReconfigurationRulesForm } from './hooks'

const ReconfigurationDaysDescription = ({
  days,
  contract,
}: {
  days: number
  contract: string
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Space direction="vertical">
      <Trans>
        A reconfiguration to an upcoming funding cycle must be submitted at
        least {days} days before it starts.
      </Trans>
      <div style={{ color: colors.text.tertiary }}>
        Contract address: {contract}
      </div>
    </Space>
  )
}

export const ReconfigurationRulesPage = () => {
  const { form, initialValues } = useReconfigurationRulesForm()
  const { goToNextPage } = useContext(PageContext)

  const selection = useWatch('selection', form)
  const isNextEnabled = !!selection

  return (
    <Form
      form={form}
      initialValues={initialValues}
      name="reconfigurationRules"
      colon={false}
      layout="vertical"
      onFinish={goToNextPage}
      scrollToFirstError
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Form.Item noStyle name="selection">
            <Selection defocusOnSelect style={{ width: '100%' }}>
              {/* TODO: Support checked on left side */}
              <Selection.Card
                name="threeDay"
                title={
                  <Trans>
                    3-day delay <CreateBadge.Default />
                  </Trans>
                }
                description={
                  <ReconfigurationDaysDescription
                    days={3}
                    // Fix this address
                    contract="0xTODO0xC3890c4Dac5D06C4DAA2eE3Fdc95eC1686A4"
                  />
                }
              />
              <Selection.Card
                name="sevenDay"
                title={t`7-day delay`}
                description={
                  <ReconfigurationDaysDescription
                    days={7}
                    // Fix this address
                    contract="0xTODO0xC3890c4Dac5D06C4DAA2eE3Fdc95eC1686A4"
                  />
                }
              />
              <Selection.Card
                name="custom"
                title={t`Custom strategy`}
                description={<span style={{ color: 'magenta' }}>TODO</span>}
              />
              <Selection.Card
                name="none"
                title={t`No strategy`}
                description={<span style={{ color: 'magenta' }}>TODO</span>}
              />
            </Selection>
          </Form.Item>
        </Space>

        <Callout>
          {/* TODO: Set based on configuration chosen */}
          <Trans>
            This means that you will have to submit changes to your funding AT
            LEAST 3 days before your next funding cycle starts. These changes
            will be visible to your contributors.
          </Trans>
        </Callout>

        <CreateCollapse>
          <CreateCollapse.Panel key={0} header={t`Advanced Rules`}>
            <Form.Item
              name="pausePayments"
              extra={t`When enabled, the payments to the project are paused, and no new tokens will be issued.`}
            >
              <JuiceSwitch label={t`Pause payments`} />
            </Form.Item>
            <Form.Item
              name="allowTerminalConfiguration"
              extra={t`When enabled, the project owner can set the project's payment terminals.`}
            >
              <JuiceSwitch label={t`Allow terminal configuration`} />
            </Form.Item>
          </CreateCollapse.Panel>
        </CreateCollapse>
      </Space>

      <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
    </Form>
  )
}
