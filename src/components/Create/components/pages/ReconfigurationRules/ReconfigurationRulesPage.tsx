import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import { Selection } from 'components/Create/components/Selection'
import { useAvailableReconfigurationStrategies } from 'components/Create/hooks/AvailableReconfigurationStrategies'
import ExternalLink from 'components/ExternalLink'
import { JuiceSwitch } from 'components/JuiceSwitch'
import { HOLD_FEES_EXPLAINATION } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'
import { readNetwork } from 'constants/networks'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { helpPagePath } from 'utils/routes'
import { CreateCollapse } from '../../CreateCollapse'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { CustomRuleCard, RuleCard } from './components'
import { useReconfigurationRulesForm } from './hooks'

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
      <Space className="w-full" direction="vertical" size="large">
        <Space className="w-full" direction="vertical" size="middle">
          <Form.Item noStyle name="selection">
            <Selection className="w-full" allowDeselect={false} defocusOnSelect>
              {reconfigurationStrategies.map(strategy => (
                <RuleCard strategy={strategy} key={strategy.id} />
              ))}
              <CustomRuleCard />
            </Selection>
          </Form.Item>
        </Space>

        {selection === 'none' && (
          <Callout.Warning>
            <Trans>
              Using a reconfiguration strategy is recommended. Projects with no
              strategy will appear risky to contributors.
            </Trans>
          </Callout.Warning>
        )}

        <CreateCollapse>
          <CreateCollapse.Panel key={0} header={t`Funding Rules`} hideDivider>
            <Form.Item
              className="pt-8"
              name="pausePayments"
              extra={t`When enabled, your project can't accept payments.`}
            >
              <JuiceSwitch label={t`Pause payments`} />
            </Form.Item>

            <Form.Item name="holdFees" extra={HOLD_FEES_EXPLAINATION}>
              <JuiceSwitch label={t`Hold fees`} />
            </Form.Item>
          </CreateCollapse.Panel>
          <CreateCollapse.Panel
            key={1}
            header={t`Owner Permissions`}
            hideDivider
          >
            <h3 className="mt-3 mb-5 text-sm font-normal uppercase text-black dark:text-slate-100">
              Configuration rules
            </h3>
            <div className="mb-8">
              <Form.Item
                name="allowTerminalConfiguration"
                extra={
                  <Trans>
                    When enabled, the project owner can change the project's
                    Payment Terminals.{' '}
                    <ExternalLink
                      href={helpPagePath('dev/learn/glossary/payment-terminal')}
                    >
                      Learn more
                    </ExternalLink>
                  </Trans>
                }
              >
                <JuiceSwitch label={t`Allow Payment Terminal configuration`} />
              </Form.Item>
              <Form.Item
                name="allowControllerConfiguration"
                extra={
                  <Trans>
                    When enabled, the project owner can change the project's
                    Controller.{' '}
                    <ExternalLink
                      href={helpPagePath(
                        'dev/api/contracts/or-controllers/jbcontroller',
                      )}
                    >
                      Learn more
                    </ExternalLink>
                  </Trans>
                }
              >
                <JuiceSwitch label={t`Allow Controller configuration`} />
              </Form.Item>
            </div>
            <h3 className="mt-3 mb-5 text-sm font-normal uppercase text-black dark:text-slate-100">
              Migration rules
            </h3>
            <div className="mb-8">
              <Form.Item
                name="allowTerminalMigration"
                extra={
                  <Trans>
                    When enabled, the project owner can migrate the project's
                    existing Payment Terminals to a newer version of the
                    contract.{' '}
                    <ExternalLink
                      href={helpPagePath('dev/learn/glossary/payment-terminal')}
                    >
                      Learn more
                    </ExternalLink>
                  </Trans>
                }
              >
                <JuiceSwitch label={t`Allow Payment Terminal migration`} />
              </Form.Item>
              <Form.Item
                name="allowControllerMigration"
                extra={
                  <Trans>
                    When enabled, the project owner can migrate the project's
                    Controller to a newer version of the contract.{' '}
                    <ExternalLink
                      href={helpPagePath(
                        'dev/api/contracts/or-controllers/jbcontroller',
                      )}
                    >
                      Learn more
                    </ExternalLink>
                  </Trans>
                }
              >
                <JuiceSwitch label={t`Allow Controller migration`} />
              </Form.Item>
            </div>
          </CreateCollapse.Panel>
        </CreateCollapse>
      </Space>

      <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
    </Form>
  )
}
