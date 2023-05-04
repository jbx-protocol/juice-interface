import { t, Trans } from '@lingui/macro'
import { useForm } from 'antd/lib/form/Form'
import { Button, Form } from 'antd'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useSetThemeTx } from 'hooks/v2v3/transactor/SetThemeTx'
import { useContext, useState } from 'react'
import { Rule } from 'antd/lib/form'
import { CustomResolverForm } from './CustomResolverForm'
import { helpPagePath } from 'utils/routes'
import ExternalLink from 'components/ExternalLink'
import { ProjectNftPreview } from './ProjectNftPreview'

export function ProjectNftSettingsPage() {
  const { handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const [themeForm] = useForm()
  const [loadingSetTheme, setLoadingSetTheme] = useState<boolean>()

  const [previewTextColor, setPreviewTextColor] = useState<string>('FF9213')
  const [previewBgColor, setPreviewBgColor] = useState<string>('44190F')
  const [previewAltBgColor, setPreviewAltBgColor] = useState<string>('3A0F0C')

  const setThemeTx = useSetThemeTx()

  function onSetThemeFormSaved() {
    setLoadingSetTheme(true)

    const colors = {
      textColor: String(themeForm.getFieldValue('textColor'))
        .trim()
        .toUpperCase(),
      bgColor: String(themeForm.getFieldValue('bgColor')).trim().toUpperCase(),
      altBgColor: String(themeForm.getFieldValue('altBgColor'))
        .trim()
        .toUpperCase(),
    }

    setThemeTx(colors, {
      onDone: () => setLoadingSetTheme(false),
    })
  }

  function updatePreview() {
    setPreviewTextColor(
      String(themeForm.getFieldValue('textColor')).trim().toUpperCase(),
    )
    setPreviewBgColor(
      String(themeForm.getFieldValue('bgColor')).trim().toUpperCase(),
    )
    setPreviewAltBgColor(
      String(themeForm.getFieldValue('altBgColor')).trim().toUpperCase(),
    )
  }

  const colorInputRules: Rule[] = [
    {
      pattern: new RegExp('^[0-9a-fA-F]{6}$'),
      message: t`Enter a valid color hex code.`,
    },
    { required: true, message: t`Each field is required.` },
  ]

  return (
    <>
      <h3>
        <Trans>Customize theme</Trans>
      </h3>
      <p>
        <Trans>
          Modify the colors of your Juicebox Project NFT. This NFT represents
          ownership over your project.
        </Trans>
      </p>
      <h5>
        <Trans>Preview</Trans>
      </h5>
      <ProjectNftPreview
        previewTextColor={previewTextColor}
        previewBgColor={previewBgColor}
        previewAltBgColor={previewAltBgColor}
        handle={handle}
        projectId={projectId}
      />

      <Form
        form={themeForm}
        layout="vertical"
        onFinish={onSetThemeFormSaved}
        className="mt-2"
      >
        <Form.Item
          name="textColor"
          label={t`Text color`}
          rules={colorInputRules}
        >
          <JuiceInput
            prefix="#"
            placeholder={t`FF9213`}
            className="max-w-[8em]"
          />
        </Form.Item>
        <Form.Item
          name="bgColor"
          label={t`Background color`}
          rules={colorInputRules}
        >
          <JuiceInput
            prefix="#"
            placeholder={t`44190F`}
            className="max-w-[8em]"
          />
        </Form.Item>
        <Form.Item
          name="altBgColor"
          label={t`Background gradient color`}
          rules={colorInputRules}
        >
          <JuiceInput
            prefix="#"
            placeholder={t`3A0F0C`}
            className="max-w-[8em]"
          />
        </Form.Item>

        <div className="flex flex-row gap-2">
          <Button htmlType="submit" loading={loadingSetTheme} type="primary">
            <Trans>Update NFT theme</Trans>
          </Button>
          <Button type="ghost" onClick={updatePreview}>
            <Trans>Update preview</Trans>
          </Button>
        </div>
      </Form>

      <h3 className="mt-6">
        <Trans>Custom metadata resolver contract</Trans>
      </h3>
      <p>
        <Trans>
          Custom metadata resolvers replace the default metadata above. They
          must conform to the{' '}
          <ExternalLink
            href={helpPagePath(`/dev/api/interfaces/ijbtokenuriresolver/`)}
          >
            IJBTokenUriResolver
          </ExternalLink>{' '}
          interface.
        </Trans>
      </p>

      <CustomResolverForm />
    </>
  )
}
