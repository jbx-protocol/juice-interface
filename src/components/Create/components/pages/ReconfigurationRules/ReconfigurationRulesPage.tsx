import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { Selection } from 'components/Create/components/Selection'
import { JuiceSwitch } from 'components/JuiceSwitch'
import { readNetwork } from 'constants/networks'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { CreateCallout } from '../../CreateCallout'
import { CreateCollapse } from '../../CreateCollapse'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { CustomRuleCard, RuleCard } from './components'
import {
  useAvailableReconfigurationStrategies,
  useReconfigurationRulesForm,
} from './hooks'

export const ReconfigurationRulesPage = () => {
  useSetCreateFurthestPageReached('reconfigurationRules')
  const { form, initialValues } = useReconfigurationRulesForm()
  const { goToNextPage } = useContext(PageContext)

  const selection = useWatch('selection', form)
  const isNextEnabled = !!selection

  const reconfigurationStrategies = useAvailableReconfigurationStrategies(
    readNetwork.name,
  )

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
            <Selection
              allowDeselect={false}
              defocusOnSelect
              style={{ width: '100%' }}
            >
              {reconfigurationStrategies.map(strategy => (
                <RuleCard strategy={strategy} key={strategy.id} />
              ))}
              <CustomRuleCard />
            </Selection>
          </Form.Item>
        </Space>

        {selection === 'none' && (
          <CreateCallout.Warning>
            <Trans>
              Using a reconfiguration strategy is recommended. Projects with no
              strategy will appear risky to contributors.
            </Trans>
          </CreateCallout.Warning>
        )}

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
