import { t, Trans } from '@lingui/macro'
import { useForm } from 'antd/lib/form/Form'
import { Button, Form } from 'antd'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useSetThemeTx } from 'hooks/v2v3/transactor/SetThemeTx'
import { CSSProperties, useContext, useState } from 'react'
import styles from './Capsules.module.css'
import { Rule } from 'antd/lib/form'
import { CustomResolverForm } from './CustomResolverForm'
import { helpPagePath } from 'utils/routes'
import ExternalLink from 'components/ExternalLink'

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

  const textStyle: CSSProperties = {
    fill: '#' + previewTextColor,
    whiteSpace: 'pre',
    fontSize: '16px',
    fontWeight: 500,
    fontFamily: '"Capsules-500", monospace',
  }

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="289"
        height="150"
        viewBox="0 0 289 150"
        className={styles as unknown as string}
      >
        <g clipPath="url(#clip0)">
          <path d="M289 0H0V150H289V0Z" fill="url(#paint0)" />
          <rect width="289" height="22" fill={'#' + previewTextColor} />
          <g id="head" filter="url(#filter2)">
            <text
              x="16"
              y="16"
              style={{ ...textStyle, fill: '#' + previewBgColor }}
            >
              {handle ? '@' + handle : 'Project ' + projectId}
            </text>
            <text
              x="259.25"
              y="16"
              style={{ ...textStyle, fill: '#' + previewBgColor }}
            >
              
            </text>
          </g>
          <g filter="url(#filter1)">
            <text x="0" y="48" style={textStyle}>
              {'  '}cʏcʟᴇ 10{'           '}7 ᴅᴀʏs
            </text>
            <text x="0" y="64" style={textStyle}></text>
            <text x="0" y="80" style={textStyle}>
              {'  '}ʙᴀʟᴀɴcᴇ{'               '}Ξ850
            </text>
            <text x="0" y="96" style={textStyle}>
              {'  '}ᴘᴀʏouᴛs{'            '}$150000
            </text>
            <text x="0" y="112" style={textStyle}>
              {'  '}ᴛoᴋᴇɴ suᴘᴘʟʏ{'    '}1234567890
            </text>
            <text x="0" y="128" style={textStyle}>
              {'  '}ᴘʀoᴊᴇcᴛ owɴᴇʀ{'  '}0x0000…0000
            </text>
          </g>
        </g>
        <defs>
          <filter
            id="filter1"
            x="-3.36"
            y="26.04"
            width="298"
            height="150"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feMorphology
              operator="dilate"
              radius="0.1"
              in="SourceAlpha"
              result="thicken"
            />
            <feGaussianBlur in="thicken" stdDeviation="0.5" result="blurred" />
            <feFlood floodColor={'#' + previewTextColor} result="glowColor" />
            <feComposite
              in="glowColor"
              in2="blurred"
              operator="in"
              result="softGlow_colored"
            />
            <feMerge>
              <feMergeNode in="softGlow_colored" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="filter2"
            x="0"
            y="0"
            width="298"
            height="150"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feMorphology
              operator="dilate"
              radius="0.05"
              in="SourceAlpha"
              result="thicken"
            />
            <feGaussianBlur in="thicken" stdDeviation="0.25" result="blurred" />
            <feFlood floodColor={'#' + previewBgColor} result="glowColor" />
            <feComposite
              in="glowColor"
              in2="blurred"
              operator="in"
              result="softGlow_colored"
            />
            <feMerge>
              <feMergeNode in="softGlow_colored" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient
            id="paint0"
            x1="0"
            y1="202"
            x2="289"
            y2="202"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={'#' + previewAltBgColor} />
            <stop offset="0.119792" stopColor={'#' + previewBgColor} />
            <stop offset="0.848958" stopColor={'#' + previewBgColor} />
            <stop offset="1" stopColor={'#' + previewAltBgColor} />
          </linearGradient>
          <clipPath id="clip0">
            <rect width="289" height="150" />
          </clipPath>
        </defs>
      </svg>

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
