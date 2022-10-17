import { QuestionCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Form, Input, Space } from 'antd'
import { useContext } from 'react'
import { RewardsList } from '../../RewardsList'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { useNftRewardsForm } from './hooks'

export const NftRewardsPage = () => {
  const { form, initialValues } = useNftRewardsForm()
  const { goToNextPage } = useContext(PageContext)
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        <Form.Item noStyle name="rewards">
          <RewardsList />
        </Form.Item>
        <Space direction="vertical">
          <Form.Item
            name="collectionName"
            requiredMark="optional"
            label={
              <Space>
                <Trans>Collection Name</Trans>
                <QuestionCircleOutlined />
              </Space>
            }
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="collectionSymbol"
            requiredMark="optional"
            label={
              <Space>
                <Trans>Collection Symbol</Trans>
                <QuestionCircleOutlined />
              </Space>
            }
          >
            <Input />
          </Form.Item>
        </Space>
        <Wizard.Page.ButtonControl />
      </div>
    </Form>
  )
}
