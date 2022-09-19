import {
  CloseCircleOutlined,
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
          <Selection>
            <Selection.Card
              name="specific"
              title={t`Specific Funding Target`}
              icon={<PushpinOutlined />}
              description={
                <Trans>
                  Set a specific amount that you will be able to distribute to
                  nominated wallets each funding cycle.
                </Trans>
              }
            >
              <Form.Item
                name="amount"
                label={t`Set your funding target`}
                extra={
                  <Trans>
                    Note: your project’s settings will not be able to be edited
                    or changed during the first funding cycle.
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
                  All funds raised will be available to distribute to payout
                  addresses. Your project will have no overflow, so token
                  holders will not be able to redeem.
                </Trans>
              }
            />
            <Selection.Card
              name="none"
              title={t`No Funding Target`}
              icon={<CloseCircleOutlined />}
              description={
                <Trans>
                  All funds raised will be considered ‘overflow’ and will be
                  redeemable by token holders at any time.
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
