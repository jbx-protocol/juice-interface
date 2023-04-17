import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
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
        className="cursor-pointer"
        onClick={e => {
          e.stopPropagation()
          handleCopy()
        }}
        role="button"
      >
        {button ?? <ClipboardDocumentIcon className="inline h-4 w-4" />}
      </span>
    </Tooltip>
  )
}
