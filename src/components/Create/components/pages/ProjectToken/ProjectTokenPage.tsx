import { SettingOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import { useContext, useEffect } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { CreateBadge } from '../../CreateBadge'
import { Icons } from '../../Icons'
import { Selection } from '../../Selection'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { CustomTokenSettings, DefaultSettings } from './components'
import { useProjectTokensForm } from './hooks/ProjectTokenForm'

export const ProjectTokenPage: React.FC = () => {
  useSetCreateFurthestPageReached('projectToken')
  const { goToNextPage, lockPageProgress, unlockPageProgress } =
    useContext(PageContext)
  const { form, initialValues } = useProjectTokensForm()

  const selection = useWatch('selection', form)
  const isNextEnabled = !!selection

  // A bit of a workaround to soft lock the page when the user edits data.
  useEffect(() => {
    if (!selection) {
      lockPageProgress?.()
      return
    }
    if (selection === 'custom') {
      try {
        form.validateFields().catch(e => {
          lockPageProgress?.()
          throw e
        })
      } catch (e) {
        return
      }
    }
    unlockPageProgress?.()
  }, [form, lockPageProgress, selection, unlockPageProgress])

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
      <Space className="w-full" direction="vertical" size="large">
        <Form.Item noStyle name="selection">
          <Selection className="w-full" defocusOnSelect>
            <Selection.Card
              name="default"
              title={
                <span>
                  <Trans> Default Token Settings</Trans> <CreateBadge.Default />
                </span>
              }
              icon={<Icons.Tokens />}
              description={<DefaultSettings />}
            />
            <Selection.Card
              name="custom"
              title={t`Custom Token Settings`}
              icon={<SettingOutlined />}
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
        <Callout.Info>
          <Trans>
            Project tokens are not ERC-20 tokens by default. Once you deploy
            your project, you can issue an ERC-20 for your holders to claim.
            This is optional.
          </Trans>
        </Callout.Info>
      </Space>
      <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
    </Form>
  )
}
