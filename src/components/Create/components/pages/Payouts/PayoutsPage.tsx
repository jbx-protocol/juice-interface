import { FieldBinaryOutlined, PercentageOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { RecallCard } from '../../RecallCard'
import { Selection } from '../../Selection'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { allocationTotalPercentDoNotExceedTotalRule } from '../utils'
import { PayoutsList } from './components/PayoutsList'
import { useAvailablePayoutsSelections, usePayoutsForm } from './hooks'

export const PayoutsPage: React.FC = () => {
  useSetCreateFurthestPageReached('payouts')
  const { goToNextPage } = useContext(PageContext)
  const { form, initialValues } = usePayoutsForm()
  const availableSelections = useAvailablePayoutsSelections()

  const selection = useWatch('selection', form)
  const isNextEnabled = !!selection

  return (
    <Form
      form={form}
      initialValues={initialValues}
      name="fundingTarget"
      colon={false}
      layout="vertical"
      onFinish={goToNextPage}
      scrollToFirstError
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <RecallCard show={['fundingCycles', 'fundingTarget']} />
        <h2>
          <Trans>How would you like to distribute payments?</Trans>
        </h2>
        <Form.Item noStyle name="selection">
          <Selection
            disableInteractivity={availableSelections.size === 1}
            defocusOnSelect
            style={{ width: '100%' }}
          >
            {availableSelections.has('percentages') && (
              <Selection.Card
                name="percentages"
                title={t`Percentages`}
                icon={<PercentageOutlined />}
                description={
                  <Trans>
                    Distribute a percentage of all funds received between the
                    entities nominated in the next step.
                  </Trans>
                }
              />
            )}
            {availableSelections.has('amounts') && (
              <Selection.Card
                name="amounts"
                title={t`Specific Amounts`}
                icon={<FieldBinaryOutlined />}
                description={
                  <Trans>
                    Distribute a specific amount of funds to each entity
                    nominated in the next step.
                  </Trans>
                }
              />
            )}
          </Selection>
        </Form.Item>
        {selection && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <h2>
              <Trans>Who's getting paid?</Trans>
            </h2>
            <p>
              <Trans>
                Add wallet addresses or juicebox projects to receive payouts.
              </Trans>
            </p>
            <Form.Item
              name="payoutsList"
              rules={[allocationTotalPercentDoNotExceedTotalRule()]}
            >
              <PayoutsList payoutsSelection={selection} />
            </Form.Item>
          </Space>
        )}
        <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
      </Space>
    </Form>
  )
}
