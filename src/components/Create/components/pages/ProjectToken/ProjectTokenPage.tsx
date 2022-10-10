import { FieldBinaryOutlined, PercentageOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import Callout from 'components/Callout'
import { useContext } from 'react'
import { CreateBadge } from '../../CreateBadge'
import { Selection } from '../../Selection'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { CustomTokenSettings } from './components'
import { useProjectTokensForm } from './hooks/ProjectTokenForm'

export const ProjectTokenPage: React.FC = () => {
  const { goToNextPage } = useContext(PageContext)
  const { form, initialValues } = useProjectTokensForm()

  const selection = useWatch('selection', form)
  const isNextEnabled = !!selection

  return (
    <Form
      form={form}
      initialValues={initialValues}
      name="projectToken"
      colon={false}
      layout="vertical"
      onFinish={goToNextPage}
      scrollToFirstError
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Form.Item noStyle name="selection">
          <Selection defocusOnSelect style={{ width: '100%' }}>
            <Selection.Card
              name="default"
              title={
                <Trans>
                  Default Token Settings <CreateBadge.Default />
                </Trans>
              }
              // TODO ICON
              icon={<PercentageOutlined style={{ color: 'magenta' }} />}
              description={
                <Trans>
                  Recommended for new users. <a href="#TODO">View details</a>.
                </Trans>
              }
            />
            <Selection.Card
              name="custom"
              title={t`Custom Token Settings`}
              // TODO ICON
              icon={<FieldBinaryOutlined style={{ color: 'magenta' }} />}
              description={
                <Trans>
                  Set custom rules & parameters for your project tokens.
                </Trans>
              }
            >
              <CustomTokenSettings />
            </Selection.Card>
          </Selection>
        </Form.Item>
        <Callout>
          <Trans>
            Project tokens are not ERC-20 tokens by default. Once you deploy
            your project, you can issue an ERC-20 for your holders to claim.
            This is optional.
          </Trans>
        </Callout>
        <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
      </Space>
    </Form>
  )
}
