import { t, Trans } from '@lingui/macro'
import { useForm } from 'antd/lib/form/Form'
import { Button, Form } from 'antd'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useSetThemeTx } from 'hooks/v2v3/transactor/SetThemeTx'
import { useContext, useState } from 'react'

export function OwnerNftSettingsPage() {
  const { handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const [themeForm] = useForm()
  const [loadingSetTheme, setLoadingSetTheme] = useState<boolean>()

  const setThemeTx = useSetThemeTx()

  function onSetThemeFormSaved() {
    setLoadingSetTheme(true)

    const textColor = String(themeForm.getFieldValue('textColor'))
      .toUpperCase()
      .trim()
    const bgColor = String(themeForm.getFieldValue('bgColor'))
      .toUpperCase()
      .trim()
    const altBgColor = String(themeForm.getFieldValue('altBgColor'))
      .toUpperCase()
      .trim()

    setThemeTx(
      { textColor, bgColor, altBgColor },
      {
        onDone: () => setLoadingSetTheme(false),
      },
    )
  }

  return (
    <>
      <h3>Preview</h3>
      <p>{handle}</p>
      <p>{projectId}</p>

      <Form form={themeForm} onFinish={onSetThemeFormSaved}>
        <Form.Item name="textColor" label={t`Text color`}>
          <JuiceInput placeholder={t`76FFAA`} />
        </Form.Item>
        <Form.Item name="bgColor" label={t`Background color`}>
          <JuiceInput placeholder={t`76FFAA`} />
        </Form.Item>
        <Form.Item name="altBgColor" label={t`Background gradient color`}>
          <JuiceInput placeholder={t`76FFAA`} />
        </Form.Item>

        <Button htmlType="submit" loading={loadingSetTheme} type="primary">
          <Trans>Set owner NFT theme</Trans>
        </Button>
      </Form>
    </>
  )
}
