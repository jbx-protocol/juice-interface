import { CopyOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { useState } from 'react'

// Copies a given text to clipboard when clicked
export default function CopyTextButton({
  className,
  value,
  button,
  tooltipText,
}: {
  className?: string
  value: string | undefined
  button?: JSX.Element
  tooltipText?: string
}) {
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
      className={className}
      trigger={['hover']}
      title={<span>{copied ? t`Copied!` : _tooltipText}</span>}
    >
      <span
        className="cursor-pointer text-black dark:text-grey-100"
        onClick={e => {
          e.stopPropagation()
          handleCopy()
        }}
        role="button"
      >
        {button ?? <CopyOutlined />}
      </span>
    </Tooltip>
  )
}
