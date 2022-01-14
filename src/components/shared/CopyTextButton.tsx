import { CopyOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { useState } from 'react'
import { t } from '@lingui/macro'

// Copies a given text to clipboard when clicked
export default function CopyTextButton({
  value,
}: {
  value: string | undefined
}) {
  const [copied, setCopied] = useState<boolean>(false)
  const copyText = () => {
    navigator.clipboard.writeText(value ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <Tooltip
      trigger={['hover']}
      title={<span>{copied ? t`Copied!` : t`Copy to clipboard`}</span>}
    >
      <CopyOutlined onClick={copyText} />
    </Tooltip>
  )
}
