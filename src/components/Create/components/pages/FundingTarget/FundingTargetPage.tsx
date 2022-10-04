import {
  InfoCircleOutlined,
  PushpinOutlined,
  RetweetOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { useContext } from 'react'
import { CurrencySelectInput } from '../../CurrencySelectInput'
import { RecallCard } from '../../RecallCard'
import { Selection } from '../../Selection'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { useFundingTargetForm } from './hooks'

export const FundingTargetPage: React.FC = () => {
  const { goToNextPage } = useContext(PageContext)
  const { form, initialValues } = useFundingTargetForm()

  const selection = useWatch('targetSelection', form)
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
        <RecallCard show={['fundingCycles']} />
        <Form.Item noStyle name="targetSelection">
          <Selection defocusOnSelect style={{ width: '100%' }}>
            <Selection.Card
              name="specific"
              title={t`Specific Funding Target`}
              icon={<PushpinOutlined />}
              description={
                <Trans>
                  Set a specific amount to distribute to nominated addresses
                  each funding cycle.
                </Trans>
              }
            >
              <Form.Item
                name="amount"
                label={t`Set your funding target`}
                extra={
                  <Trans>
                    <InfoCircleOutlined /> your project’s settings will not be
                    able to be edited or changed during the first funding cycle.
                  </Trans>
                }
              >
                <CurrencySelectInput />
              </Form.Item>
            </Selection.Card>
            <Selection.Card
              name="infinite"
              title={t`Infinite Funding Target`}
              icon={<RetweetOutlined />}
              description={
                <Trans>
                  Your project will withhold all funds raised. Funds can be
                  distributed to payout addresses you set, and the project owner
                  will receive any unallocated funds. Your project will have no
                  overflow, so token holders can't redeem their tokens for ETH.
                </Trans>
              }
            />
          </Selection>
        </Form.Item>
        <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
      </Space>
    </Form>
  )
}
