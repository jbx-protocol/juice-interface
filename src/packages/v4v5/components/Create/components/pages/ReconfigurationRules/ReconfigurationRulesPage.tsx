import {
  CONTROLLER_CONFIG_EXPLANATION,
  HOLD_FEES_EXPLANATION,
  PAUSE_PAYMENTS_EXPLANATION,
  RECONFIG_RULES_WARN,
  TERMINAL_CONFIG_EXPLANATION,
  TERMINAL_MIGRATION_EXPLANATION
} from 'components/strings'
import { Trans, t } from '@lingui/macro'

import { CREATE_FLOW } from 'constants/fathomEvents'
import { Callout } from 'components/Callout/Callout'
import { CreateCollapse } from '../../CreateCollapse/CreateCollapse'
import { CustomRuleCard } from './components/CustomRuleCard'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { Form } from 'antd'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { RuleCard } from './components/RuleCard'
import { Selection } from 'packages/v2v3/components/Create/components/Selection/Selection'
import { Wizard } from '../../Wizard/Wizard'
import { featureFlagEnabled } from 'utils/featureFlags'
import { getAvailableApprovalStrategies } from 'packages/v4v5/utils/approvalHooks'
import { trackFathomGoal } from 'lib/fathom'
import { useContext } from 'react'
import { useReconfigurationRulesForm } from './hooks/useReconfigurationRulesForm'
import { useSetCreateFurthestPageReached } from 'redux/hooks/v2v3/useEditingCreateFurthestPageReached'
import { useWatch } from 'antd/lib/form/Form'

export const ReconfigurationRulesPage = () => {
  useSetCreateFurthestPageReached('reconfigurationRules')
  const { form, initialValues } = useReconfigurationRulesForm()

  const { goToNextPage } = useContext(PageContext)

  const selection = useWatch('selection', form)
  const isNextEnabled = !!selection

  const reconfigurationStrategies = getAvailableApprovalStrategies()

  return (
    <Form
      form={form}
      initialValues={initialValues}
      name="reconfigurationRules"
      colon={false}
      layout="vertical"
      onFinish={() => {
        goToNextPage?.()
        trackFathomGoal(CREATE_FLOW.RULES_NEXT_CTA)
      }}
      scrollToFirstError
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <Form.Item noStyle name="selection">
            <Selection className="w-full" allowDeselect={false} defocusOnSelect>
              {reconfigurationStrategies.map(strategy => (
                <RuleCard strategy={strategy} key={strategy.id} />
              ))}
              <CustomRuleCard />
            </Selection>
          </Form.Item>
        </div>

        {selection === 'none' && (
          <Callout.Warning>{RECONFIG_RULES_WARN}</Callout.Warning>
        )}

        <CreateCollapse>
          <CreateCollapse.Panel key={0} header={t`Other rules`} hideDivider>
            <Form.Item
              className="pt-8"
              name="pausePayments"
              extra={PAUSE_PAYMENTS_EXPLANATION}
            >
              <JuiceSwitch label={t`Pause payments to this project`} />
            </Form.Item>

            <Form.Item name="holdFees" extra={HOLD_FEES_EXPLANATION}>
              <JuiceSwitch label={t`Hold fees`} />
            </Form.Item>

            <Form.Item
              name="projectRequiredOFACCheck"
              extra={t`Disallow payments from users who appear on OFAC’s Specially Designated Nationals (SDN) list. Note: payments are still possible on other websites (for example, Etherscan).`}
            >
              <JuiceSwitch label={t`OFAC Sanctions screening`} />
            </Form.Item>
          </CreateCollapse.Panel>
          <CreateCollapse.Panel
            key={1}
            header={t`Contract permissions`}
            hideDivider
          >
            <h3 className="mt-3 mb-5 text-sm font-normal uppercase text-black dark:text-slate-100">
              <Trans>Configuration rules</Trans>
            </h3>
            <div className="mb-8">
              <Form.Item
                name="allowTerminalConfiguration"
                extra={TERMINAL_CONFIG_EXPLANATION}
              >
                <JuiceSwitch label={t`Allow Payment Terminal configuration`} />
              </Form.Item>
              <Form.Item
                name="allowControllerConfiguration"
                extra={CONTROLLER_CONFIG_EXPLANATION}
              >
                <JuiceSwitch label={t`Allow Controller configuration`} />
              </Form.Item>
            </div>
            <h3 className="mt-3 mb-5 text-sm font-normal uppercase text-black dark:text-slate-100">
              <Trans>Migration rules</Trans>
            </h3>
            <div className="mb-8">
              <Form.Item
                name="allowTerminalMigration"
                extra={TERMINAL_MIGRATION_EXPLANATION}
              >
                <JuiceSwitch label={t`Allow Payment Terminal migration`} />
              </Form.Item>
            </div>
          </CreateCollapse.Panel>
        </CreateCollapse>
      </div>

      <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
    </Form>
  )
}
