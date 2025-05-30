import { Trans, t } from '@lingui/macro'
import { useContext, useEffect } from 'react'

import { SettingOutlined } from '@ant-design/icons'
import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout/Callout'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { trackFathomGoal } from 'lib/fathom'
import { useSetCreateFurthestPageReached } from 'redux/hooks/v2v3/useEditingCreateFurthestPageReached'
import { CreateBadge } from '../../CreateBadge'
import { Icons } from '../../Icons'
import { Selection } from '../../Selection/Selection'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { Wizard } from '../../Wizard/Wizard'
import { CustomTokenSettings } from './components/CustomTokenSettings/CustomTokenSettings'
import { DefaultSettings } from './components/DefaultSettings'
import { useProjectTokensForm } from './hooks/useProjectTokenForm'

export const ProjectTokenPage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
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
      onFinish={() => {
        goToNextPage?.()
        trackFathomGoal(CREATE_FLOW.TOKEN_NEXT_CTA)
      }}
      scrollToFirstError
    >
      <div className="flex flex-col gap-6">
        <Form.Item noStyle name="selection">
          <Selection className="w-full" defocusOnSelect>
            <Selection.Card
              name="default"
              title={
                <div className="flex items-center gap-3">
                  <Trans>None</Trans> <CreateBadge.Default />
                </div>
              }
              icon={<Icons.Tokens />}
              description={
                <Trans>
                  No tokens issued.
                </Trans>
              }
            >
              <DefaultSettings />
            </Selection.Card>
            <Selection.Card
              name="custom"
              title={t`Custom`}
              icon={<SettingOutlined />}
              description={
                <Trans>Set up custom rules for your project's tokens.</Trans>
              }
            >
              <CustomTokenSettings />
            </Selection.Card>
          </Selection>
        </Form.Item>
        <Callout.Info>
          <Trans>
            Your project's tokens are not ERC-20 tokens by default. After you
            create your project, you can create an ERC-20 for your token holders
            to claim. This is optional.
          </Trans>
        </Callout.Info>
      </div>
      <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
    </Form>
  )
}
