import { CopyOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext, useState } from 'react'

// Copies a given text to clipboard when clicked
export default function CopyTextButton({
  value,
  style = {},
  button,
  tooltipText,
}: {
  value: string | undefined
  style?: CSSProperties
  button?: JSX.Element
  tooltipText?: string
}) {
  const { colors } = useContext(ThemeContext).theme
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = () => {
    if (navigator) {
      navigator.clipboard.writeText(value ?? '')
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  const _tooltipText = tooltipText ?? t`Copy to clipboard`

  return (
    <Tooltip
      trigger={['hover']}
      title={<span>{copied ? t`Copied!` : _tooltipText}</span>}
    >
      <span
        onClick={e => {
          e.stopPropagation()
          handleCopy()
        }}
        style={{ ...style, color: colors.text.primary, cursor: 'pointer' }}
        role="button"
      >
        {button ?? <CopyOutlined className="copyIcon" />}
      </span>
    </Tooltip>
  )
}
