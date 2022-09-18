import { PullRequestOutlined, RedoOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import Callout from 'components/Callout'
import { useContext } from 'react'
import { DurationInput } from '../../DurationInput'
import { RecommendedTitle } from '../../RecommendedTitle'
import { Selection } from '../../Selection/Selection'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { inputMustExistRule } from '../utils'
import { FundingCyclesFormProps, useFundingCyclesForm } from './hooks'

const FundingCycleCallout: React.FC = () => {
  const form = Form.useFormInstance<FundingCyclesFormProps>()
  const selection = useWatch('selection', form)

  if (!selection) return null

  switch (selection) {
    case 'automated':
      return (
        <Callout>
          <Space direction="vertical" size="middle">
            <Trans>
              Funding Cycle #1 will start immediately after you deploy your
              project. Once deployed, Funding Cycle #1 cannot be reconfigured.
            </Trans>
            <Trans>
              You can reconfigure your project's next funding cycle (Funding
              Cycle #2) at any time within the bounds of the rules you set.
            </Trans>
          </Space>
        </Callout>
      )
    case 'manual':
      return (
        <Callout>
          <Trans>
            With manual funding cycles selected, the project's owner can start a
            new funding cycle on-demand. This could be a risk flag to some
            contributors.
          </Trans>
        </Callout>
      )
  }
}

// TODO: We need to add some state handling for this function. We might want to
//       consider adding some stuff to handle the local storage state better.
export const FundingCyclesPage = () => {
  const { goToNextPage } = useContext(PageContext)
  const { form, initialValues } = useFundingCyclesForm()

  const selection = useWatch('selection', form)
  const isNextEnabled = !!selection

  return (
    <Form
      form={form}
      initialValues={initialValues}
      name="fundingCycles"
      colon={false}
      layout="vertical"
      onFinish={goToNextPage}
      scrollToFirstError
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space direction="vertical" size="large">
          <Form.Item noStyle name="selection">
            <Selection>
              <Selection.Card
                name="automated"
                title={<RecommendedTitle text={t`Automated Funding Cycles`} />}
                description={t`Set a duration for automatically recurring funding cycles. Funds may only be distributed once per cycle.`}
                icon={<RedoOutlined />}
              >
                <Form.Item
                  name="duration"
                  label={t`Funding cycle duration`}
                  extra={t`Note: your project’s settings will not be able to be edited or changed during the first funding cycle.`}
                  rules={[
                    inputMustExistRule({ label: t`Funding cycle duration` }),
                  ]}
                >
                  <DurationInput style={{ width: '23rem' }} />
                </Form.Item>
              </Selection.Card>
              <Selection.Card
                name="manual"
                title={t`Manual Funding Cycles`}
                description={t`The project’s owner can start a new funding cycle on demand without a set duration.`}
                icon={<PullRequestOutlined />}
              />
            </Selection>
          </Form.Item>
        </Space>
        <FundingCycleCallout />
        <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
      </Space>
    </Form>
  )
}
