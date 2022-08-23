import { CopyOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext, useState } from 'react'

// Copies a given text to clipboard when clicked
export default function CopyTextButton({
  value,
  style = {},
}: {
  value: string | undefined
  style?: CSSProperties
}) {
  const { colors } = useContext(ThemeContext).theme
  const [copied, setCopied] = useState<boolean>(false)
  const copyText = () => {
    if (navigator) {
      navigator.clipboard.writeText(value ?? '')
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }
  return (
    <Tooltip
      trigger={['hover']}
      title={<span>{copied ? t`Copied!` : t`Copy to clipboard`}</span>}
    >
      <CopyOutlined
        onClick={copyText}
        className="copyIcon"
        style={{ ...style, paddingLeft: 10, color: colors.text.primary }}
      />
    </Tooltip>
  )
}
