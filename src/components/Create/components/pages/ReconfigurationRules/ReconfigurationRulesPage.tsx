import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import { Selection } from 'components/Create/components/Selection'
import { useAvailableReconfigurationStrategies } from 'components/Create/hooks/AvailableReconfigurationStrategies'
import { JuiceSwitch } from 'components/JuiceSwitch'
import {
  HOLD_FEES_EXPLAINATION,
  PREVENT_OVERSPENDING_EXPLAINATION,
  USE_DATASOURCE_FOR_REDEEM_EXPLAINATION,
} from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'
import { readNetwork } from 'constants/networks'
import { useAppSelector } from 'hooks/AppSelector'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { CreateCollapse } from '../../CreateCollapse'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { CustomRuleCard, RuleCard } from './components'
import { useReconfigurationRulesForm } from './hooks'

export const PREVENT_OVERSPENDING_FIELD_VISIBLE = false

export const ReconfigurationRulesPage = () => {
  useSetCreateFurthestPageReached('reconfigurationRules')
  const { form, initialValues } = useReconfigurationRulesForm()
  const {
    nftRewards: { rewardTiers },
  } = useAppSelector(state => state.editingV2Project)

  const { goToNextPage } = useContext(PageContext)

  const selection = useWatch('selection', form)
  const isNextEnabled = !!selection

  const reconfigurationStrategies = useAvailableReconfigurationStrategies(
    readNetwork.name,
  )

  const hasNFTs = rewardTiers?.length

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
          <CreateCollapse.Panel key={0} header={t`Advanced Rules`} hideDivider>
            <Form.Item
              className="pt-8"
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
            <Form.Item
              name="pauseTransfers"
              extra={t`When enabled, project token transfers will be paused. This does not apply to ERC-20 tokens if issued.`}
            >
              <JuiceSwitch label={t`Pause project token transfers`} />
            </Form.Item>
            <Form.Item name="holdFees" extra={HOLD_FEES_EXPLAINATION}>
              <JuiceSwitch label={t`Hold fees`} />
            </Form.Item>
            <Form.Item
              name="useDataSourceForRedeem"
              extra={USE_DATASOURCE_FOR_REDEEM_EXPLAINATION}
            >
              <JuiceSwitch label={t`Use data source for redeem`} />
            </Form.Item>
            {hasNFTs && PREVENT_OVERSPENDING_FIELD_VISIBLE ? (
              <Form.Item
                name="preventOverspending"
                extra={PREVENT_OVERSPENDING_EXPLAINATION}
              >
                <JuiceSwitch label={t`Prevent NFT overspending`} />
              </Form.Item>
            ) : null}
          </CreateCollapse.Panel>
        </CreateCollapse>
      </Space>

      <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
    </Form>
  )
}
